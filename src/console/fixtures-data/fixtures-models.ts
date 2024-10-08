import { faker } from '@faker-js/faker';
import {
  CarbonCreditOrigin,
  CarbonCreditType,
  Prisma,
  PrismaClient,
  Project,
  ProjectColor,
  Sdg,
} from '@prisma/client';
import slugify from 'slugify';
import { LasDeliciasCurvePoints } from './las-delicias';
import { BanegasFarmCurvePoints } from './banegas-farm';
import { PrismaService } from '../../infrastructure/prisma.service';
import { Vintage } from '../../domain/portfolio';
import { UlidIdGenerator } from '../../domain/common';
import { ManjarisoaCurvePoints } from './manjarisoa';
import { BokpynCurvePoints } from './bokpyn';
import { ChacoCurvePoints } from './chaco';
import { BraulioCurvePoints } from './braulio';
import { HeirZoomCurvePoints } from './heirzoom';
import { BioConcepcionAZCurvePoints } from './bio-concepcion';
import { BhadiaCurvePoints } from './bhadia';

const curvePointsMapping = {
  'Las Delicias': LasDeliciasCurvePoints,
  'Banegas Farm': BanegasFarmCurvePoints,
  Manjarisoa: ManjarisoaCurvePoints,
  'Bokpyn-Karathuru': BokpynCurvePoints,
  'Chaco Agroforestry': ChacoCurvePoints,
  'Braulio Carrillo': BraulioCurvePoints,
  HeirZoom: HeirZoomCurvePoints,
  'BioConcepcion AZ': BioConcepcionAZCurvePoints,
  'Bhadia ALSP': BhadiaCurvePoints,
};
const projectLinkedSdgs = {
  'Las Delicias': [8, 13, 14, 15],
  'Banegas Farm': [8, 13, 15],
  Manjarisoa: [8, 13, 15],
  'Bokpyn-Karathuru': [4, 5, 8, 13, 14, 15],
  'Chaco Agroforestry': [5, 8, 11, 12, 13],
  'Braulio Carrillo': [12, 13, 15],
  HeirZoom: [13],
  'BioConcepcion AZ': [7, 8, 9, 11, 12, 13, 15],
  'Bhadia ALSP': [7, 8, 13],
};

type Reference<T> = {
  name: string;
  value: T;
};

type DataFixturesModelFnInput<T> = {
  connection: PrismaClient;
  references: Array<Reference<T>>;
};

type DataFixture<T, U> = {
  name: string;
  count: number;
  object: U;
  model?: (input: DataFixturesModelFnInput<T>) => Promise<T>;
  data: Array<T>;
};

type DataFixtureFn = { prismaClient: PrismaService };

export const CertifierDataFixtures = ({
  prismaClient,
}: DataFixtureFn): DataFixture<
  Omit<Prisma.CertifierCreateManyInput, 'id'>,
  Prisma.CertifierDelegate
> => ({
  name: 'certifier',
  count: 10,
  object: prismaClient.certifier,
  model: async ({}) => {
    const name = faker.company.name();
    return { name, slug: slugify(name.toLowerCase()) };
  },
  data: [
    { name: 'Wildsense', slug: 'Wildsense' },
    { name: 'Verra', slug: 'serra' },
    { name: 'Gold Standard', slug: 'gold-standard' },
    { name: 'ERS', slug: 'ers' },
    { name: 'PuroEarth', slug: 'puroearth' },
  ],
});

export const CompanyDataFixtures = ({
  prismaClient,
}: DataFixtureFn): DataFixture<
  Prisma.CompanyCreateManyInput,
  Prisma.CompanyDelegate
> => ({
  name: 'company',
  count: 0,
  object: prismaClient.company,
  data: [
    {
      id: '01H5739RTVV0JV8M3DAN0C10ME',
      name: 'Carbonable',
      slug: 'carbonable',
    },
  ],
});

export const DevelopperDataFixtures = ({
  prismaClient,
}: DataFixtureFn): DataFixture<
  Prisma.DevelopperCreateManyInput,
  Prisma.DevelopperDelegate
