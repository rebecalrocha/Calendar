#tipo controller, faz o mapeamento da rota com a funções
from app import app, db
from flask import request, jsonify, request, make_response
import json 
from app.models import User, Event
from datetime import datetime, timedelta
import jwt
from werkzeug.security import generate_password_hash, check_password_hash


def auth_user(request):
    token = None

    if 'api-key' in request.headers:
        token = request.headers['api-key']

    try:
        data = jwt.decode(token, app.config['SECRET_KEY'])
        logged_user = User.query.filter_by(id=data['user']).first()
    except:
        return None

    return logged_user


@app.route('/events', methods=['GET'])
def get_events():
    #usando ORM para fazer uma query 
    logged_user = auth_user(request)
    if logged_user is None:
        return jsonify({'message': 'user not authenticated'})

    #criando dicionario
    events = []
    for event in logged_user.events:
        events.append(event.serialize())

    #convertendo para json
    return jsonify({'events': events})


@app.route('/create-events', methods=['POST'])
def create_event():
    logged_user = auth_user(request)
    if logged_user is None:
        return jsonify({'message': 'user not authenticated'})

    event_params = json.loads(request.data)
    start = datetime.strptime(event_params['start_time'], '%Y-%m-%dT%H:%M:%S')
    end = datetime.strptime(event_params['end_time'], '%Y-%m-%dT%H:%M:%S')

    if start < end:
        event = Event()
        event.description = event_params['description']
        event.start_time = start
        event.end_time = end
        event.user_id = logged_user.id

        # salvando no banco
        db.session.add(event)
        db.session.commit()
        #criando dicionario e convertendo para json
        return jsonify({'event': event.serialize()})

    return jsonify({'message': 'start time must be earlier than end time'})


@app.route('/delete-event/<int:event_id>', methods=['POST'])
def delete_event(event_id):
    logged_user = auth_user(request)
    if logged_user is None:
        return jsonify({'message': 'user not authenticated'})

    event = Event.query.filter_by(id=event_id, user_id=logged_user.id).first()
    if event:
        db.session.delete(event)
        db.session.commit()
        return jsonify({'message': 'deleted'})

    return jsonify({'message': 'event not found'})


@app.route('/edit-event/<int:event_id>', methods=['POST'])
def edit_event(event_id):
    logged_user = auth_user(request)
    if logged_user is None:
        return jsonify({'message': 'user not authenticated'})

    event = Event.query.filter_by(id=event_id, user_id=logged_user.id).first()
    if event is None:
        return jsonify({'message': 'event not found'})

    event_params = json.loads(request.data)
    #se não passou horario no body do request, pega do banco
    try:
        start = datetime.strptime(event_params['start_time'], '%Y-%m-%dT%H:%M:%S')
    except:
        start = event.start_time
    try:
        end = datetime.strptime(event_params['end_time'], '%Y-%m-%dT%H:%M:%S') 
    except:
        end = event.end_time
     

    if start < end:
        if 'description' in event_params:
            event.description = event_params['description']
        if 'start_time' in event_params:
            event.start_time = start
        if 'end_time' in event_params:
            event.end_time = end
        db.session.commit()
        return jsonify({'event': event.serialize()})

    return jsonify({'message': 'start time must be earlier than end time'})


@app.route('/login', methods=['POST'])
def login_user():
    login_params = json.loads(request.data)
    logged_user = User.query.filter_by(email=login_params['email']).first()

    if logged_user:
         if check_password_hash(logged_user.password, login_params['password']):
            token = jwt.encode({
                'exp': datetime.utcnow() + timedelta(days=1),
                'user': logged_user.id
            }, app.config['SECRET_KEY'])
            return jsonify({'token': token.decode('UTF-8')})
    
    return jsonify({'message': 'user not found'})


@app.route('/register', methods=['POST'])
def register_user():
    user_params = json.loads(request.data) #email e senha para registrar
    #verifica se email já existe
    user_exist = User.query.filter_by(email=user_params['email']).first()
    if user_exist:
        return jsonify({'message': 'email already registered'})

    #converte senha em hash
    password = generate_password_hash(user_params['password'], method='sha256')

    #salva no banco
    u = User(email=user_params['email'], password=password)
    db.session.add(u)
    db.session.commit()

    return jsonify({'message': 'new user registrated'})