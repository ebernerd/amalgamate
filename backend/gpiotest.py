import RPi.GPIO as gpio
from pin_numbering import PinNumbering

gpio.setmode(gpio.BCM)

gpio.setup(int(PinNumbering.RED_BUTTON_INPUT.value), gpio.IN, pull_up_down=gpio.PUD_DOWN)

while True:
    print(gpio.input(int(PinNumbering.RED_BUTTON_INPUT.value)))