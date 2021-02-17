import { createServer } from 'http';
import { parse } from 'url';
import { StringDecoder } from 'string_decoder';

import config from './config.js';
import { handlers, router } from './router.js';

const server = createServer((request, response) => {
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
});

server.listen(config.port, () => {
  console.log(`Server started on port: ${config.port} at environment: ${config.envName}`);
});
