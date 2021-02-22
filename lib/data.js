import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('.data');

const resolveFilePath = (directory, file) => (
  path.resolve(baseDir, directory, `${file}.json`)
);

const create = (directory, file, data, callback) => {
  const filePath = resolveFilePath(directory, file);

  fs.open(filePath, 'wx', (err, fileDescriptor) => {
    if (err || !fileDescriptor) {
      return callback('Could not create a new file, it may already exist');
    }

    const stringData = JSON.stringify(data);

    fs.writeFile(filePath, stringData, (err) => {
      if (err) return callback('Error writing to new file');

      fs.close(fileDescriptor, (err) => {
        if (err) return callback('Error closing new file');

        return callback(false);
      })
    })
  })
}

const read = (directory, file, callback) => {
  const filePath = resolveFilePath(directory, file);

  fs.readFile(filePath, (err, data) => {
    callback(err, data);
  });
}

export const lib = {
  baseDir,
  create,
  read,
};
