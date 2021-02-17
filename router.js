export const handlers = {};

handlers.sample = (data, callback) => {
  callback(406, { name: 'sample handler' });
}

handlers.notFound = (data, callback) => {
  callback(404);
}

export const router = {
  sample: handlers.sample
}
