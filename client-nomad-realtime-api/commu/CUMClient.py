# coding: utf-8

import os
import sys
import ssl
import json
import time
import threading
import yaml
import codecs
import random
import argparse
import requests
import websocket
import datetime
import logging
from logging import getLogger, StreamHandler, Formatter

class cumclient(object):
    def __init__(self,clientid,room,commuid,config,logger=None):
        if logger is not None:
            self.logger = logger
        else:
            self.logger = getLogger('CUMClient')
            self.logger.setLevel(logging.DEBUG)
            stream_handler = StreamHandler()
            stream_handler.setLevel(logging.DEBUG)
            stream_handler.setFormatter(Formatter('%(asctime)s\t%(name)s\t%(levelname)s\t%(message)s'))
            self.logger.addHandler(stream_handler)

        try:
            with codecs.open(config,'r','utf-8') as f:
                self.config = yaml.load(f,Loader=yaml.SafeLoader)
            self.robot = self.config['Setting']['robots']['robot_'+str(commuid)]['type']
            self.voice = self.config['Setting']['robots']['robot_'+str(commuid)]['voice']
            self.configpath = os.path.abspath(os.path.dirname(config))
        except Exception as e:
            self.logger.error('CUMClient;__init__;error=%s&info=%s'%(str(type(e)),e))

        self.room = room
        self.clientid = int(clientid)
        self.cid = commuid

    def connect(self,url):
        pass

    def send(self,jsonObj):
        pass

    def getCurrentTime(self):
        now = datetime.datetime.now()
        return now.strftime("%Y-%m-%d-%H-%M-%S-%f")
    
    def getUniqID(self):
        time = self.getCurrentTime()
        c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        r = ''
        for i in range(8):
            r += c[random.randint(0,len(c)-1)]
        return time + ':' + r

    def set_idle(self,isOn):
        _id = self.getUniqID()
        msg = {'id':_id,'topic':'command','client':self.clientid,'room':self.room,'commu':self.cid,'@class':'commu.message.CommandInfo'}
        if isOn:
            msg['label'] = 'idle_on'
        else:
            msg['label'] = 'idle_off'
        return self.send(msg)
    
    def cancel_say(self):
        _id = self.getUniqID()
        msg = {'id':_id,'topic':'command','client':self.clientid,'room':self.room,'commu':self.cid,'@class':'commu.message.CommandInfo'}
        msg['label'] = 'cancel_say'
        return self.send(msg)
    
    def cancel_look(self):
        _id = self.getUniqID()
        msg = {'id':_id,'topic':'command','client':self.clientid,'room':self.room,'commu':self.cid,'@class':'commu.message.CommandInfo'}
        msg['label'] = 'cancel_look'
        return self.send(msg)
    
    def cancel_gesture(self):
        _id = self.getUniqID()
        msg = {'id':_id,'topic':'command','client':self.clientid,'room':self.room,'commu':self.cid,'@class':'commu.message.CommandInfo'}
        msg['label'] = 'cancel_gesture'
        return self.send(msg)
    
    def cancel_led(self):
        _id = self.getUniqID()
        msg = {'id':_id,'topic':'command','client':self.clientid,'room':self.room,'commu':self.cid,'@class':'commu.message.CommandInfo'}
        msg['label'] = 'cancel_led'
        return self.send(msg)
    
    def say_raw(self,voice,text,speed,volume,pitch,pause,_id=''):
        if _id == '':
            _id = self.getUniqID()
        msg = {'id':_id,'topic':'command','client':self.clientid,'room':self.room,'commu':self.cid,'@class':'commu.message.SayInfo'}
        msg['label'] = 'say'
        msg['text'] = text
        msg['voice'] = voice
        msg['speed'] = speed
        msg['volume'] = volume
        msg['pitch'] = pitch
        msg['pause'] = pause
        return self.send(msg)

    def say(self,text,_id=''):
        return self.say_raw(self.voice['name'],text,self.voice['speed'],self.voice['volume'],self.voice['pitch'],self.voice['pause'],_id)

    # def play_wav(self,wavname):
        

    def look_raw(self,pos,cr,speed,name='manual',_id=''):
        if _id == '':
            _id = self.getUniqID()
        msg = {'id':_id,'topic':'command','client':self.clientid,'room':self.room,'commu':self.cid,'@class':'commu.message.LookInfo'}
        msg['label'] = 'look'
        msg['name'] = name
        msg['pos'] = pos
        msg['cr'] = cr
        msg['speed'] = speed
        return self.send(msg)
        
    def look_label(self,label_pos,label_cr='normal',label_speed='normal',_id=''):
        pos = [0,0,0]
        cr = [0,0,0,0,0,0]
        speed = [0,0,0,0,0,0,0]
        if label_pos in self.config['LookTable']['position']:
            pos = [float(x) for x in self.config['LookTable']['position'][label_pos]]
        else:
            self.logger.error('CUMClient;look;info=%s&label=%s'%('no position label',label_pos))
            
        if label_cr in self.config['LookTable']['contribution_ratio']:
            cr = [float(x) for x in self.config['LookTable']['contribution_ratio'][label_cr]]
        else:
            self.logger.error('CUMClient;look;info=%s&label=%s'%('no cr label',label_cr))
            
        if label_speed in self.config['LookTable']['speed']:
            speed = [float(x) for x in self.config['LookTable']['speed'][label_speed]]
        else:
            self.logger.error('CUMClient;look;info=%s&label=%s'%('no speed label',label_speed))
            
        return self.look_raw(pos,cr,speed,'-'.join([label_pos,label_cr,label_speed]),_id)
    
    def look_position(self,pos,label_cr='normal',label_speed='normal',_id=''):
        pos = pos
        cr = [0,0,0,0,0,0]
        speed = [0,0,0,0,0,0,0]
            
        if label_cr in self.config['LookTable']['contribution_ratio']:
            cr = [float(x) for x in self.config['LookTable']['contribution_ratio'][label_cr]]
        else:
            self.logger.error('CUMClient;look;info=%s&label=%s'%('no cr label',label_cr))
            
        if label_speed in self.config['LookTable']['speed']:
            speed = [float(x) for x in self.config['LookTable']['speed'][label_speed]]
        else:
            self.logger.error('CUMClient;look;info=%s&label=%s'%('no speed label',label_speed))
            
        return self.look_raw(pos,cr,speed,'-'.join(['manual',label_cr,label_speed]),_id)

    def gesture_raw(self,strges,name='manual',relative='false',_id=''):
        if _id == '':
            _id = self.getUniqID()
        msg = {'id':_id,'topic':'command','client':self.clientid,'room':self.room,'commu':self.cid,'@class':'commu.message.GestureInfo'}
        msg['label'] = 'gesture'
        msg['name'] = name
        msg['data'] = strges
        msg['relative'] = relative
        return self.send(msg)
        
    def gesture(self,label_ges,relative='false',_id=''):
        strges = '0.0\tt'
        ext = '.s3r' if self.robot == 'commu' else '.s4r'
        fpath = self.configpath+'/'+self.config['GestureFilePath'] + label_ges + ext
        if os.path.isfile(fpath):
            with codecs.open(fpath,'r','utf-8') as f:
                strges = f.read().replace('\r','')
        else:
            self.logger.error('CUMClient;gesture;info=%s&file=%s'%('no file',fpath))

        # print('strges',strges)
        return self.gesture_raw(strges,label_ges,relative,_id)

    def move(self,jointID,angle,speed):
        msg = {'id':self.getUniqID(),'topic':'command','client':self.clientid,'room':self.room,'commu':self.cid,'@class':'commu.message.MoveInfo'}
        msg['label'] = 'move'
        msg['joint'] = jointID
        msg['angle'] = angle
        msg['speed'] = speed
        
        return self.send(msg)
    
    def move_multi(self,jointIDs,angles,speeds):
        msg = {'id':self.getUniqID(),'topic':'command','client':self.clientid,'room':self.room,'commu':self.cid,'@class':'commu.message.MoveMultiInfo'}
        msg['label'] = 'move_multi'
        msg['joints'] = jointIDs
        msg['angles'] = angles
        msg['speeds'] = speeds
        return self.send(msg)

    def setEyeColor(self,color,speed):
        msg = {'id':self.getUniqID(),'topic':'command','client':self.clientid,'room':self.room,'commu':self.cid,'@class':'commu.message.LedInfo'}
        msg['label'] = 'led'
        msg['target'] = 'eye'
        msg['color'] = [color[0],color[1],color[2]]
        msg['speed'] = speed
        return self.send(msg)

    def setMouthColor(self,color,speed):
        msg = {'id':self.getUniqID(),'topic':'command','client':self.clientid,'room':self.room,'commu':self.cid,'@class':'commu.message.LedInfo'}
        msg['label'] = 'led'
        msg['target'] = 'mouth'
        msg['color'] = [color,color,color]
        msg['speed'] = speed
        return self.send(msg)

    def setCheekColor(self,color,speed):
        msg = {'id':self.getUniqID(),'topic':'command','client':self.clientid,'room':self.room,'commu':self.cid,'@class':'commu.message.LedInfo'}
        msg['label'] = 'led'
        msg['target'] = 'cheek'
        msg['color'] = [color,color,color]
        msg['speed'] = speed
        return self.send(msg)
    
    def setChestColor(self,color,speed):
        msg = {'id':self.getUniqID(),'topic':'command','client':self.clientid,'room':self.room,'commu':self.cid,'@class':'commu.message.LedInfo'}
        msg['label'] = 'led'
        msg['target'] = 'chest'
        msg['color'] = [color[0],color[1],color[2]]
        msg['speed'] = speed
        return self.send(msg)
    def setLaunchColor(self,color,speed):
        msg = {'id':self.getUniqID(),'topic':'command','client':self.clientid,'room':self.room,'commu':self.cid,'@class':'commu.message.LedInfo'}
        msg['label'] = 'led'
        msg['target'] = 'launch'
        msg['color'] = [color[0],color[1],color[2]]
        msg['speed'] = speed
        return self.send(msg)

    def set_user_gaze(self,ypos):
        ret = []
        for k,v in self.config['LookTable']['position'].items():
            if k.endswith('user'):
                v[1] = int(ypos)
                ret.append('%s:%s'%(k,json.dumps(self.config['LookTable']['position'][k])))
        return '&'.join(ret)

    # これだけ送り先が違う
    def synthesize(self,text):
        msg = {'@class':'commu.message.SynthesizeInfo'}
        msg['text'] = text
        msg['voice'] = 'yuuto'
        msg['speed'] = 1.0
        msg['volume'] = 1.0
        msg['pitch'] = 1.0
        msg['pause'] = 1.0
        return self.send(msg)
        
        
    
