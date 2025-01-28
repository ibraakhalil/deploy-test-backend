// export const WBWResolver = {
//   type: new GraphQLList(BySurahType),
//   args: {
//     surah_id: { type: GraphQLInt },
//     ayah_id: { type: GraphQLInt },
//     page: { type: GraphQLInt },
//     page_v2: { type: GraphQLInt },
//     para: { type: GraphQLInt },
//   },
//   resolve: async (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
//     const where: any = {};

//     if (args) {
//       Object.keys(args).forEach(key => {
//         if (args[key] !== undefined) {
//           where[key] = args[key];
//         }
//       });
//     }

//     if (parent) {
//       where.surah_id = parent.surah_id;
//       where.ayah_id = parent.ayah_id;
//     }

//     // Get the requested fields from the GraphQL query
//     const requestedFields = getRequestedFields(info);

//     // Use the requested fields as the attributes in Sequelize's `findAll`
//     const results = await WBW.findAll({
//       where,
//       attributes: requestedFields.length ? requestedFields : undefined, // If no fields are requested, return all
//     });

//     return results;
//   },
// };
