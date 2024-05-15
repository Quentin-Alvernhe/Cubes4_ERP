<template>
  <meta charset="UTF-8" />
  <div>
    <UCard class="mx-6 mt-6">
      <UTable :rows="rows" :columns="headers" :loading="isLoading">
        <!-- ID -->
        <template #id-data="{ row }: { row: CustomerOrder }">
          <span class="text-xl font-bold">
            {{ row.id }}
          </span>
        </template>

        <!-- Date -->
        <template #date-data="{ row }: { row: CustomerOrder }">
          <span class="text-xl font-bold">
            {{ useFormatDate(row.date as unknown as string) }}
          </span>
        </template>

        <!-- Status -->
        <template #status-data="{ row }: { row: CustomerOrder }">
          <span class="text-xl">
            <USelect
              v-if="row.status !== OrderStatus.DELIVERED"
              v-model="row.status"
              :options="OrderStatusList"
              size="xl"
              @update:model-value="updateCustomerOrder(row)"
            />
            <span v-else>{{
              OrderStatusList.find((o) => o.value === row.status)?.label
            }}</span>
          </span>
        </template>

        <!-- Supplier -->
        <template #customer-data="{ row }: { row: CustomerOrder }">
          <span class="text-xl font-bold">
            {{ row.customer.firstname }} {{ row.customer.lastname }}
          </span>
        </template>

        <!-- Product -->
        <template #product-data="{ row }: { row: CustomerOrder }">
          <span
            v-for="line in row.lines"
            :key="`${row.id}-${line.product.name}`"
            class="text-xl"
          >
            - <span class="font-bold">{{ line.product.name }}</span> | Qté :
            <span class="font-bold">{{ line.quantity }}</span>
            <br />
          </span>
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
import type { CustomerOrder } from "~/types/CustomerOrder";
import type { CustomerOrderLine } from "~/types/CustomerOrderLine";
import { OrderStatus, OrderStatusList } from "~/types/enums/OrderStatus";
import { type Product } from "../../types/Product";
import { type SupplierOrder } from "../../types/SupplierOrder";

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
    key: "customer",
    label: "Client",
  },
  {
    key: "product",
    label: "Produits",
  },
];
const customerOrderState = useCustomerOrderStore();
const { filteredOrders } = storeToRefs(useCustomerOrderStore());
const products = ref<Product[]>([]);
const { token } = storeToRefs(useAuthStore());

onMounted(async () => {
  await customerOrderState.fetchCustomerOrder();
  products.value = await $fetch<Product[]>("http://localhost:8080/products", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  });
});

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
const updateCustomerOrder = async (row: CustomerOrder): Promise<void> => {
  try {
    isLoading.value = true;
    await customerOrderState.updateCustomerOrder(row);
    toast.add({
      id: "customer-order-update-success",
      title: "Mise à jour des données",
      description: "Les données ont bien été mises à jour",
      icon: "i-mdi-check-circle",
      color: "green",
    });
  } catch (error) {
    console.log(error);
    toast.add({
      id: "customer-order-update-error",
      title: "Erreur lors de la mise à jour des données",
      description: "Une erreur est survenue",
      icon: "i-mdi-alert-circle",
      color: "red",
    });
  } finally {
    await customerOrderState.fetchCustomerOrder();
    products.value = await $fetch<Product[]>("http://localhost:8080/products", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });
    await refileLowStockProducts(row);
    isLoading.value = false;
  }
};

const createLine = (idProduct: number, idSupplierOrder: number) => {
  try {
    return $fetch("http://localhost:8080/supplier-order-line", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: {
        quantity: 50,
        price: products.value.find((p: Product) => p.id === idProduct)
          ?.purchase_price,
        product: {
          id: idProduct,
        },
        order: {
          id: idSupplierOrder,
        },
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const createSupplierOrder = async (
  selectedSupplier: number,
  selectedProducts: number[],
) => {
  try {
    const supplierOrder = await $fetch<SupplierOrder>(
      "http://localhost:8080/supplier-order",
      {
        method: "POST",
        body: {
          date: new Date(),
          status: OrderStatus.REGISTERED,
          supplier: {
            id: selectedSupplier,
          },
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      },
    );

    await Promise.all(
      selectedProducts.map((product: number) =>
        createLine(product, supplierOrder.id),
      ),
    );

    toast.add({
      color: "primary",
      title: "Succès",
      description: "La commande de réapprovisionnement a bien été créée",
      icon: "i-mdi-check",
    });
  } catch (error) {
    console.log(error);
  }
};

const refileLowStockProducts = async (customerOrder: CustomerOrder) => {
  try {
    if (
      parseInt(customerOrder.status as unknown as string) ===
      OrderStatus.IN_PROGRESS
    ) {
      const lowStocksProducts = customerOrder.lines.filter(
        (line: CustomerOrderLine) => {
          const product = products.value.find(
            (p: Product) => p.id === line.product.id,
          );
          return (product?.reliquat as number) < 0;
        },
      );

      if (lowStocksProducts.length > 0) {
        const selectedSupplier = lowStocksProducts[0].product.supplier.id;
        const selectedProducts = lowStocksProducts.map(
          (product: CustomerOrderLine) => product.product.id,
        );
        await createSupplierOrder(selectedSupplier, selectedProducts);
      }
      console.log(lowStocksProducts);
    }
  } catch (error) {
    console.error("Error in refileLowStockProducts:", error);
    toast.add({
      color: "red",
      title: "Erreur Réapprovisionnement",
      description: "Un problème est survenu lors du réapprovisionnement: ",
      icon: "i-mdi-alert-circle",
    });
  }
};
</script>
