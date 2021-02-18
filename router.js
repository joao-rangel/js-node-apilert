export const handlers = {};

handlers.ping = (data, callback) => {
  callback(204);
}

handlers.notFound = (data, callback) => {
  callback(404);
}

export const router = {
  ping: handlers.ping
}
