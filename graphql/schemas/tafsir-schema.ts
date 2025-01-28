// import { attributeFields, resolver } from 'graphql-sequelize';
// import { GraphQLInt, GraphQLList, GraphQLObjectType } from 'graphql/type';
// import EnKathir from '../../models/tafsir/en_kathir';
// import { WBWResolver } from './wbw-schema';

// const TafsirType = new GraphQLObjectType({
//   name: 'Tafsir',
//   fields: { ...attributeFields(EnKathir), words: WBWResolver },
// });

// export const tafsirResolver = {
//   type: new GraphQLList(TafsirType),
//   args: {
//     surah_id: { type: GraphQLInt },
//     ayah_id: { type: GraphQLInt },
//   },
//   resolve: resolver(EnKathir),
// };
