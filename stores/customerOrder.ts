import { defineStore } from "pinia";
import type { Product } from "~/types/Product";
import type { User } from "~/types/User";
import type { CustomerOrder } from "~/types/CustomerOrder";

export type OrderState = {
  orders: CustomerOrder[];
  createModalVisible: boolean;
  customers: User[];
  products: Product[];
  filteredOrders: CustomerOrder[];
};

export const useCustomerOrderStore = defineStore("customerOrder", {
  state: (): OrderState => ({
    orders: [],
    createModalVisible: false,
    customers: [],
    products: [],
    filteredOrders: [],
  }),

  actions: {
    async fetchCustomerOrder(): Promise<void> {
      const { token } = storeToRefs(useAuthStore());

      this.orders = await $fetch<CustomerOrder[]>(
        "http://localhost:8080/customer-orders",
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

    async fetchCustomers(): Promise<void> {
      const { token } = storeToRefs(useAuthStore());

      this.customers = await $fetch<User[]>("http://localhost:8080/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token?.value,
        },
      });
    },

    async updateCustomerOrder(data: CustomerOrder): Promise<void> {
      const { token } = storeToRefs(useAuthStore());

      await $fetch("http://localhost:8080/customer-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token?.value,
        },
        body: JSON.stringify({
          ...data,
          status: parseInt(data.status as unknown as string),
        }),
      });
    },

    filterOrders({
      search,
      status,
    }: {
      search: string;
      status: number[];
    }): void {
      if (search) {
        this.filteredOrders = this.orders.filter(
          (order) =>
            order.customer.firstname
              ?.toLowerCase()
              ?.includes(search.toLowerCase()) ||
            order.customer.lastname
              ?.toLowerCase()
              ?.includes(search.toLowerCase()) ||
            order.lines.find((l) =>
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
