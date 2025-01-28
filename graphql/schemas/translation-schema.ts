import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql/type';
import TranslationModel from '../../models/translations-model';
import { transformTranslations } from '../../services/translation-services';

const TranslationItemType = new GraphQLObjectType({
  name: 'TranslationItem',
  fields: {
    value: { type: GraphQLString },
    text: { type: GraphQLString },
  },
});

export const TranslationType = new GraphQLObjectType({
  name: 'Translation',
  fields: {
    ayah_id: { type: GraphQLInt },
    surah_id: { type: GraphQLInt },
    translations: { type: new GraphQLList(TranslationItemType) },
  },
});

export const translationResolver = {
  type: new GraphQLList(TranslationType),
  args: {
    surah_id: { type: GraphQLInt },
    ayah_id: { type: GraphQLInt },
    page: { type: GraphQLInt },
    para: { type: GraphQLInt },
    translations: {
      type: new GraphQLList(GraphQLString),
      description: 'Array of translation (e.g., ["saheeh_international", "bn_zakari", ...])',
    },
  },
  resolve: async (_: any, args: any) => {
    const { translations = [], ...whereArgs } = args;

    const verses = await TranslationModel.findAll({
      where: whereArgs,
      attributes: ['surah_id', 'ayah_id', ...translations],
      raw: true,
    });

    return transformTranslations(verses, translations);
  },
};
