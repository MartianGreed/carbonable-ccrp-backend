import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma.service';
import Utils from '../../utils';
import { CARBONABLE_COMPANY_ID } from '../resolvers/carbon-credits';
import {
  BusinessUnitRepositoryInterface,
  Company,
  Demand,
} from '../../domain/business-unit';
import {
  EffectiveCompensation,
  OrderBookRepositoryInterface,
} from '../../domain/order-book';
import { BUSINESS_UNIT_REPOSITORY } from '../../infrastructure/repository/business-unit.prisma';
import { ORDER_BOOK_REPOSITORY } from '../../infrastructure/repository/order-book.prisma';
import { VisualizationViewType } from '../../schemas/graphql.autogenerated';

export const ProjectedDecarbonationViewType = {
  OFFSET_TYPE: 'OFFSET_TYPE',
  PROJECT_TYPE: 'PROJECT_TYPE',
  INVESTMENT_TYPE: 'INVESTMENT_TYPE',
};

type GlobalData = {
  target: string;
  actual: string;
  debt: string;
  invested_amount: string;
  number_of_projects: string;
};

type GlobalDataVisualization = {
  actual: number;
  target: number;
  debt: number;
  investedAmount: number;
};

@Injectable()
export class GlobalDataService {
  private readonly logger = new Logger(GlobalDataService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(BUSINESS_UNIT_REPOSITORY)
    private readonly businessUnitRepository: BusinessUnitRepositoryInterface,
    @Inject(ORDER_BOOK_REPOSITORY)
    private readonly orderRepository: OrderBookRepositoryInterface,
  ) {}

  async get(view: VisualizationViewType): Promise<GlobalData> {
    const { target, actual, debt, investedAmount } = await this.getTarget(view);

    const numberOfProjects = await this.prisma.project.count();

    return {
      actual: Utils.formatString({
        value: actual.toString(),
        suffix: 't',
      }),
      target: Utils.formatString({
        value: target.toString(),
        suffix: 't',
      }),
      debt: Utils.formatString({
        value: debt.toString(),
        suffix: 't',
      }),
      invested_amount: Utils.formatString({
        value: investedAmount.toString(),
        suffix: '$',
      }),
      number_of_projects: Utils.formatString({
        value: numberOfProjects.toString(),
        prefix: '#',
      }),
    };
  }

  private async getTarget(
    view: VisualizationViewType,
  ): Promise<GlobalDataVisualization> {
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

  async fetchCompanyWide(companyId: string): Promise<GlobalDataVisualization> {
    const currentYear = new Date().getFullYear();
    const businessUnits = await this.businessUnitRepository.byCompanyId(
      companyId,
    );
    const actuals =
      await this.orderRepository.getCompanyYearlyEffectiveCompensation(
        companyId,
      );

    const demands = Company.mergeDemands(businessUnits);

    const actual =
      actuals.find((a) => parseInt(a.vintage) === currentYear) ??
      EffectiveCompensation.default();
    const demand =
      demands.find((d) => parseInt(d.year) === currentYear) ?? Demand.default();

    return {
      actual: actual ? actual.compensation : 0,
      target: demand ? demand.target : 0,
      debt: demand.emission - actual.compensation,
      investedAmount: await this.orderRepository.getCompanyTotalInvestedAmount(
        companyId,
      ),
    };
  }

  async fetchBusinessUnitWide(
    businessUnitId: string,
  ): Promise<GlobalDataVisualization> {
    const currentYear = new Date().getFullYear();

    const businessUnit = await this.businessUnitRepository.byId(businessUnitId);
    const actuals =
      await this.orderRepository.getBusinessUnitYearlyEffectiveCompensation(
        businessUnitId,
      );

    const demands = businessUnit.getDemands();

    const actual =
      actuals.find((a) => parseInt(a.vintage) === currentYear) ??
      EffectiveCompensation.default();
    const demand =
      demands.find((d) => parseInt(d.year) === currentYear) ?? Demand.default();

    return {
      actual: actual ? actual.compensation : 0,
      target: demand ? demand.target : 0,
      debt: demand.emission - actual.compensation,
      investedAmount:
        await this.orderRepository.getBusinessUnitTotalInvestedAmount(
          businessUnitId,
        ),
    };
  }

  async fetchProjectWide(projectId: string): Promise<GlobalDataVisualization> {
    const currentYear = new Date().getFullYear();
    const businessUnits = await this.businessUnitRepository.byAllocatedProjects(
      projectId,
    );
    const actuals =
      await this.orderRepository.getProjectYearlyEffectiveCompensation(
        projectId,
      );

    const demands = Company.mergeDemands(businessUnits);

    const actual =
      actuals.find((a) => parseInt(a.vintage) === currentYear) ??
      EffectiveCompensation.default();
    const demand =
      demands.find((d) => parseInt(d.year) === currentYear) ?? Demand.default();

    return {
      actual: actual ? actual.compensation : 0,
      target: demand ? demand.target : 0,
      debt: demand.emission - actual.compensation,
      investedAmount: await this.orderRepository.getProjectTotalInvestedAmount(
        projectId,
      ),
    };
  }
}
