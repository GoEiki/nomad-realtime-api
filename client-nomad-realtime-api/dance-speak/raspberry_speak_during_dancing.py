import json
import subprocess
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading

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
                if data['speak'] == 'appear':
                    audio_file = 'r-appear.wav'
                elif data['speak'] == 'disappear':
                    audio_file = 'r-disappear.wav'
                elif data['speak'] == 'huh':
                    audio_file = 'huh.wav'
                elif data['speak'] == 'dont':
                    audio_file = 'dont_believe.wav'
                elif data['speak'] == 'tension':
                    audio_file = 'tension-up.wav'
                elif data['speak'] == 'yeah':
                    audio_file = 'yeah.wav'
                elif data['speak'] == 'dancetogether':
                    audio_file = 'dance_together.wav'
                elif data['speak'] == 'happy':
                    audio_file = 'happy.wav'
                else:
                    self.send_response(400)
                    self.send_header('Content-type', 'text/plain')
                    self.end_headers()
                    self.wfile.write(b'Invalid speak value')
                    return
                
                # 音声ファイルのフルパス
                audio_file = 'audio/' + audio_file
                
                # 別スレッドで音声を再生する
                threading.Thread(target=play_wav, args=(audio_file,)).start()
                
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


def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, AudioRequestHandler)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()


def play_wav(file_path):
    """ `aplay` コマンドを使用して WAV ファイルを再生する """
    subprocess.run(["aplay", file_path], check=True)

if __name__ == '__main__':
    run_server()
