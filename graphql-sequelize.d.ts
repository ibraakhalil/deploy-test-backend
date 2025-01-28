declare module 'graphql-sequelize' {
  import { Model } from 'sequelize';
  import { GraphQLFieldConfig, GraphQLFieldConfigMap } from 'graphql';

  // Resolver function from graphql-sequelize
  export function resolver(model: typeof Model, options?: any): GraphQLFieldConfig<any, any>;

  // Function for generating default list arguments (e.g., for pagination)
  export function defaultListArgs(): any;

  // Function for generating default arguments (e.g., for single item queries)
  export function defaultArgs(): any;

  // Function to dynamically generate GraphQL fields from Sequelize models
  export function attributeFields(model: typeof Model, options?: any): GraphQLFieldConfigMap<any, any>;
}
