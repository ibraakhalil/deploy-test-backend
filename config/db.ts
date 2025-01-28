import dotenv from 'dotenv';
import path from 'path';
import { Sequelize, SyncOptions } from 'sequelize';
import { DatabaseConfig } from '../types/dbTypes';
dotenv.config();

const dbConfig: DatabaseConfig = {
  dialect: 'sqlite',
  storage: path.resolve(__dirname, process.env.DB_PATH || ''),
  logging: false,
  define: {
    underscored: true,
    freezeTableName: true,
    timestamps: true,
  },
};

const sequelize = new Sequelize(dbConfig);

const initiateDatabase = async (syncOptions: SyncOptions = {}): Promise<void> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(syncOptions);
    console.log('Database has been connected');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { initiateDatabase, sequelize };
