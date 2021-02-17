import { createServer } from 'http';
import { parse } from 'url';

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

  response.end('Hello World');

  console.log(`Request received on path: ${trimmedPath}`);
  console.log(`Request. received method: ${method}`);
  console.log(`Req. query string parameters: ${JSON.stringify(queryStringObject)}`);
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`The server started on port ${PORT}`);
});
