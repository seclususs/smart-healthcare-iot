const { Aedes } = require('aedes');

async function StartBroker() {
  try {
    const aedes = await Aedes.createBroker();
    const server = require('net').createServer(aedes.handle);
    const httpServer = require('http').createServer();
    const ws = require('websocket-stream');

    const MQTT_PORT = 1883;
    const WS_PORT = 9001;

    return new Promise((resolve) => {
      server.listen(MQTT_PORT, function () {
        console.log(`[BROKER] MQTT Server berjalan di port ${MQTT_PORT}`);

        ws.createServer({ server: httpServer }, aedes.handle);
        httpServer.listen(WS_PORT, function () {
          console.log(`[BROKER] WebSocket Server berjalan di port ${WS_PORT}`);
          resolve();
        });
      });
    });
  } catch (error) {
    console.error('[BROKER] Gagal menjalankan broker:', error);
  }
}

module.exports = StartBroker;
