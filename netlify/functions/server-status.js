// Netlify Serverless Function для проверки статуса сервера
const net = require('net');

exports.handler = async function(event, context) {
    const host = 'tcp.cloudpub.ru';
    const port = 27271;

    try {
        // Попытка подключения к Minecraft-серверу
        const isOnline = await checkServer(host, port);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                online: isOnline,
                host: host,
                port: port,
                message: isOnline ? "Сервер онлайн" : "Сервер offline"
            })
        };
    } catch (error) {
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                online: false,
                host: host,
                port: port,
                message: `Ошибка: ${error.message}`
            })
        };
    }
};

// Функция проверки сервера с использованием TCP-сокета
function checkServer(host, port, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();
        socket.setTimeout(timeout);

        socket.on('connect', () => {
            socket.destroy();
            resolve(true);
        });

        socket.on('timeout', () => {
            socket.destroy();
            resolve(false);
        });

        socket.on('error', (error) => {
            socket.destroy();
            resolve(false);
        });

        socket.connect(port, host);
    });
}