class HTTPClient(cumclient):
    def __init__(self,clientid,room,commuid,config,logger=None):
        super().__init__(clientid,room,commuid,config,logger)
        
    def connect(self,url,crt=''):
        
        self.url = url + 'post' if url[-1] == '/' else url + '/post'
        self.crt = crt
        self.logger.info('HTTPClient;connect;url=%s&crt=%s'%(self.url,self.crt))
        
    def send(self,jsonObj):
        self.logger.info('HTTPClient;send;msg=%s'%(json.dumps(jsonObj)))
        try:
            if self.crt == '':
                ret = json.loads(requests.post(self.url,data=json.dumps(jsonObj),headers={'Content-Type':'application/json'}).text)
            else:
              ret = json.loads(requests.post(self.url,data=json.dumps(jsonObj),headers={'Content-Type':'application/json'},verify=self.crt).text)  
        except Exception as e:
            self.logger.error('HTTPClient;send;error=%s&info=%s'%(str(type(e)),e))
            ret = None
        return ret

    
class WebSocketClient(cumclient):
    def __init__(self,clientid,room,commuid,config,logger=None):
        super().__init__(clientid,room,commuid,config,logger)
        self.isConnect = False

        
    def connect(self,url):
        self.url = url + 'command' if url[-1] == '/' else url + '/command'
        self.ws = websocket.WebSocketApp(self.url,
                                         on_message = self._on_message,
                                         on_open = self._on_open,
                                         on_error = self._on_error,
                                         on_close = self._on_close)
        self.isConnect = True
        self.logger.info('WebSocketClient;connect;url=%s'%self.url)
        
    def wait_forever(self):
        self.ws.run_forever(sslopt={"cert_reqs":ssl.CERT_NONE})
        #self.ws.run_forever()

    def close(self):
        self.isConnect = False
        self.ws.close()
        self.logger.info('WebSocketClient;close;cid=%d'%self.cid)

    def send(self,jsonObj):
        if self.isConnect:
            self.ws.send(json.dumps(jsonObj,ensure_ascii=False))
            self.logger.info('WebSocketClient;send;msg=%s'%(json.dumps(jsonObj,ensure_ascii=False)))
        else:
            self.logger.warning('WebSocketClient;send;warning=%s'%('already closed'))
            
    def _on_open(self,ws):
        self.logger.info('WebSocketClient;_on_open;cid=%d'%self.cid)
        
    def _on_error(self,ws,error):
        self.logger.error('WebSocketClient;_on_error;cid=%d&error=%s'%(self.cid,error))
        
    def _on_close(self,ws):
        self.isConnect = False
        self.close()
        self.logger.info('WebSocketClient;_on_close;cid=%d'%self.cid)
        
    def _on_message(self,ws,message):
        data = json.loads(message)
        
        if data['topic'] == 'init':
            self.logger.debug('CUMClient:on_message:info=%s&message=%s'%('init',message))
            self._id = data['client']
            self.send({'id':data['id'],'topic':'join','client':data['client'],'room':self.room,'commu':self.cid,'@class':'commu.message.InitializeInfo'})
        elif data['topic'] == 'event':
            try:
                self.func(self,data,self.logger)
            except Exception as e:
                self.logger.error('CUMClient:on_message;id=%d&error=%s' % (self.cid,e) )

    def setListener(self,func):
        self.func = func

    
        
