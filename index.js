import { createServer } from 'http';

const server = createServer((request, response) => {
  response.end('Hello World');
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`The server started on port ${PORT}`);
});
