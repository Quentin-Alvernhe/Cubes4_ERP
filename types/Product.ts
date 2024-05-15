import type { Family } from "./Family";
import type { Supplier } from "./Supplier";

export type Product = {
  id: number;
  name: string;
  quantity: number;
  reliquat: number;
  familyList: Family[];
  supplier: Supplier;
  price: number;
  purchase_price: number;
  description: string;
  degustation: string;
};