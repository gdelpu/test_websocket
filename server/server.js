const Hapi = require('@hapi/hapi');
const Nes = require('@hapi/nes');
const crypto = require('crypto');


const server = new Hapi.Server({ port: 5000 });

const uuid = crypto.randomUUID()
const start = async () => {



    await server.register(Nes);
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
    console.log('server started');
};

start();
setInterval(() => server.publish("/message", { uuid, message: `new msg at ${Date.now()}` }), 5000)