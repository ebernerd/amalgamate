import asyncio
from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
import configparser
from pubsub import pub

#get config
config = configparser.ConfigParser()
config.read('slave_config.ini')
first_slave_address = config['DEFAULT']['Slave_one_address']
second_slave_address = config['DEFAULT']['Slave_two_address']
third_slave_address = config['DEFAULT']['Slave_three_address']

connection_count = 0

app = Flask(__name__)
app.config['SECRET_KEY'] = 'test'
socketio = SocketIO(app)

@socketio.on('update_button_led_status')
def handle_button_led_status_change_event(data):
    pub.sendMessage('changebuttonledstatus', arg1=data[0], arg2=bool(data[2]))
    '''
        Data[0] is the ButtonTypes enum (or numerical equivalent), Data[2] is a boolean describing the status (True=on, False=off)
        First letter of boolean MUST be capitalized.
    '''

@socketio.on('connect')
def handle_connection():
    global connection_count
    connection_count = connection_count + 1
    
@socketio.on('disconnect')
def handle_disconnect():
    global connection_count
    connection_count = connection_count - 1


def handle_input_event(arg1):
    global connection_count
    print('new button input event on websocket side:')
    print(arg1.value)
    if (connection_count > 0):
        emit('input_event', arg1.value, broadcast=True)

def start_server():
    socketio.run(app)

pub.subscribe(start_server, 'start')
pub.subscribe(handle_input_event, 'input_event')