> => ({
  name: 'developper',
  count: 0,
  object: prismaClient.developper,
  data: [
    {
      id: '00H5739MT3KXJ3RBQAATGWQ0RR',
      name: 'Fundacion Naturaleza Panama',
      slug: 'fundacion-naturaleza-panama',
    },
    {
      id: '01H5739RV1QHJCSE2GQTJ9B8PX',
      name: 'Corcovado Foundation',
      slug: 'corcovado-foundation',
    },
    {
      id: '01HHQ0645CCRGQXY1SSTQJ30G8',
      name: 'Forest Calling',
      slug: 'forest-calling',
    },
    {
      id: '01HHQ0CXB8XXKDAFPFY3D8N1F4',
      name: 'Wordview International Foundation',
      slug: 'wordview-international-foundation',
    },
    {
      id: '01HHY2E82MDSR6P5G83M0JZ8EB',
      name: 'Investancia',
      slug: 'investancia',
    },
    {
      id: '01HHY2EGR5D8T29V0CJEFX3TMQ',
      name: 'Baum',
      slug: 'baum',
    },
    {
      id: '01HHY2EGR5D8T29V0CJEFX3TMS',
      name: 'ClimeWorks',
      slug: 'climeworks',
    },
    {
      id: '01HHY2EGR5D8T29V0CJEFX3TGQ',
      name: 'Exomad Green',
      slug: 'exomad-green',
    },
    {
      id: '01HHY2EGR5D8T29V0CJEFX3TGW',
      name: 'Clean Solar Power',
      slug: 'clean-solar-power',
    },
  ],
});

export const SdgDataFixtures = ({
  prismaClient,
}: DataFixtureFn): DataFixture<
  Omit<Prisma.SdgCreateManyInput, 'id'>,
  Prisma.SdgDelegate
> => ({
  name: 'sdg',
  count: 0,
  object: prismaClient.sdg,
  model: async () => ({ number: 1, name: 'No Poverty' }),
  data: [
    { number: 1, name: 'No Poverty' },
    { number: 2, name: 'Zero Hunger' },
    { number: 3, name: 'Good Health and Well-being' },
    { number: 4, name: 'Quality Education' },
    { number: 5, name: 'Sex equalities' },
    { number: 6, name: 'Clean Water and Sanitation' },
    { number: 7, name: 'Affordable and Clean Energy' },
    { number: 8, name: 'Decent Work and Economic Growth' },
    { number: 9, name: 'Industry, Innovation and Infrastructure' },
    { number: 10, name: 'Reduced Inequalities' },
    { number: 11, name: 'Sustainable Cities and Communities' },
    { number: 12, name: 'Responsible Consumption and Production' },
    { number: 13, name: 'Climate Action' },
    { number: 14, name: 'Life Below Water' },
    { number: 15, name: 'Life on Land' },
    { number: 16, name: 'Peace and Justice Strong Institutions' },
    { number: 17, name: 'Partnerships to achieve the Goal' },
  ],
});

export const ProjectDataFixtures = ({
  prismaClient,
}: DataFixtureFn): DataFixture<
  Prisma.ProjectCreateManyInput,
  Prisma.ProjectDelegate
