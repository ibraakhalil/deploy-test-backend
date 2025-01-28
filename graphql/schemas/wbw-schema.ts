import { attributeFields } from 'graphql-sequelize';
import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLResolveInfo, GraphQLString } from 'graphql/type';
import { col } from 'sequelize';
import WBW from '../../models/wbw-model';
import { wordsToAyahGrouper } from '../../services/wbw-services';
import { simplifyInfo } from '../utils/simplify-info';

export const WBWType = new GraphQLObjectType({
  name: 'WBW',
  fields: {
    ...attributeFields(WBW),
    word_meaning: { type: GraphQLString },
    ayah_marker: { type: GraphQLBoolean },
  },
});

const AyahType = new GraphQLObjectType({
  name: 'Ayah',
  fields: {
    surah_id: { type: GraphQLInt },
    ayah_id: { type: GraphQLInt },
    words: { type: new GraphQLList(WBWType) },
  },
});

export const WBWResolver = {
  type: new GraphQLList(AyahType),
  args: {
    surah_id: { type: GraphQLInt },
    ayah_id: { type: GraphQLInt },
    page: { type: GraphQLInt },
    para: { type: GraphQLInt },
    lang: { type: GraphQLString },
  },
  resolve: async (_: any, args: any, ctx: any, info: GraphQLResolveInfo) => {
    // const cacheKey = JSON.stringify(args);
    // const cachedData = cache.get(cacheKey);

    // if (cachedData) {
    //   console.log('Cached Hit');
    //   return cachedData;
    // }

    const { lang, ...whereArgs } = args;
    const { words } = simplifyInfo(info.fieldNodes[0].selectionSet);
    let requestedFields: any[] = words ? Object.keys(words).filter(w => w !== 'word_meaning') : [];

    if (lang) {
      requestedFields.push([col(lang), 'word_meaning']);
    }

    const allWords = await WBW.findAll({
      where: whereArgs,
      attributes: ['surah_id', 'ayah_id', ...requestedFields],
      raw: true,
    });

    const ayahWords = wordsToAyahGrouper(allWords);

    // cache.set(cacheKey, ayahWords);

    return ayahWords;
  },
};
