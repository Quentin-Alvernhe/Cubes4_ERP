import type { Product } from "./Product";

export type SupplierOrderLine = {
  id: number;
  quantity: number;
  product: Product;
  price: number;
};
