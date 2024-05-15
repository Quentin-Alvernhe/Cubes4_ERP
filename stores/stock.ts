import { defineStore } from "pinia";

export type ProductState = {
  idProduct?: number | null;
};

export const useStockStore = defineStore("product", {
  state: (): ProductState => ({
    idProduct: null,
  }),
});
