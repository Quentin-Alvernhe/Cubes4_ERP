import type { Product } from "./Product";

export type CustomerOrderLine = {
  id: number;
  quantity: number;
  product: Product;
  price: number;
};