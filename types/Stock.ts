import type { Product } from "./Product";

export type Stock = {
  id: number;
  date: Date;
  quantity: number;
  reliquat: number;
  product: Product;
};
