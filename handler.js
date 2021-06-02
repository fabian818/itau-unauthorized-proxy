'use strict';
const request = require('./api/request.js');

module.exports.proxy = (event, context, callback) => {
    console.log(event);
    console.log(event.requestContext.authorizer);
    console.log('event');
    context.callbackWaitsForEmptyEventLoop = false;
    let input;
    if (event.path === undefined) {
        input = {
            path: `/${event.params.path.any.split('/').splice(1, event.params.path.any.split('/').length - 1).join('/')}`,
            method: event.context.method,
            querystring: event.queryStringParameters,
            body: event.body,
            router: event.params.path.any.split('/')[0]
        };
    }
    else {
        input = {
            path: `/${event.pathParameters.any.split('/').splice(1, event.pathParameters.any.split('/').length - 1).join('/')}`,
            method: event.httpMethod,
            body: event.body,
            querystring: event.queryStringParameters,
            router: event.pathParameters.any.split('/')[0]
        };
    }

    console.log(input);
    if (input.path.charAt( input.path.length-1 ) !== '/') {
        input.path = input.path + '/';
    }
    // input.path = input.path.replace('/me/', `/${uid}/`);
    request.api(input, data => {
        console.log('MY DATA', data);
        const response = {
            statusCode: data.status,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
            },
            body: JSON.stringify(data.message),
        };

        console.log(response)
        callback(null, response);
    })
};