import type { Supplier } from "./Supplier";
import type { SupplierOrderLine } from "./SupplierOrderLine";
import type { OrderStatus } from "./enums/OrderStatus";

export type SupplierOrder = {
  id: number;
  date: Date;
  status: OrderStatus;
  supplier: Supplier;
  lines: SupplierOrderLine[];
};
