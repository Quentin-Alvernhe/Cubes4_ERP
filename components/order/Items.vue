<template>
  <meta charset="UTF-8" />
  <div>
    <UCard class="mx-6 mt-6">
      <UTable :rows="rows" :columns="headers" :loading="isLoading">
        <!-- ID -->
        <template #id-data="{ row }: { row: SupplierOrder }">
          <span class="text-xl font-bold">
            {{ row.id }}
          </span>
        </template>

        <!-- Date -->
        <template #date-data="{ row }: { row: SupplierOrder }">
          <span class="text-xl font-bold">
            {{ useFormatDate(row.date as unknown as string) }}
          </span>
        </template>

        <!-- Status -->
        <template #status-data="{ row }: { row: SupplierOrder }">
          <span class="text-xl">
            <USelect
              v-if="row.status !== OrderStatus.DELIVERED"
              v-model="row.status"
              :options="OrderStatusList"
              size="xl"
              @update:model-value="updateSupplierOrder(row)"
            />
            <span v-else>{{
              OrderStatusList.find((o) => o.value === row.status)?.label
            }}</span>
          </span>
        </template>

        <!-- Supplier -->
        <template #supplier-data="{ row }: { row: SupplierOrder }">
          <span class="text-xl font-bold">
            {{ row.supplier.name }}
          </span>
        </template>

        <!-- Product -->
        <template #product-data="{ row }: { row: SupplierOrder }">
          <span
            v-for="line in row.lines"
            :key="`${row.id}-${line.product.name}`"
            class="text-xl"
          >
            - <span class="font-bold">{{ line.product.name }}</span> | Qté :
            <span class="font-bold">{{ line.quantity }}</span> | Prix unitaire :
            <span class="font-bold">{{ line.price }}</span> € | Prix total :
            <span class="font-bold">{{ line.price * line.quantity }}</span> €
            <br />
          </span>
        </template>

        <!-- Price -->
        <template #price-data="{ row }: { row: SupplierOrder }">
          <span class="text-xl font-bold">{{ getTotalPrice(row) }} €</span>
        </template>

        <div
          class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
        >
          <UPagination
            v-model="page"
            :page-count="pageCount"
            :total="filteredOrders.length"
          />
        </div>
      </UTable>
    </UCard>
  </div>
</template>
<script setup lang="ts">
import type { SupplierOrder } from "~/types/SupplierOrder";
import type { SupplierOrderLine } from "~/types/SupplierOrderLine";
import { OrderStatus, OrderStatusList } from "~/types/enums/OrderStatus";

const headers = [
  {
    key: "id",
    label: "Identifiant",
  },
  {
    key: "date",
    label: "Date de commande",
  },
  {
    key: "status",
    label: "Statut de la commande",
  },
  {
    key: "supplier",
    label: "Fournisseur",
  },
  {
    key: "product",
    label: "Produits",
  },
  {
    key: "price",
    label: "Prix total",
  },
];
const supplierOrderState = useSupplierOrderStore();
const { filteredOrders } = storeToRefs(useSupplierOrderStore());

onMounted(async () => {
  await supplierOrderState.fetchSupplierOrder();
});

const getTotalPrice = (order: SupplierOrder): number => {
  return order?.lines?.reduce<number>(
    (acc: number, line: SupplierOrderLine) => {
      return acc + line.price * line.quantity;
    },
    0,
  );
};

const page = ref(1);
const pageCount = 25;
const rows = computed(() => {
  return filteredOrders.value.slice(
    (page.value - 1) * pageCount,
    page.value * pageCount,
  );
});

const toast = useToast();
const isLoading = ref(false);
const updateSupplierOrder = async (row: SupplierOrder): Promise<void> => {
  try {
    isLoading.value = true;
    await supplierOrderState.updateSupplierOrder(row);
    toast.add({
      id: "supplier-order-update-success",
      title: "Mise à jour des données",
      description: "Les données ont bien été mises à jour",
      icon: "i-mdi-check-circle",
      color: "green",
    });
  } catch (error) {
    console.log(error);
    toast.add({
      id: "supplier-order-update-error",
      title: "Erreur lors de la mise à jour des données",
      description: "Une erreur est survenue",
      icon: "i-mdi-alert-circle",
      color: "red",
    });
  } finally {
    await supplierOrderState.fetchSupplierOrder();
    isLoading.value = false;
  }
};
</script>
