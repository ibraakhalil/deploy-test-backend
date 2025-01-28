import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLResolveInfo, GraphQLString } from 'graphql/type';
import { col } from 'sequelize';
import { Col } from 'sequelize/types/utils';
import WBW from '../../models/wbw-model';
import { transformWordsDataForV2, wordsToPageV2Grouper } from '../../services/wbw-services';
import { simplifyInfo } from '../utils/simplify-info';
import { WBWType } from './wbw-schema';

const filterValidFields = (requestedFields: string[], modelInstance: any) => {
  const modelAttributes = Object.keys(modelInstance.rawAttributes);
  return requestedFields.filter(field => modelAttributes.includes(field));
};

const LineType = new GraphQLObjectType({
  name: 'Line',
  fields: {
    line_number: { type: GraphQLInt },
    words: { type: new GraphQLList(WBWType) },
  },
});

const PageV2Type = new GraphQLObjectType({
  name: 'PageV2',
  fields: {
    page_v2: { type: GraphQLInt },
    lines: { type: new GraphQLList(LineType) },
  },
});

export const V2_SurahResolver = {
  type: new GraphQLList(PageV2Type),
  args: {
    surah_id: { type: GraphQLInt },
    page_v2: { type: GraphQLInt },
    para: { type: GraphQLInt },
    lang: { type: GraphQLString },
  },
  resolve: async (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
    const { lang, ...whereArgs } = args;
    const { lines } = simplifyInfo(info.fieldNodes[0].selectionSet);

    let requestedFields: string[] = lines.words ? Object.keys(lines.words).filter(w => w !== 'word_meaning' && w !== 'ayah_marker') : [];

    const validFields: (string | [Col, string])[] = filterValidFields(requestedFields, WBW);

    if (lang) {
      validFields.push([col(lang), 'word_meaning']);
    }

    const necessaryFields = ['line_number', 'page_v2'];
    const finalFields = [...new Set([...necessaryFields, ...validFields])];

    const allWords = await WBW.findAll({
      where: whereArgs,
      attributes: finalFields,
      raw: true,
    });

    const groupedWords = wordsToPageV2Grouper(allWords);
    return groupedWords;
  },
};

const SurahType = new GraphQLObjectType({
  name: 'SurahType',
  fields: {
    surah_id: { type: GraphQLInt },
    lines: { type: new GraphQLList(LineType) },
  },
});

const PageType = new GraphQLObjectType({
  name: 'PageType',
  fields: {
    page_v2: { type: GraphQLInt },
    surahs: { type: new GraphQLList(SurahType) },
  },
});

export const V2_PageResolver = {
  type: new GraphQLList(PageType),
  args: {
    page_v2: { type: GraphQLInt },
    para: { type: GraphQLInt },
  },
  resolve: async (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
    const selectedFields = simplifyInfo(info.fieldNodes[0].selectionSet);

    const requestedFields: string[] | null = selectedFields?.surahs.lines.words ? Object.keys(selectedFields?.surahs.lines.words) : null;

    const words = await WBW.findAll({
      where: args,
      attributes: requestedFields ? ['page_v2', 'surah_id', 'line_number', ...requestedFields] : undefined,
      raw: true,
    });

    const result = transformWordsDataForV2(words);

    return result;
  },
};
