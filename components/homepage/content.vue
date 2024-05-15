<template class="">
  <div class="mt-16 space-y-16">
    <div class="flex justify-around align-middle">
      <UCard
        class="min-w-[35vw] min-h-[20vh]"
        :ui="{ header: { background: 'bg-primary' } }"
      >
        <template #header>
          <span class="flex justify-items-center text-xl text-white font-bold">
            <UIcon
              class="mt-1 mr-2"
              name="i-mdi-truck-delivery-outline"
            />
            <h1>Réassort en cours de livraison</h1>
          </span>
        </template>
        <div v-if="orders.length">
          <div
            v-for="(order, index) in orders"
            :key="`order-${order.id}`"
            :class="index ? 'mt-4' : ''"
          >
            - Commande n°{{ order.id }} du
            {{ useFormatDate(order.date as unknown as string) }}
          </div>
        </div>
        <div v-else class="text-black">
          Aucun réassort en cours de livraison.
        </div>
      </UCard>
      <UCard
        class="min-w-[35vw] min-h-[20vh]"
        :ui="{ header: { background: 'bg-primary' } }"
      >
        <template #header>
          <span class="flex justify-items-center text-xl text-white font-bold">
            <UIcon
              class="mt-1 mr-2 rotate-[245deg]"
              name="i-mdi-chart-line-variant"
              style="-webkit-transform: scaleX(-1); transform: scaleX(-1)"
            />
            <h1>Stocks faible</h1>
          </span>
        </template>
        <div
          v-for="(product, index) in lowStockProducts"
          :key="`product-${product.id}`"
          :class="index ? 'mt-4' : ''"
        >
          <UIcon name="i-mdi-alert" class="bg-red-500" />
          {{ product.name }} ({{ product.id }}) :
          {{ product.quantity }} restants
        </div>
      </UCard>
    </div>
    <div class="flex justify-around align-middle">
      <UCard
        class="min-w-[35vw] min-h-[25vh]"
        :ui="{ header: { background: 'bg-primary' } }"
      >
        <template #header>
          <span class="flex justify-items-center text-xl text-white font-bold">
            <UIcon class="mt-1 mr-2" name="i-mdi-package-variant-closed" />
            <h1>Répartition du stock</h1>
          </span>
        </template>
        <div>
          <Pie
            v-if="chartData.datasets[0].data.length"
            :data="chartData"
            :options="chartOptions"
          />
        </div>
      </UCard>
      <UCard
        class="min-w-[35vw] min-h-[20vh]"
        :ui="{ header: { background: 'bg-primary' } }"
      >
        <template #header>
          <span class="flex justify-items-center text-xl text-white font-bold">
            <UIcon
              class="mt-1 mr-2"
              name="i-mdi-archive-check-outline"
            />
            <h1>Commandes client à préparer</h1>
          </span>
        </template>
        <div v-if="customerOrders.length">
          <div
            v-for="(order, index) in customerOrders"
            :key="`order-${order.id}`"
            :class="index ? 'mt-4' : ''"
          >
            - Commande n°{{ order.id }} du
            {{ useFormatDate(order.date as unknown as string) }}
          </div>
        </div>
        <div v-else class="text-black">
          Aucune commandes à préparer.
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { Pie } from "vue-chartjs";
import type { Product } from "~/types/Product";
import type { SupplierOrder } from "~/types/SupplierOrder";
import type { CustomerOrder } from "~/types/CustomerOrder";
import { OrderStatus } from "~/types/enums/OrderStatus";

const chartData = ref<{ labels: string[]; datasets: any }>({
  labels: [],
  datasets: [
    {
      label: "Stock",
      data: [],
      hoverOffset: 4,
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});

const isLoading = ref(false);
const orders = ref<SupplierOrder[]>([]);
const lowStockProducts = ref<Product[]>([]);
const customerOrders = ref<CustomerOrder[]>([]);
const { token } = storeToRefs(useAuthStore());
const toast = useToast();

onMounted(async () => {
  await Promise.all([getOrders(), getProducts(), getCustomerOrders()]);
});

const getOrders = async (): Promise<void> => {
  try {
    isLoading.value = true;
    orders.value = (
      await $fetch<SupplierOrder[]>("http://localhost:8080/supplier-orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      })
    )
      .filter((order) => {
        return OrderStatus.ON_DELIVERY === order.status;
      })
      .sort((order1, order2) =>
        dayjs(order1.date).isAfter(order2.date) ? 1 : -1,
      )
      .slice(0, 3);
  } catch (error) {
    toast.add({
      id: "home-orders-error",
      title: "Erreur lors de la récupération des commandes fournisseurs",
      description: "Erreur",
      icon: "i-mdi-alert-circle",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
};

const getProducts = async (): Promise<void> => {
  try {
    isLoading.value = true;
    const products = await $fetch<Product[]>("http://localhost:8080/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
    });

    lowStockProducts.value = products
      .filter(product => product.quantity <= 10)
      .sort((product1, product2) => product1.quantity - product2.quantity);

    const filteredProducts = products
      .sort((p, p2) => (p.quantity < p2.quantity ? 1 : -1))
      .slice(0, 10);
    chartData.value.labels = filteredProducts.map((p) => p.name);
    chartData.value.datasets[0].data = filteredProducts.map((p) => p.quantity);
  } catch (error) {
    toast.add({
      id: "home-orders-error",
      title: "Erreur lors de la récupération des produits",
      description: "Erreur",
      icon: "i-mdi-alert-circle",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
};

const getCustomerOrders = async (): Promise<void> => {
  try {
    isLoading.value = true;
    customerOrders.value = (
      await $fetch<CustomerOrder[]>("http://localhost:8080/customer-orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      })
    )
      .filter((order) => {
        return OrderStatus.IN_PROGRESS === order.status;
      })
      .sort((order1, order2) =>
        dayjs(order1.date).isAfter(order2.date) ? 1 : -1,
      )
      .slice(0, 3);
  } catch (error) {
    toast.add({
      id: "home-orders-error",
      title: "Erreur lors de la récupération des commandes clients",
      description: "Erreur",
      icon: "i-mdi-alert-circle",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
