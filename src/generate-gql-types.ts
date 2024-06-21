import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import * as path from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: [path.join('src/schemas/*.graphql')],
  path: path.join('src/schemas/graphql.autogenerated.ts'),
  outputAs: 'class',
});