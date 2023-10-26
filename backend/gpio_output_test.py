import RPi.GPIO as gpio
from pin_numbering import PinNumbering

gpio.setmode(gpio.BCM)

gpio.setup(int(PinNumbering.GREEN_BUTTON_INPUT.value), gpio.IN, pull_up_down=gpio.PUD_DOWN)
gpio.setup(int(PinNumbering.GREEN_BUTTON_LED.value), gpio.OUT)
gpio.output(int(PinNumbering.GREEN_BUTTON_LED.value), gpio.LOW)

gpio.setup(int(PinNumbering.BLUE_BUTTON_INPUT.value), gpio.IN, pull_up_down=gpio.PUD_DOWN)
gpio.setup(int(PinNumbering.BLUE_BUTTON_LED.value), gpio.OUT)
gpio.output(int(PinNumbering.BLUE_BUTTON_LED.value), gpio.LOW)

gpio.setup(int(PinNumbering.RED_BUTTON_INPUT.value), gpio.IN, pull_up_down=gpio.PUD_DOWN)
gpio.setup(int(PinNumbering.RED_BUTTON_LED.value), gpio.OUT)
gpio.output(int(PinNumbering.RED_BUTTON_LED.value), gpio.LOW)

while True:
    if (gpio.input(int(PinNumbering.GREEN_BUTTON_INPUT.value))):
        gpio.output(int(PinNumbering.GREEN_BUTTON_LED.value), gpio.HIGH)
    else:
        gpio.output(int(PinNumbering.GREEN_BUTTON_LED.value), gpio.LOW)
        
    if (gpio.input(int(PinNumbering.BLUE_BUTTON_INPUT.value))):
        gpio.output(int(PinNumbering.BLUE_BUTTON_LED.value), gpio.HIGH)
    else:
        gpio.output(int(PinNumbering.BLUE_BUTTON_LED.value), gpio.LOW)
        
    if (gpio.input(int(PinNumbering.RED_BUTTON_INPUT.value))):
        gpio.output(int(PinNumbering.RED_BUTTON_LED.value), gpio.HIGH)
    else:
        gpio.output(int(PinNumbering.RED_BUTTON_LED.value), gpio.LOW)