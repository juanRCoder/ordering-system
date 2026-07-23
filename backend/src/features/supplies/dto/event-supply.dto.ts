import { Decimal } from '@prisma/client/runtime/client';
import type { StatusSupply } from '../../../generated/prisma/enums';

export type EventSupplyDto = {
  status: StatusSupply;
};

export type EventUpdatePriceDto = {
  price: Decimal;
};
