import json
import argparse
import wave
import pyaudio
import time
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler

class AudioRequestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Get the content length of the incoming request
        content_length = int(self.headers['Content-Length'])
        
        # Read the POST data
        post_data = self.rfile.read(content_length)
        
        try:
            # Parse the JSON data
            data = json.loads(post_data.decode('utf-8'))
            
            # 'speak'キーが存在するか確認
            if 'speak' in data:
                # 再生する音声ファイルの名前を選択する
                audio_mapping = {
                    'appear': 'r-appear.wav',
                    'disappear': 'r-disappear.wav',
                    'huh': 'huh.wav',
                    'dont': 'dont_believe.wav',
                    'tension': 'tension-up.wav',
                    'yeah': 'yeah.wav',
                    'dancetogether': 'dance_together.wav',
                    'happy': 'happy.wav'
                }
                
                if data['speak'] not in audio_mapping:
                    self.send_response(400)
                    self.send_header('Content-type', 'text/plain')
                    self.end_headers()
                    self.wfile.write(b'Invalid speak value')
                    return
                
                # 別スレッドで音声を再生する
                audio_file = f'audio/{audio_mapping[data["speak"]]}'
                threading.Thread(target=play_wav, args=(audio_file, server.output_device)).start()
                
                # Send success response
                self.send_response(200)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(b'Audio played successfully')
            else:
                # 'speak'キーが存在しない場合
                self.send_response(400)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(b'Missing "speak" key in JSON')
        
        except json.JSONDecodeError:
            # Send error response for invalid JSON
            self.send_response(400)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'Invalid JSON')


def list_audio_devices():
    """List all available audio output devices."""
    p = pyaudio.PyAudio()
    device_count = p.get_device_count()
    print("Available Audio Output Devices:")
    for i in range(device_count):
        device_info = p.get_device_info_by_index(i)
        if device_info['maxOutputChannels'] > 0:
            print(f"Device {i}: {device_info['name']}")
    p.terminate()


def play_wav(file_path, output_device=None):
    """Play WAV file on specified output device."""
    # waveファイルを読み込む
    wf = wave.open(file_path, 'rb')

    p = pyaudio.PyAudio()

    # オーディオストリームを開く
    stream = p.open(format=p.get_format_from_width(wf.getsampwidth()),
                    channels=wf.getnchannels(),
                    rate=wf.getframerate(),
                    output=True,
                    output_device_index=output_device)

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


def run_server(port=8000, output_device=None):
    """Run the HTTP server for audio playback."""
    global server
    server_address = ('', port)
    server = HTTPServer(server_address, AudioRequestHandler)
    server.output_device = output_device
    print(f'Starting server on port {port}...')
    if output_device is not None:
        print(f'Using output device index: {output_device}')
    httpd.serve_forever()


def main():
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description='Audio Playback Server')
    parser.add_argument('-p', '--port', type=int, default=8000, 
                        help='Port number for the server (default: 8000)')
    parser.add_argument('-d', '--device', type=int, 
                        help='Output device index for audio playback')
    parser.add_argument('--list-devices', action='store_true', 
                        help='List available audio output devices')
    
    args = parser.parse_args()

    # List devices if requested
    if args.list_devices:
        list_audio_devices()
        return

    # Run the server
    run_server(port=args.port, output_device=args.device)


if __name__ == '__main__':
    main()