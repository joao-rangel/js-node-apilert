import { createServer } from 'http';
import { parse } from 'url';
import { StringDecoder } from 'string_decoder';

const server = createServer((request, response) => {
  const parsedUrl = parse(request.url, true);

  const path = parsedUrl.pathname;
  let trimmedPath = path;

  const lastCharacterIndex = path.length - 1;
  if (path.slice(lastCharacterIndex) === '/') {
    trimmedPath = path.slice(0, lastCharacterIndex);
  };

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

    response.end('Hello World');
    console.log(`Request received with this payload: ${buffer}`);
  })
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`The server started on port ${PORT}`);
});
