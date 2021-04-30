import RPi.GPIO as gpio
from pin_numbering import PinNumbering
from button_type import ButtonTypes
from pubsub import pub

#hardware_controller.py
class hardware_controller():
    
    def __init__(self):
        #cleanup all previous gpio activity. Set global gpio object
        #to use BCM numbering for pins.
        gpio.cleanup()
        gpio.setmode(gpio.BCM)
        
        #setup all input pins (to view if button is pressed)
        gpio.setup(int(PinNumbering.GREEN_BUTTON_INPUT.value), gpio.IN, pull_up_down=gpio.PUD_DOWN)
        gpio.setup(int(PinNumbering.RED_BUTTON_INPUT.value), gpio.IN, pull_up_down=gpio.PUD_DOWN)
        gpio.setup(int(PinNumbering.BLUE_BUTTON_INPUT.value), gpio.IN, pull_up_down=gpio.PUD_DOWN)
        
        #setup all output pins and set them to LOW (to control LED)
        gpio.setup(int(PinNumbering.GREEN_BUTTON_LED.value), gpio.OUT)
        gpio.output(int(PinNumbering.GREEN_BUTTON_LED.value), gpio.LOW)
        
        gpio.setup(int(PinNumbering.RED_BUTTON_LED.value), gpio.OUT)
        gpio.output(int(PinNumbering.RED_BUTTON_LED.value), gpio.LOW)
        
        gpio.setup(int(PinNumbering.BLUE_BUTTON_LED.value), gpio.OUT)
        gpio.output(int(PinNumbering.BLUE_BUTTON_LED.value), gpio.LOW)
        
        #setup input interrupts
        gpio.add_event_detect(int(PinNumbering.GREEN_BUTTON_INPUT.value), gpio.RISING, callback=self.handle_input_event)
        gpio.add_event_detect(int(PinNumbering.RED_BUTTON_INPUT.value), gpio.RISING, callback=self.handle_input_event)
        gpio.add_event_detect(int(PinNumbering.BLUE_BUTTON_INPUT.value), gpio.RISING, callback=self.handle_input_event)
        
        self.blue_led_status = False
        self.red_led_status = False
        self.green_led_status = False
        
        pub.subscribe(self.change_button_led_status, 'changebuttonledstatus')
    
    def change_button_led_status(self, arg1, arg2):
        if (arg1 == ButtonTypes.BLUE):
            self.blue_led_status = arg2
            gpio.output(int(PinNumbering.BLUE_BUTTON_LED.value), gpio.HIGH if status else gpio.LOW)
        elif (arg1 == ButtonTypes.RED):
            self.red_led_status = arg2
            gpio.output(int(PinNumbering.RED_BUTTON_LED.value), gpio.HIGH if status else gpio.LOW)
        elif (arg1 == ButtonTypes.GREEN):
            self.green_led_status = arg2
            gpio.output(int(PinNumbering.GREEN_BUTTON_LED.value), gpio.HIGH if status else gpio.LOW)
            
    def handle_input_event(channel, value):
        print("hardware controller input event channel: ")
        print(value)
        #Determine button type
        button = ButtonTypes.BLUE
        if (value == int(PinNumbering.BLUE_BUTTON_INPUT.value)):
            button = ButtonTypes.BLUE
        elif (value == int(PinNumbering.RED_BUTTON_INPUT.value)):
            button = ButtonTypes.RED
        elif (value == int(PinNumbering.GREEN_BUTTON_INPUT.value)):
            button = ButtonTypes.GREEN
            
        #publish message about event with button type.
        pub.sendMessage('input_event', arg1=button)
        

