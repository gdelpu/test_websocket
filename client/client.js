const Nes = require('@hapi/nes');

let client = new Nes.Client('ws://test-websocket-1209481832.eu-west-1.elb.amazonaws.com:5000');

const start = async () => {
    await client.connect();

    const { payload: uuid } = await client.request({
        path: "uuid",
        method: "POST"
    });

    client.subscribe('/message', (payload, flags) => {
        if (payload.uuid === uuid) {
            console.log(`${payload.message} from ${payload.uuid}`); // payload is the data published by the server
        } else {
            console.error('Server has changed')
        }
    });
};

start();

setInterval(()=>client.request({
    path: "message", // Can also request '/message'
    method: "POST",
    payload: { message: "Hello!"} }
), 1000)
