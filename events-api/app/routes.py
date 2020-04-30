from app import app
from flask import request
import json 

#tipo controller, faz o mapeamento da rota com a funções


@app.route('/events', methods=['GET'])
def get_events():
    calendarEvents = {
        "events": [
            { "title": "event 1" },{ "title": "event 2" }
        ]
    }
    return json.dumps(calendarEvents)

@app.route('/events', methods=['POST'])
def create_event():
    event_params = json.loads(request.data)
    print(event_params)
    return "well done"
