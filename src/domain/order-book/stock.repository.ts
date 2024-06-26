import { Reservation, Stock } from '.';
import { Demand } from '../business-unit';
import { StockAvailability } from './stock';

export type StockAndReservation = {
  stock: Stock[];
  reservations: Reservation[];
};

export interface StockRepositoryInterface {
  findProjectStockForVintage(
    projectId: string,
    vintage: string,
  ): Promise<Stock[]>;
  findAllocatedStockByVintage(
    businessUnitId: string,
    allocationIds: string[],
  ): Promise<Stock[]>;
  save(stock: Stock[]): Promise<void>;
  reserve(stock: Stock, quantity: number): Promise<void>;

  findCompanyStock(companyId: string): Promise<StockAndReservation>;
  findBusinessUnitStock(businessUnitId: string): Promise<StockAndReservation>;
  findProjectStock(projectId: string): Promise<StockAndReservation>;

  availableToAllocate(
    projectId: string,
    demands: Demand[],
  ): Promise<StockAvailability>;
}
