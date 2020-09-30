'use strict';

const Hapi = require('@hapi/hapi');

// test counter
let counter = 0;

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);

    server.ext('onRequest', (request, h) => {
        console.log(`Counter is at ${counter}`);
        counter++;
        return h.continue;
    });

    server.events.on('response', function (request) {
        throw new Error('boom');
        return;
    });

    server.events.on('response', function (request) {
        console.log('decrement counter');
        counter--;
    });
};

process.on('unhandledRejection', (err) => {
    console.log('unhandled exception:', err);
});

init();