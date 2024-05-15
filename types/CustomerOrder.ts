import type { User } from "./User";
import type { CustomerOrderLine } from "./CustomerOrderLine";
import type { OrderStatus } from "./enums/OrderStatus";

export type CustomerOrder = {
  id: number;
  date: Date;
  status: OrderStatus;
  customer: User;
  lines: CustomerOrderLine[];
};
