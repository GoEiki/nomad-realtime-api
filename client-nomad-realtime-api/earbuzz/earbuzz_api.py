from base import Base
import wave
import pyaudio
import time
import uvicorn

class EarbuzzApi(Base):
    def appear(self, websocket = None):
        play_wav('r-appear.wav')
        return super().appear(websocket)


    def disappear(self, websocket):
        play_wav('r-disappear.wav')
        return super().disappear(websocket)


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
    earbuzz_api = EarbuzzApi()
    uvicorn.run(earbuzz_api.app, host="0.0.0.0", port=8765)