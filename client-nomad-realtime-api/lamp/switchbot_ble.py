import asyncio
from bleak import BleakScanner, BleakClient
import time

class Bulb:
    def __init__(self, address):
        self.device = self.get_device(address)


    async def __get_device_a(self, address):
        # デバイスをスキャンする
        devices = await BleakScanner.discover()
        for i, device in enumerate(devices):
            # print(device)
            print(device)
            # if device.name == 'WoBulb' and device.address == address:
            if device.name == 'WoBulb':
                print(device.details)
                device = devices[i]
                return device
        # print('device is found')
        print('not found')
        return 'error'


    async def __turn_on_a(self):
        async with BleakClient(self.device.address) as client:
            SERVICE_UUID = "cba20002-224d-11e6-9fb8-0002a5d5c51b"
            data_to_send = bytearray([0x57, 0x0f, 0x47, 0x01, 0x01])
            await client.write_gatt_char(SERVICE_UUID, data_to_send, response=True)
            print("Turn on")


    async def __turn_off_a(self):
        async with BleakClient(self.device.address) as client:
            SERVICE_UUID = "cba20002-224d-11e6-9fb8-0002a5d5c51b"
            data_to_send = bytearray([0x57, 0x0f, 0x47, 0x01, 0x02])
            await client.write_gatt_char(SERVICE_UUID, data_to_send, response=True)
            print("Turn off")
    

    async def __toggle_a(self):
        async with BleakClient(self.device.address) as client:
            SERVICE_UUID = "cba20002-224d-11e6-9fb8-0002a5d5c51b"
            data_to_send = bytearray([0x57, 0x0f, 0x47, 0x01, 0x03])
            await client.write_gatt_char(SERVICE_UUID, data_to_send, response=True)
            print("Toggle")


    async def  __change_color_a(self, r, g, b, brightness):
        async with BleakClient(self.device.address) as client:
            SERVICE_UUID = "cba20002-224d-11e6-9fb8-0002a5d5c51b"
            data_to_send = bytearray([0x57, 0x0f, 0x47, 0x01, 0x12, brightness, r, g, b])
            await client.write_gatt_char(SERVICE_UUID, data_to_send, response=True)
            print("Change Color")
    

    async def __change_brightness_a(self, brightness):
        async with BleakClient(self.device.address) as client:
            SERVICE_UUID = "cba20002-224d-11e6-9fb8-0002a5d5c51b"
            data_to_send = bytearray([0x57, 0x0f, 0x47, 0x01, 0x14, brightness])
            await client.write_gatt_char(SERVICE_UUID, data_to_send, response=True)
            print("Change Brightness")


    def get_device(self, address):
        return asyncio.run(self.__get_device_a(address))


    def turn_on(self):
        # asyncio.run(self.__turn_on_a())
        asyncio.create_task(self.__turn_on_a())


    def turn_off(self):
        # asyncio.run(self.__turn_off_a())
        asyncio.create_task(self.__turn_off_a())


    def toggle(self):
        # asyncio.run(self.__toggle_a())
        asyncio.create_task(self.__toggle_a())
    
    def change_color(self, r, g, b, brightness):
        if 0 <= r and r <= 255 and 0 <= g and g <= 255 and 0 <= b and b <= 255 and 0 <= brightness and brightness <= 100:
            # asyncio.run(self.__change_color_a(r, g, b, brightness))
            asyncio.create_task(self.__change_color_a(r, g, b, brightness))
        else:
            print('argument error!')
    

    def change_brightness(self, brightness):
        if 0 <= brightness and brightness <= 100:
            # asyncio.run(self.__change_brightness(brightness))
            asyncio.create_task(self.__change_brightness_a(brightness))
        else:
            print('argument error!')
    
    



# address = 'B0986655-B398-BFA2-9637-A5D380913581'
# color = Bulb(address)
# color.toggle()
# color.change_color(255, 255, 255, 0)
# time.sleep(0.5)
# color.turn_on()
# time.sleep(1)
# color.change_color(255, 255, 0, 100)
# time.sleep(1)
# color.change_color(255, 255, 255, 100)
# color.change_brightness(10)
# time.sleep(1)
# color.change_brightness(100)
# time.sleep(1)
# color.change_brightness(10)
# color.change_brightness(100)
# color.turn_off()