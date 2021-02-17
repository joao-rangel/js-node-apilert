import { createServer } from 'http';
import { parse } from 'url';
import { StringDecoder } from 'string_decoder';

import { handlers, router } from './router.js';
import { stat } from 'fs';

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

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`The server started on port ${PORT}`);
});
