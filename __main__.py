import websocket
from hardware_controller import hardware_controller
from pubsub import pub

hardware_instance = hardware_controller()

pub.sendMessage('start')

#main.py - entry point to program