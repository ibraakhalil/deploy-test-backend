import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import { Application } from 'express';
import { schema } from './schemas/index';

export async function startServer(app: Application) {
  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginCacheControl()],
  });

  await server.start();

  app.use('/graphql', expressMiddleware(server));

  app.listen(5000, () => {
    console.log('Server is running at http://localhost:5000/graphql');
  });
}
