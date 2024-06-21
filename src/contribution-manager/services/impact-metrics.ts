import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma.service';
import Utils from '../../utils';
import { VisualizationViewType } from '../../schemas/graphql.autogenerated';
import { CARBONABLE_COMPANY_ID } from '../resolvers/carbon-credits';

type Sdg = {
  number: string;
  name: string;
};

type Metrics = {
  protected_forests: string;
  protected_species: string;
  absorbed_tons: string;
};

@Injectable()
export class ImpactMetricsService {
  constructor(private readonly prismaClient: PrismaService) {}

  async get(view: VisualizationViewType) {
    const { linkedSdgs, metricsArr } = await this.fetchDataFromViewType(view);
    const metrics = metricsArr.shift();

    return {
      sdgs: linkedSdgs,
      protected_forest: Utils.formatString({
        value: metrics.protected_forests.toString(),
        suffix: 'ha',
      }),
      protected_species: Utils.formatString({
        value: metrics.protected_species.toString(),
        prefix: '#',
      }),
      removed_tons: Utils.formatString({
        value: metrics.absorbed_tons.toString(),
        suffix: 't',
      }),
    };
  }

  async fetchDataFromViewType(view: VisualizationViewType) {
    if (view?.company_id) {
      return await this.fetchCompanyWide(view.company_id);
    }
    if (view?.business_unit_id) {
      return await this.fetchBusinessUnitWide(view.business_unit_id);
    }
    if (view?.project_id) {
      return await this.fetchProjectWide(view.project_id);
    }

    return await this.fetchCompanyWide(CARBONABLE_COMPANY_ID);
  }

  async fetchCompanyWide(companyId: string) {
    const linkedSdgs = await this.prismaClient.$queryRaw<Sdg[]>`
SELECT DISTINCT s.number, s.name
FROM projects p
INNER JOIN projects_sdgs ps on ps.project_id = p.id
INNER JOIN sdg s on s.id = ps.sdg_id
WHERE p.company_id = ${companyId}
ORDER BY s.number
;
        `;
    const projectMetrics = await this.prismaClient.$queryRaw<Metrics[]>`
SELECT
    SUM(p.area) as protected_forests,
    SUM(p.protected_species) as protected_species
FROM projects p 
WHERE p.company_id = ${companyId}
        `;
    const removalMetrics = await this.prismaClient.$queryRaw<Metrics[]>`
SELECT
    SUM(s.consumed) as absorbed_tons
FROM projects p
LEFT JOIN stock s on p.id = s.project_id
WHERE p.company_id = ${companyId} and s.business_unit_id is null and s.allocation_id is null
`;
    return {
      linkedSdgs,
      metricsArr: [{ ...projectMetrics.pop(), ...removalMetrics.pop() }],
    };
  }
  async fetchBusinessUnitWide(businessUnitId: string) {
    const linkedSdgs = await this.prismaClient.$queryRaw<Sdg[]>`
SELECT DISTINCT s.number, s.name
FROM projects p
INNER JOIN projects_sdgs ps on ps.project_id = p.id
INNER JOIN sdg s on s.id = ps.sdg_id
INNER JOIN allocation a on a.project_id = p.id
INNER JOIN business_unit bu on bu.id = a.business_unit_id
WHERE bu.id = ${businessUnitId}
ORDER BY s.number
;
        `;
    const projectMetrics = await this.prismaClient.$queryRaw<Metrics[]>`
SELECT
    SUM(p.area) as protected_forests,
    SUM(p.protected_species) as protected_species
FROM allocation a
inner join projects p on a.project_id = p.id
inner JOIN business_unit bu on bu.id = a.business_unit_id
WHERE a.business_unit_id = ${businessUnitId}
        `;
    const removalMetrics = await this.prismaClient.$queryRaw<Metrics[]>`
SELECT
    SUM(s.consumed) as absorbed_tons
FROM projects p
LEFT JOIN stock s on p.id = s.project_id
WHERE s.business_unit_id = ${businessUnitId}
`;
    return {
      linkedSdgs,
      metricsArr: [{ ...projectMetrics.pop(), ...removalMetrics.pop() }],
    };
  }

  async fetchProjectWide(projectId: string) {
    const linkedSdgs = await this.prismaClient.$queryRaw<Sdg[]>`
SELECT DISTINCT s.number, s.name
FROM projects p
INNER JOIN projects_sdgs ps on ps.project_id = p.id
INNER JOIN sdg s on s.id = ps.sdg_id
WHERE p.id = ${projectId}
ORDER BY s.number
;
        `;
    const projectMetrics = await this.prismaClient.$queryRaw<Metrics[]>`
SELECT
    p.protected_forest as protected_forests,
    p.protected_species as protected_species
FROM projects p
WHERE p.id = ${projectId}
;
`;
    const removalMetrics = await this.prismaClient.$queryRaw<Metrics[]>`
SELECT SUM(s.consumed) as absorbed_tons
FROM stock s where s.project_id = ${projectId}
        `;

    return {
      linkedSdgs,
      metricsArr: [{ ...projectMetrics.pop(), ...removalMetrics.pop() }],
    };
  }
}