import { config } from 'dotenv';
config();

export const url = process.env.HEROKU_CONNECTION_STRING
  ? process.env.HEROKU_CONNECTION_STRING
  : `${process.env.DB_PROVIDER}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

