const Nes = require('@hapi/nes');

var client = new Nes.Client('ws://localhost:5000');

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