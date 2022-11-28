import { DMMF } from '@prisma/generator-helper';

import { PRISMA_ACTION_MAP } from './extendedDMMFOutputType';
import { FormattedNames } from './formattedNames';

/////////////////////////////////////////////////
// CLASS
/////////////////////////////////////////////////

export class ExtendedDMMFSchemaField
  extends FormattedNames
  implements DMMF.SchemaField
{
  name: DMMF.SchemaField['name'];
  isNullable: DMMF.SchemaField['isNullable'];
  outputType: DMMF.SchemaField['outputType'];
  args: DMMF.SchemaField['args'];
  deprecation?: DMMF.SchemaField['deprecation'];
  documentation?: DMMF.SchemaField['documentation'];

  argName: string;
  modelType: string | DMMF.OutputType | DMMF.SchemaEnum;

  constructor(params: DMMF.SchemaField) {
    super(params.name);
    this.name = params.name;
    this.isNullable = params.isNullable;
    this.outputType = params.outputType;
    this.args = params.args;
    this.deprecation = params.deprecation;
    this.documentation = params.documentation;

    this.modelType = this.setType();
    this.argName = this.setArgName();
  }

  // filter out the typename from the prisma naming convention
  private setType() {
    const matchedPrismaAction = PRISMA_ACTION_MAP.find((elem) =>
      this.name.includes(elem),
    );

    const type = this.name.replace(matchedPrismaAction as string, '');
    return type;
  }

  // rebuild the typename used in prisma types
  private setArgName() {
    const matchedPrismaAction = PRISMA_ACTION_MAP.find((elem) =>
      this.name.includes(elem),
    );

    const prismaAction = matchedPrismaAction?.replace('One', 'Unique');

    // Todo extract the whole thing to map object where eacht prismaAction
    // has a matching string that returns the correct argName

    if (!prismaAction)
      throw new Error(`No prisma action found for ${this.name}`);

    const { pascalCase } = this.getStringVariants(prismaAction);

    console.log(prismaAction);

    if (prismaAction === 'aggregate') {
      return `${this.modelType}${pascalCase}Args`;
    }

    if (prismaAction === 'groupBy') {
      return `${this.modelType}GroupByArgs`;
    }

    return `${this.modelType}${pascalCase}Args`;
  }
}