import { createServer as createHttpServer } from 'http';
import { createServer as createHttpsServer } from 'https';
import { parse } from 'url';
import { StringDecoder } from 'string_decoder';
import fs from 'fs';

import config from './config.js';
import { handlers, router } from './router.js';
import { lib } from './lib/data.js';

lib.create('test', 'newFile', { test: 'Hello test!' }, (err) => {
  console.log(`Error: ${err}`); // TODO remove after test
})

const httpServer = createHttpServer((request, response) => {
  unifiedServer(request, response);
});
httpServer.listen(config.httpPort, () => {
  console.log(`Server started on port: ${config.httpPort}`);
});

const httpsServer = createHttpsServer((request, response) => {
  unifiedServer(request, response);
});
const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
  port: config.httpsPort
};
httpsServer.listen(httpsServerOptions, config.httpsPort, () => {
  console.log(`Server started on port: ${config.httpsPort}`);
});

const unifiedServer = (request, response) => {
  const parsedUrl = parse(request.url, true);

  const path = parsedUrl.pathname;

  const splitPath = path.split('/');
  const trimmedSplitPath = splitPath.filter((term) => term !== '');
  const trimmedPath = trimmedSplitPath.join('/');

  const method = request.method.toUpperCase();

  const queryStringObject = parsedUrl.query;

  const headers = request.headers;

  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  request.on('data', (data) => {
    buffer += decoder.write(data);
  })

  request.on('end', () => {
    buffer += decoder.end();

    const chosenHandler = router[trimmedPath] || handlers.notFound;

    const requestData = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer
    }

    chosenHandler(requestData, (statusCode, payload) => {
      statusCode = (typeof statusCode === 'number') ? statusCode : 200;
      payload = (typeof payload === 'object') ? payload : {};

      const payloadString = JSON.stringify(payload);

      response.setHeader('Content-Type', 'application/json')
      response.writeHead(statusCode);
      response.end(payloadString);

      console.log('Returning this response: ', statusCode, payloadString);
    })

    console.log(`Request received with this payload: ${buffer}`);
  })
}
