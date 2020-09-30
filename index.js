'use strict';

const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');

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
        console.log(`Increment counter ${counter++} -> ${counter}`);
        return h.continue;
    });

    server.events.on('response', function (request) {
        console.error('throw a 503');
        throw Boom.serverUnavailable('rejected');
    });

    server.events.on('response', function (request) {
        console.log(`Decrement counter ${counter--} -> ${counter}`);
    });

    server.events.on('response', function (request) {
        console.log('Response finished');
    });
};

process.on('unhandledRejection', (err) => {
    // silence is golden
});

init();