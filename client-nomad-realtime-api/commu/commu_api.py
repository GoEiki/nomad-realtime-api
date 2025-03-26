from base import Base
from CUMClient import HTTPClient
import uvicorn
import time
import wave
import pyaudio

class CommmuApi(Base, HTTPClient):
    def __init__(self, url):
        Base.__init__(self)
        HTTPClient.__init__(self, 0,'test', 0,'resources/sample.yml')
        self.connect(url)

        # commuには最初にエージェントはいない
        self.move(jointID=0, angle=-10, speed=5)
        self.move(jointID=6, angle=-15, speed=5)
        time.sleep(2)

    def appear(self, websocket=None):
        self.move(jointID=0, angle=0, speed=5)
        self.move(jointID=6, angle=0, speed=5)
        play_wav('r-appear.wav')
        return super().appear(websocket)

    def disappear(self, websocket=None):
        self.move(jointID=0, angle=-10, speed=5)
        self.move(jointID=6, angle=-15, speed=5)
        play_wav('r-disappear.wav')
        return super().disappear(websocket)
    
    def hello(self, websocket=None):
        self.gesture('yorosiku')
        return super().hello(websocket)
    
    def dance(self, websocket):
        self.gesture('dance0318')
        time.sleep(20)
        return super().dance(websocket)


def play_wav(file_path, output_index):
    # waveファイルを読み込む
    wf = wave.open(file_path, 'rb')

    p = pyaudio.PyAudio()

    # オーディオストリームを開く
    stream = p.open(format=p.get_format_from_width(wf.getsampwidth()),
                    channels=wf.getnchannels(),
                    rate=wf.getframerate(),
                    output_device_index=output_index,
                    output=True)

    # データを読み込み、再生
    chunk_size = 1024
    data = wf.readframes(chunk_size)
    while data:
        stream.write(data)
        data = wf.readframes(chunk_size)

    # 最後のバッファをフラッシュするための待機
    time.sleep(0.35)
    # ストリームを停止・終了
    stream.stop_stream()
    stream.close()

    # PyAudioを終了
    p.terminate()

    # ファイルを閉じる
    wf.close()


if __name__=='__main__':
    commu_ip = '10.0.1.249'
    commu_url = 'http://'+commu_ip+':11920'
    commu_api = CommmuApi(url=commu_url)
    uvicorn.run(commu_api.app, host="localhost", port=8765)
    