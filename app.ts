import compression from 'compression';
import cors from 'cors';
import express from 'express';
import { initiateDatabase } from './config/db';
import { startServer } from './graphql/index';
import router from './routes/router';
const app = express();

app.use(
  compression({
    level: 9,
    threshold: 1024 * 20,
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

initiateDatabase()
  .then(async () => {
    startServer(app);
  })
  .catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
