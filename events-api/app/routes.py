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


def overlap(start_time, end_time, event = None):
    logged_user = auth_user(request)

    for user_event in logged_user.events:
        #caso esteja editando evento
        if event and event == user_event:
            continue

        range1 = (user_event.start_time, user_event.end_time)
        range2 = (start_time, end_time)

        latest_start = max(range1[0], range2[0])
        earliest_end = min(range1[1], range2[1])
        overlap = earliest_end - latest_start
        overlapMinutes = overlap.total_seconds() / 60

        if (overlapMinutes > 0.0):
            return True

    return False


#retorna todos os eventos
@app.route('/events', methods=['GET'])
def get_events():
    #ORM para fazer uma query 
    logged_user = auth_user(request)
    if logged_user is None:
        return jsonify({'error': 'User not authenticated!'})

    #criando dicionario
    events = []
    for event in logged_user.events:
        events.append(event.serialize())

    #convertendo para json
    return jsonify({'events': events})


#retorna só 1 evento
@app.route('/events/<int:id>', methods=['GET'])
def get_event(id):
    logged_user = auth_user(request)
    if logged_user is None:
        return jsonify({'error': 'User not authenticated!'})  
    
    for event in logged_user.events:
        if event.id == id:
            return jsonify({'event': event.serialize()})
    
    return jsonify({'error': 'Event not foun!d'})


@app.route('/events', methods=['POST'])
def create_event():
    logged_user = auth_user(request)
    if logged_user is None:
        return jsonify({'error': 'User not authenticated!'})

    event_params = json.loads(request.data)
    start = datetime.strptime(event_params['start_time'], '%Y-%m-%dT%H:%M:%S')
    end = datetime.strptime(event_params['end_time'], '%Y-%m-%dT%H:%M:%S')

    if start <= end:
        event = Event()
        event.description = event_params['description']
        event.start_time = start
        event.end_time = end
        event.user_id = logged_user.id

        #verifica se há overlap com eventos já existentes
        if overlap(event.start_time, event.end_time):
            return jsonify({'error': 'You cannot overlap another event!'})
        else:
            db.session.add(event)
            db.session.commit()
            return jsonify({'event': event.serialize()})

    return jsonify({'error': 'Start time must be earlier than end time!'})


@app.route('/events/<int:id>', methods=['PUT'])
def edit_event(id):
    logged_user = auth_user(request)
    if logged_user is None:
        return jsonify({'error': 'User not authenticated!'})

    event = Event.query.filter_by(id=id, user_id=logged_user.id).first()
    if event is None:
        return jsonify({'error': 'Event not found!'})

    event_params = json.loads(request.data)
    start = datetime.strptime(event_params['start_time'], '%Y-%m-%dT%H:%M:%S')
    end = datetime.strptime(event_params['end_time'], '%Y-%m-%dT%H:%M:%S') 
     
    if start <= end:
        event.description = event_params['description']
        event.start_time = start
        event.end_time = end

        #verifica se há overlap com eventos já existentes
        if overlap(event.start_time, event.end_time, event):
            return jsonify({'error': 'You cannot overlap another event!'})
        else:
            db.session.commit()
            return jsonify({'event': event.serialize()})

    return jsonify({'error': 'Start time must be earlier than end time!'})


@app.route('/events/<int:id>', methods=['DELETE'])
def delete_event(id):
    logged_user = auth_user(request)
    if logged_user is None:
        return jsonify({'error': 'User not authenticated!'})

    event = Event.query.filter_by(id=id, user_id=logged_user.id).first()
    if event:
        db.session.delete(event)
        db.session.commit()
        return jsonify({'message': 'Event deleted!'})

    return jsonify({'error': 'Event not found!'})


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
    
    return jsonify({'error': 'Email address or password is incorrect!'})


@app.route('/register', methods=['POST'])
def register_user():
    user_params = json.loads(request.data)
    
    user_exist = User.query.filter_by(email=user_params['email']).first()
    if user_exist:
        return jsonify({'error': 'Email already registered!'})

    #converte senha em hash
    password = generate_password_hash(user_params['password'], method='sha256')
    user = User(email=user_params['email'], password=password)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'New user registrated!'})