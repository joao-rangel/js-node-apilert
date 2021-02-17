const environments = {}

environments.development = {
  port: 3000,
  envName: 'development'
}

environments.production = {
  port: 5000,
  envName: 'production'
}

const currentEnvironment = process.env.NODE_ENV || 'development';

const config = environments[currentEnvironment];

export default config;
