const Hapi = require('@hapi/hapi');
const Nes = require('@hapi/nes');
const crypto = require('crypto');
const HapiPino = require('hapi-pino');


const server = new Hapi.Server({ address: '0.0.0.0',port: 5000 });

const uuid = crypto.randomUUID()
const start = async () => {



    await server.register([Nes, HapiPino]);
    server.route({
        method: 'POST',
        path: '/message',
        config: {
            id: 'message',
            handler: (request, h) => {
                const message = request.payload.message;
                console.log(`Message received: ${message}`);
                history.push(message);

                server.publish("/message", { uuid, message }); // publish the message to the clients
                return true;
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/uuid',
        config: {
            id: 'uuid',
            handler: (request, h) => {
                return uuid;
            }
        }
    });

    server.subscription('/message'); // declaring the subscription path

    await server.start();
};

start();
setInterval(() => server.publish("/message", { uuid, message: `new msg at ${Date.now()}` }), 5000)