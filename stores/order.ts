import { defineStore } from "pinia";
import type { Product } from "~/types/Product";
import type { Supplier } from "~/types/Supplier";
import type { SupplierOrder } from "~/types/SupplierOrder";

export type OrderState = {
  orders: SupplierOrder[];
  createModalVisible: boolean;
  suppliers: Supplier[];
  products: Product[];
  filteredOrders: SupplierOrder[];
};

export const useSupplierOrderStore = defineStore("supplierOrder", {
  state: (): OrderState => ({
    orders: [],
    createModalVisible: false,
    suppliers: [],
    products: [],
    filteredOrders: [],
  }),

  actions: {
    async fetchSupplierOrder(): Promise<void> {
      const { token } = storeToRefs(useAuthStore());

      this.orders = await $fetch<SupplierOrder[]>(
        "http://localhost:8080/supplier-orders",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token?.value,
          },
        },
      );
      // Copy datas
      this.filteredOrders = [...this.orders];
    },

    async fetchSuppliers(): Promise<void> {
      const { token } = storeToRefs(useAuthStore());

      this.suppliers = await $fetch<Supplier[]>(
        "http://localhost:8080/suppliers",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token?.value,
          },
        },
      );
    },

    async fetchProducts(idSupplier: number): Promise<void> {
      const { token } = storeToRefs(useAuthStore());

      this.products = await $fetch<Product[]>(
        `http://localhost:8080/supplier/${idSupplier}/products`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token?.value,
          },
        },
      );
    },

    async updateSupplierOrder(data: SupplierOrder): Promise<void> {
      const { token } = storeToRefs(useAuthStore());

      await $fetch("http://localhost:8080/supplier-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token?.value,
        },
        body: data,
      });
    },

    filterOrders({
      search,
      status,
    }: {
      search: string;
      status: number[];
    }): void {
      console.log(search);
      if (search) {
        this.filteredOrders = this.orders.filter(
          (order) =>
            order.supplier.email
              ?.toLowerCase()
              ?.includes(search.toLowerCase()) ||
            order.supplier.name
              ?.toLowerCase()
              ?.includes(search.toLowerCase()) ||
            order.lines.find(
              (l) =>
                l.product.name?.toLowerCase()?.includes(search.toLowerCase()),
            ),
        );
      } else this.filteredOrders = [...this.orders];

      if (status.length) {
        this.filteredOrders = this.filteredOrders.filter((order) =>
          status.includes(order.status),
        );
      } else if (!search) this.filteredOrders = [...this.orders];
    },
  },
});
