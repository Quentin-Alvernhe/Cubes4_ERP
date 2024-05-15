<template>
  <UCard
    :ui="{
      ring: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      header: { background: 'bg-primary' },
    }"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold leading-6 text-white">
          Historique du stock
        </h1>
      </div>
    </template>
    <Line v-if="!isLoading" :data="data" />
  </UCard>
</template>

<script setup lang="ts">
import { Line } from "vue-chartjs";
import dayjs from "dayjs";
import type { Stock } from "~/types/Stock";

const isLoading = ref(false);
const data = ref<{ labels: string[]; datasets: any }>({
  labels: [],
  datasets: [
    {
      label: "Stock",
      data: [],
      hoverOffset: 4,
    },
  ],
});

onMounted(async () => {
  try {
    isLoading.value = true;
    const { token } = storeToRefs(useAuthStore());
    const { idProduct } = storeToRefs(useStockStore());

    const productStock = await $fetch<Stock[]>(
      `http://localhost:8080/stock/${idProduct?.value}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token?.value}`,
        },
      },
    );

    data.value.labels = productStock.map((stock) =>
      dayjs(stock.date).format("DD/MM/YYYY"),
    );

    data.value.datasets[0].data = productStock.map((stock) => stock.quantity);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("error", error);
  } finally {
    isLoading.value = false;
  }
});
</script>
