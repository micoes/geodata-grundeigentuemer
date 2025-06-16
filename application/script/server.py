import http.server
import socketserver
import webbrowser
import threading
import os
import sys
import signal
import asyncio
import websockets
import logging
import time
from datetime import datetime, timedelta

# Logging konfigurieren
logging.basicConfig(filename='server.log', level=logging.DEBUG, format='%(asctime)s %(message)s')

# Bestimme den Pfad zum Verzeichnis 'application' relativ zur EXE-Datei
if getattr(sys, 'frozen', False):
    # Wenn das Skript als gebündelte EXE-Datei ausgeführt wird
    application_dir = os.path.join(sys._MEIPASS, 'application')
else:
    # Wenn das Skript als reguläres Python-Skript ausgeführt wird
    application_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# Ändere das Arbeitsverzeichnis zum 'application' Ordner
try:
    os.chdir(application_dir)
    logging.debug(f"Changed working directory to {application_dir}")
except FileNotFoundError as e:
    logging.error(f"Error: {e}")
    sys.exit(1)

PORT = 8000
WS_PORT = 5678
Handler = http.server.SimpleHTTPRequestHandler

# Liste der aktiven Verbindungen
active_connections = set()
last_connection_time = datetime.now()

# Funktion zum Starten des HTTP-Servers
def start_server():
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            logging.debug(f"Server running at http://localhost:{PORT}/")
            webbrowser.open(f'http://localhost:{PORT}/index_color.html')
            httpd.serve_forever()
    except Exception as e:
        logging.error(f"Error starting HTTP server: {e}")
        sys.exit(1)

# WebSocket-Handler-Funktion
async def handler(websocket, path):
    global last_connection_time
    active_connections.add(websocket)
    last_connection_time = datetime.now()
    logging.debug(f"New connection. Active connections: {len(active_connections)}")

    try:
        async for message in websocket:
            if message == "close_server":
                logging.debug("Received 'close_server' message. Ignoring.")
                continue
    except Exception as e:
        logging.error(f"Error in WebSocket handler: {e}")
    finally:
        active_connections.remove(websocket)
        logging.debug(f"Connection closed. Active connections: {len(active_connections)}")
        last_connection_time = datetime.now()

# Funktion zum Überprüfen und Herunterfahren des Servers bei Inaktivität
def check_for_shutdown():
    global last_connection_time
    while True:
        if len(active_connections) == 0 and datetime.now() - last_connection_time > timedelta(minutes=5):
            logging.debug("No active connections. Shutting down.")
            os.kill(os.getpid(), signal.SIGTERM)
        time.sleep(60)

# Funktion zum Starten des WebSocket-Servers
def start_websocket_server():
    try:
        asyncio.set_event_loop(asyncio.new_event_loop())
        start_server = websockets.serve(handler, "localhost", WS_PORT)
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()
    except Exception as e:
        logging.error(f"Error starting WebSocket server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # Starte den WebSocket-Server in einem eigenen Thread
    threading.Thread(target=start_websocket_server).start()
    # Starte den Thread zur Überprüfung der Inaktivität
    threading.Thread(target=check_for_shutdown).start()
    # Starte den HTTP-Server
    start_server()
