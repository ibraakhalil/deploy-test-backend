import { GraphQLObjectType, GraphQLSchema } from 'graphql/type';
import { translationResolver } from './translation-schema';
import { WBWResolver } from './wbw-schema';
import { V2_PageResolver, V2_SurahResolver } from './wbw-v2-schema';

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    wbw: WBWResolver,
    v2_page: V2_PageResolver,
    v2_surah: V2_SurahResolver,
    translation: translationResolver,
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
});