def test(ws):
    time.sleep(5)
    ws.say('こんいちは')
        
def on_message(client,jsonObj,logger):
    print('Receive',jsonObj)
    if jsonObj['label'] == 'user_utt':
        client.say('よろしくね')
        
if __name__=='__main__':
    parser = argparse.ArgumentParser(
                    prog='CUMClient.py',
                    usage='python3 CUMClient.py -y [yaml file]',
                    description='description',
                    add_help=True,
                    )
    parser.add_argument('-y', '--yaml',action='store',type=str, default='../resources/sample.yml',help='yaml file')
    parser.add_argument('-c', '--cid',action='store',type=int, default=0, help='commu id')
    parser.add_argument('-i', '--id',action='store',type=int, default=0, help='client id')
    parser.add_argument('-r', '--room',action='store',type=str, default='NULL',help='client room')
    parser.add_argument('-d', '--host',action='store',required=True,type=str, help='client host')
    parser.add_argument('-p', '--port',action='store',required=True,type=int, help='client port')
    # parser.add_argument('-e', '--command',action='store',args='*',type=str, help='command')
    args = parser.parse_args()
    

    ## HTTPClient example
    # client = HTTPClient(args.id,args.room,args.cid,args.yaml)
    # client.connect(args.host,args.port)

    
    # Websocket example
    # client = WebSocketClient(args.id,args.room,args.cid,args.yaml)
    # client.setListener(on_message)
    # client.connect(args.host,args.port)
    # time.sleep(1)
    # th = threading.Thread(target=test,args=(client,))
    # th.start()

    # client.wait_forever()
