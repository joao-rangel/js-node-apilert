const environments = {
  development: {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'development'
  },
  production: {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production'
  }
}

const currentEnvironment = process.env.NODE_ENV || 'development';

const config = environments[currentEnvironment];

export default config;
