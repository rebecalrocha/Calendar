#tipo controller, faz o mapeamento da rota com a funções
from app import app, db
from flask import request
import json 
from app.models import User, Event
from datetime import datetime


@app.route('/events', methods=['GET'])
def get_events():
    #usando ORM para fazer uma query 
    #pegando objeto com id=1
    logged_user = User.query.get(1)

    #criando dicionario
    events = {"events": []}

    for event in logged_user.events:
        events["events"].append(event.serialize())

    #convertendo para json
    return json.dumps(events)

@app.route('/create-events', methods=['POST'])
def create_event():
    logged_user = User.query.get(1)
    event_params = json.loads(request.data)
    
    event = Event()
    event.description = event_params["description"]
    event.start_time = datetime.strptime(event_params["start_time"], '%Y-%m-%dT%H:%M:%S')
    event.end_time = datetime.strptime(event_params["end_time"], '%Y-%m-%dT%H:%M:%S')
    event.user_id = logged_user.id

    # salvando no banco
    db.session.add(event)
    db.session.commit()

    #criando dicionario e convertendo para json
    return json.dumps({"event": event.serialize()})

@app.route('/delete-event', methods=['POST'])
def delete_event():
    logged_user = User.query.get(1)
    event_params = json.loads(request.data)
    print(event_params["event_id"])

    event = Event.query.filter_by(id=event_params["event_id"], user_id=logged_user.id).first()
    if event:
        db.session.delete(event)
        db.session.commit()
        return "deleted"
    return "event not found"

@app.route('/edit-event', methods=['POST'])
def edit_event():
    logged_user = User.query.get(1)
    event_params = json.loads(request.data)  

    event = Event.query.filter_by(id=event_params["event_id"], user_id=logged_user.id).first()
    if event:
        if "description" in event_params:
            event.description = event_params["description"]
        if "start_time" in event_params:
            event.start_time = datetime.strptime(event_params["start_time"], '%Y-%m-%dT%H:%M:%S')
        if "end_time" in event_params:
            event.end_time = datetime.strptime(event_params["end_time"], '%Y-%m-%dT%H:%M:%S')
            print(event.end_time)
        db.session.commit()
    
        return json.dumps({"event": event.serialize()})
    return "event not found"