> => ({
  name: 'project',
  count: 0,
  object: prismaClient.project,
  data: [
    {
      id: '01H5739RVDH5MFVTHD90TBR92J',
      name: 'Banegas Farm',
      slug: 'forest-regeneration-banegas-farm-costa-rica',
      description:
        'the Banegas site is a patch of dirt and shrubs that was degraded over time due to overgrazing.',
      localization: '8.701643683464424, -83.5534715922547',
      startDate: '2022',
      endDate: '2052',
      area: 4,
      type: CarbonCreditType.RESTORATION,
      origin: CarbonCreditOrigin.FORWARD_FINANCE,
      fundingAmount: 17600,
      color: ProjectColor.BLUE,
      protectedForest: 4,
      protectedSpecies: 12,
      riskAnalysis: 'A',
      developperId: '01H5739RV1QHJCSE2GQTJ9B8PX',
      companyId: '01H5739RTVV0JV8M3DAN0C10ME',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      certifierId: (references: any) => {
        return references['certifier'].find((c: any) => c.name === 'ERS').id;
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      countryId: (references: any) => {
        return references['country'].find((c) => c.name === 'Costa Rica').id;
      },
      metadata: {
        sft_image_url:
          'https://imagedelivery.net/d5pVww362CQAQXDX2IiwAA/d295d1c3-f81d-4055-d99a-036a6a28bf00/public',
        collection_image_url:
          'https://imagedelivery.net/d5pVww362CQAQXDX2IiwAA/fb117dee-df87-4c66-3b5b-e58174245a00/public',
        impact_report_url:
          'https://carbonable.sextan.app/public/report/project/unfmb7pr514dah162',
      },
    },
    {
      id: '01H5739RVSRKHFVNM47AE4NHMK',
      name: 'Las Delicias',
      slug: 'mangroves-regeneration-las-delicias-panama',
      description:
        'Las Delicias is a mangrove restoration project located right outside of the municipality of Colón Island in the Bocas del Toro archipiélago, Panama.',
      localization: '9.402630368441974, -82.30576308181759',
      startDate: '2022',
      endDate: '2042',
      area: 180,
      type: CarbonCreditType.RESTORATION,
      origin: CarbonCreditOrigin.FORWARD_FINANCE,
      fundingAmount: 39600,
      color: ProjectColor.GREEN,
      protectedForest: 180,
      protectedSpecies: 132,
      riskAnalysis: 'A',
      developperId: '00H5739MT3KXJ3RBQAATGWQ0RR',
      companyId: '01H5739RTVV0JV8M3DAN0C10ME',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      certifierId: (references: any) => {
        return references['certifier'].find((c) => c.name === 'ERS').id;
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      countryId: (references: any) => {
        return references['country'].find((c) => c.name === 'Panama').id;
      },
      metadata: {
        sft_image_url:
          'https://imagedelivery.net/d5pVww362CQAQXDX2IiwAA/047bd991-6e26-4f4a-0ba6-a8e9d7106100/public',
        collection_image_url:
          'https://imagedelivery.net/d5pVww362CQAQXDX2IiwAA/75d8a63f-dd48-4f6c-98b0-2c54e8983900/public',
        impact_report_url:
          'https://carbonable.sextan.app/public/report/project/zulohdpr516dah162',
      },
    },
    {
      id: '01HHPZ4E2VX0RYE5X7YANHRNCT',
      name: 'Manjarisoa',
      slug: 'forest-regeneration-manjarisoa-madagascar',
      description:
        'Manjarisoa a project of 152 hectares of real forest in Manjarisoa, the future planting of 125,117 trees, and the creation of a carbon sink that stocks 77,219 tonnes of carbon in 20 years.',
      localization: '-18.455755744135708,49.103883937895546',
      startDate: '2022',
      endDate: '2052',
      area: 152,
      type: CarbonCreditType.RESTORATION,
      origin: CarbonCreditOrigin.FORWARD_FINANCE,
      fundingAmount: 1065622.2,
      color: ProjectColor.GREEN,
      protectedForest: 152,
      protectedSpecies: 25,
      riskAnalysis: 'A',
      developperId: '01HHQ0CXB8XXKDAFPFY3D8N1F4',
      companyId: '01H5739RTVV0JV8M3DAN0C10ME',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      certifierId: (references: any) => {
        return references['certifier'].find((c) => c.name === 'ERS').id;
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      countryId: (references: any) => {
        return references['country'].find((c) => c.name === 'Madagascar').id;
      },
      metadata: {
        sft_image_url:
          'https://imagedelivery.net/d5pVww362CQAQXDX2IiwAA/bb08ceec-e3fd-4620-b33d-a41d49531c00/public',
        collection_image_url:
          'https://imagedelivery.net/d5pVww362CQAQXDX2IiwAA/3f42f954-3b21-4856-f439-712cec9fa400/public',
        impact_report_url:
          'https://carbonable.sextan.app/public/report/project/7738fmpr517dah162',
      },
    },
    {
      id: '01HHQ0YPXR6H5D3AQGY4SK2JZT',
      name: 'Bokpyn-Karathuru',
      slug: 'mangroves-regeneration-karathuru-myanmar',
      description:
        'The project involves the regeneration of 228 ha in 2023 with the planting of 570,000 trees (2,500 per  ha), and the restoration of a carbon sink that will result in a forecasted amount of 374,285 certified carbon units amongst which 187,142 Carbon Units will be reserved for investors and the other half to local communities',
      localization: '10.5513, 98.3827',
      startDate: '2024',
      endDate: '2048',
      area: 228,
      type: CarbonCreditType.RESTORATION,
      origin: CarbonCreditOrigin.FORWARD_FINANCE,
      fundingAmount: 1669306.64,
      color: ProjectColor.ORANGE,
      protectedForest: 228,
      protectedSpecies: 104,
      riskAnalysis: 'AA',
      developperId: '01HHQ0CXB8XXKDAFPFY3D8N1F4',
      companyId: '01H5739RTVV0JV8M3DAN0C10ME',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      certifierId: (references: any) => {
        return references['certifier'].find((c) => c.name === 'Verra').id;
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      countryId: (references: any) => {
        return references['country'].find((c) => c.name === 'Madagascar').id;
      },
      metadata: {
        sft_image_url:
          'https://imagedelivery.net/d5pVww362CQAQXDX2IiwAA/795b36a8-042d-4c0b-c884-9f49f7397900/public',
        collection_image_url:
          'https://imagedelivery.net/d5pVww362CQAQXDX2IiwAA/90b3ad04-5c81-43ad-4d6a-ba024a6fd000/public',
        impact_report_url:
          'https://carbonable.sextan.app/public/report/project/cor2fkpr518dah162',
      },
    },
    {
      id: '01HHY25D9STVZM56SZX3A1S0JB',
      name: 'Chaco Agroforestry',
      slug: 'forest-regeneration-chaco-agroforestry-paraguay',
      description:
        'The Gran Chaco is a lowland region in Paraguay that was heavily deforested for cattle farming. Pongamia trees will be planted in the agricultural grazing lands but not overtaking them; the trees and cattle will share the land, and the farmers will be paid rent for the use of their land to plant these trees. The project covers 402 hectares. From 2022 until 2050, the total project will sequester 117,090 tons of carbon from the atmosphere.',
      localization: '-20.528115, -58.179342',
      startDate: '2025',
      endDate: '2055',
      area: 402,
      type: CarbonCreditType.RESTORATION,
      origin: CarbonCreditOrigin.FORWARD_FINANCE,
      fundingAmount: 1669306.64,
      color: ProjectColor.GREEN,
      protectedForest: 402,
      protectedSpecies: 2,
      riskAnalysis: 'A',
      developperId: '01HHQ0CXB8XXKDAFPFY3D8N1F4',
      companyId: '01H5739RTVV0JV8M3DAN0C10ME',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      certifierId: (references: any) => {
        return references['certifier'].find((c) => c.name === 'Verra').id;
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      countryId: (references: any) => {
        return references['country'].find((c) => c.name === 'Paraguay').id;
      },
      metadata: {
        sft_image_url:
          'https://imagedelivery.net/d5pVww362CQAQXDX2IiwAA/a6317953-de0c-4969-c86b-fb4d2261b200/public',
        collection_image_url:
          'https://imagedelivery.net/d5pVww362CQAQXDX2IiwAA/07cc38cc-0e44-45f8-db84-eef883e7d300/public',
        impact_report_url:
          'https://carbonable.sextan.app/public/report/project/71e7sbpr515dah162',
      },
    },
    {
      id: '01HHY25ZSHQAQM9CRM4AADMFRJ',
      name: 'Braulio Carrillo',
      slug: 'forest-regeneration-baum-invest-restoration-project-costa-rica',
      description:
        "The aim of the project is to reforest pasture land previously used for extensive cattle ranching in northern Costa Rica using mixed stands of various indigenous tree species as well as teak.The project comprises two reforestation sites covering a total area of 736 ha within the biosphere reserves ‘Agua y Paz’ and ‘Cordillera Volcanica Central’, both recognized under UNESCO's Man and the Biosphere programme",
      localization: '10.2433, -84.1746',
      startDate: '2007',
      endDate: '2035',
      area: 736,
      type: CarbonCreditType.RESTORATION,
      origin: CarbonCreditOrigin.DIRECT_PURCHASE,
      fundingAmount: 2442000,
      color: ProjectColor.GREEN,
      protectedForest: 736,
      protectedSpecies: 255,
      riskAnalysis: 'BBB',
      developperId: '01HHQ0CXB8XXKDAFPFY3D8N1F4',
      companyId: '01H5739RTVV0JV8M3DAN0C10ME',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      certifierId: (references: any) => {
        return references['certifier'].find((c) => c.name === 'Gold Standard')
          .id;
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      countryId: (references: any) => {
        return references['country'].find((c) => c.name === 'Costa Rica').id;
      },
      metadata: {
        sft_image_url:
          'https://imagedelivery.net/d5pVww362CQAQXDX2IiwAA/764c36aa-86dd-4538-8847-7c45bfbb3600/public',
        collection_image_url:
          'https://imagedelivery.net/d5pVww362CQAQXDX2IiwAA/1f89cd6e-2797-4f47-0a93-9e53868dfa00/public',
        impact_report_url:
          'https://carbonable.sextan.app/public/report/project/mjpigwpr519dah162',
      },
    },
    {
      id: '01HHY25ZSHQAQM9CRM4AADMFRH',
      name: 'HeirZoom',
      slug: 'heirzoom-dac-project-iceland',
      description:
        'In Heirzoom’s process, crushed limestone is heated to remove the CO₂ stored in the rock and then spread on stacked trays and hydrated to expose the now highly reactive rock to the ambient air. Over the course of three days (as opposed to the months to years it would take in nature) the minerals absorb CO₂. They’re then moved into an electric kiln and heated for a few seconds, resulting in a stream of CO₂ that can be paired with any type of permanent storage. The same crushed rock is then redistributed back onto the trays, and the cycle begins again.',
      localization: '64.043878, -21.399590',
      startDate: '2025',
      endDate: '2030',
      area: 0,
      type: CarbonCreditType.DAC,
      origin: CarbonCreditOrigin.FORWARD_FINANCE,
      fundingAmount: 26600000,
      color: ProjectColor.NA,
      protectedForest: 0,
      protectedSpecies: 0,
      riskAnalysis: 'A',
      developperId: '01HHY2EGR5D8T29V0CJEFX3TMS',
      companyId: '01H5739RTVV0JV8M3DAN0C10ME',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      certifierId: (references: any) => {
        return references['certifier'].find((c) => c.name === 'PuroEarth').id;
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      countryId: (references: any) => {
        return references['country'].find((c) => c.name === 'Iceland').id;
      },
      metadata: {
        sft_image_url:
          'https://imagedelivery.net/d5pVww362CQAQXDX2IiwAA/d4afbdf1-e75a-406a-9472-65e8e026a100/public',
        collection_image_url:
          'https://imagedelivery.net/d5pVww362CQAQXDX2IiwAA/f1b18862-78e4-4081-bfb4-dfc0156bf100/public',
        impact_report_url:
          'https://carbonable.sextan.app/public/report/project/unfmb7pr514dah162',
      },
    },
    {
      id: '01HHY25ZSHQAQM9CRM4AADMFGH',
      name: 'BioConcepcion AZ',
      slug: 'biochar-bioconcepcion-az-bolivia',
      description:
        "In March 2023 we launched our first biochar facility in Concepción, Bolivia. With the remaining two set to begin operations by December 2023 and March 2024. Together, these facilities will leverage the power of Biochar to sequester up to 200,000 tons of CO2 annually. But our vision goes beyond environmental impact. Exomad Green is about creating a better, more sustainable world for everyone. We're striving to improve the quality of life for over 250,000 regional inhabitants, generate green jobs, foster local economic growth, and champion environmental justice across the region. Join us as we embark on this transformative journey, turning residues into wealth and cultivating a more sustainable future.",
      localization: '-16.130514, -62.032408',
      startDate: '2023',
      endDate: '2028',
      area: 0,
      type: CarbonCreditType.BIOCHAR,
      origin: CarbonCreditOrigin.DIRECT_PURCHASE,
      fundingAmount: 4000000,
      color: ProjectColor.NA,
      protectedForest: 0,
      protectedSpecies: 0,
      riskAnalysis: 'AA',
      developperId: '01HHY2EGR5D8T29V0CJEFX3TMQ',
      companyId: '01H5739RTVV0JV8M3DAN0C10ME',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      certifierId: (references: any) => {
        return references['certifier'].find((c) => c.name === 'PuroEarth').id;
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      countryId: (references: any) => {
        return references['country'].find((c) => c.name === 'Bolivia').id;
      },
      metadata: {
        sft_image_url:
          'https://imagedelivery.net/d5pVww362CQAQXDX2IiwAA/d1d31f04-ffac-4ffb-d0cc-d90141b7a800/public',
        collection_image_url:
          'https://imagedelivery.net/d5pVww362CQAQXDX2IiwAA/bad4cfbc-a543-4753-23de-7d836de85800/public',
        impact_report_url:
          'https://carbonable.sextan.app/public/report/project/unfmb7pr514dah162',
      },
    },
    {
      id: '01HHY25ZSHQAQM9CRE4AADMFGH',
      name: 'Bhadia ALSP',
      slug: 'solar-panel-India-bhadia-alsp',
      description:
        'This large scale solar energy project by Clean Solar Power (Bhadla) Pvt. Ltd generates electricity using renewable solar energy. The project replaces emissions of greenhouse gases (GHG’s) estimated to be approximately 693,327 tCO2e per annum, thereby displacing 741,845 MWh/year amount of electricity from the generation-mix of power plants connected to the Indian electricity grid, which is mainly dominated by thermal/ fossil fuel-based power plant.',
      localization: '27.383833, 73.205540',
      startDate: '2019',
      endDate: '2038',
      area: 0,
      type: CarbonCreditType.SOLAR_PANEL,
      origin: CarbonCreditOrigin.DIRECT_PURCHASE,
      fundingAmount: 4000000,
      color: ProjectColor.NA,
      protectedForest: 0,
      protectedSpecies: 0,
      riskAnalysis: 'BB',
      developperId: '01HHY2EGR5D8T29V0CJEFX3TGW',
      companyId: '01H5739RTVV0JV8M3DAN0C10ME',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      certifierId: (references: any) => {
        return references['certifier'].find((c) => c.name === 'Gold Standard')
          .id;
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      countryId: (references: any) => {
        return references['country'].find((c) => c.name === 'India').id;
      },
      metadata: {
        sft_image_url:
          'https://imagedelivery.net/d5pVww362CQAQXDX2IiwAA/7ce224ea-36f4-4e65-1f1d-fc188e0dbd00/public',
        collection_image_url:
          'https://imagedelivery.net/d5pVww362CQAQXDX2IiwAA/f7425135-58b8-4212-25c3-eab0959e0b00/public',
        impact_report_url:
          'https://carbonable.sextan.app/public/report/project/unfmb7pr514dah162',
      },
    },
  ],
});

export const ProjectsSdgsDataFixtures = ({
  prismaClient,
}: DataFixtureFn): DataFixture<
  Omit<Prisma.ProjectsSdgsCreateManyInput, 'id'>,
  Prisma.ProjectsSdgsDelegate
> => ({
  name: 'projectSdgs',
  count: 1,
  object: prismaClient.projectsSdgs,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  model: async function* ({ references }) {
    const projects: Project[] = references['project'];
    const sdgs: Sdg[] = references['sdg'];

    for (const project of projects) {
      const linkedSdgs = projectLinkedSdgs[project.name];
      for (const sdg of linkedSdgs) {
        const item = sdgs.find((s) => s.number === sdg);
        yield {
          projectId: project.id,
          sdgId: item.id,
        };
      }
    }
  },
  data: [],
});

export const VintageDataFixtures = ({
  prismaClient,
}: DataFixtureFn): DataFixture<
  Omit<Prisma.VintageCreateManyInput, 'id'>,
  Prisma.VintageDelegate
> => ({
  name: 'vintage',
  count: 1,
  object: prismaClient.vintage,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  model: async function* ({ references }) {
    const projects: Project[] = references['project'];

    for (const project of projects) {
      const data = curvePointsMapping[project.name];

      const vintage = await Vintage.buildFromAbsorptionCurve(
        new UlidIdGenerator(),
        data,
      );
      for (const item of vintage) {
        yield {
          id: item.id,
          year: item.year,
          capacity: item.capacity,
          available: item.available,
          projectId: project.id,
          purchased: item.purchased,
          purchasedPrice: item.purchasePrice,
          issuedPrice: item.issuedPrice,
        };
      }
    }
  },
  data: [],
});

export const StockDataFixtures = ({
  prismaClient,
}: DataFixtureFn): DataFixture<
  Omit<Prisma.StockCreateManyInput, 'id'>,
  Prisma.StockDelegate
> => ({
  name: 'stock',
  count: 1,
  object: prismaClient.stock,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  model: async function* ({ references }) {
    const projects: Project[] = references['project'];
    const idGenerator = new UlidIdGenerator();

    for (const project of projects) {
      const vintages = await prismaClient.vintage.findMany({
        where: { projectId: project.id },
      });

      await prismaClient.stock.createMany({
        data: vintages.map((v) => ({
          id: idGenerator.generate(),
          vintage: v.year,
          quantity: v.capacity,
          available: v.available,
          consumed: 0,
          purchased: v.purchased,
          purchasedPrice: v.purchasedPrice,
          issuedPrice: v.issuedPrice,
          projectId: project.id,
        })),
      });
    }
  },
  data: [],
});
