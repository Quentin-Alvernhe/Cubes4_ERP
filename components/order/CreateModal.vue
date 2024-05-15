<template>
  <UModal v-model="createModalVisible">
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
            Ajouter une commande
          </h1>
          <UButton
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="text-white hover:bg-primary hover:text-primary-800"
            @click="createModalVisible = false"
          />
        </div>
      </template>

      <div class="flex flex-col gap-6">
        <USelect
          v-model="selectedSupplier"
          placeholder="Fournisseur"
          :options="suppliers.map((s) => ({ label: s.name, value: s.id }))"
        />

        <USelectMenu
          v-if="selectedSupplier"
          v-model="selectedProducts"
          multiple
          placeholder="Produits"
          :options="products"
          value-attribute="id"
          option-attribute="name"
        />

        <span v-for="product in selectedProducts" :key="`product-${product}`">
          <UInput
            type="number"
            :placeholder="`Quantité ${
              products.find((p: Product) => p.id === product)?.name
            }`"
            @update:model-value="productsQuantity[product] = $event"
          />
        </span>
      </div>

      <template #footer>
        <span class="flex gap-6 justify-end">
          <UButton
            size="lg"
            label="Annuler"
            color="red"
            @click="createModalVisible = false"
          />
          <UButton
            size="lg"
            label="Valider"
            color="primary"
            @click="createSupplierOrder()"
          />
        </span>
      </template>
    </UCard>
  </UModal>
</template>
<script setup lang="ts">
import type { Product } from "~/types/Product";
import type { SupplierOrder } from "~/types/SupplierOrder";
import { OrderStatus } from "~/types/enums/OrderStatus";

const { createModalVisible } = storeToRefs(useSupplierOrderStore());
const { token } = storeToRefs(useAuthStore());
const selectedSupplier = ref<number>(0);
const selectedProducts = ref<number[]>([]);
const productsQuantity = ref<{ [key: number]: number }>({});
const { suppliers, products } = storeToRefs(useSupplierOrderStore());
const supplierOrderStore = useSupplierOrderStore();

onMounted(async () => {
  await supplierOrderStore.fetchSuppliers();
});

watch(selectedSupplier, async (value) => {
  if (value) {
    await supplierOrderStore.fetchProducts(value);
  }
});

watch(createModalVisible, (value) => {
  if (value) {
    selectedSupplier.value = 0;
    selectedProducts.value = [];
  }
});

const createLine = (idProduct: number, idSupplierOrder: number) => {
  try {
    return $fetch("http://localhost:8080/supplier-order-line", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: {
        quantity: parseInt(
          productsQuantity.value[idProduct] as unknown as string,
        ),
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

const toast = useToast();
const createSupplierOrder = async () => {
  try {
    const supplierOrder = await $fetch<SupplierOrder>(
      "http://localhost:8080/supplier-order",
      {
        method: "POST",
        body: {
          date: new Date(),
          status: OrderStatus.REGISTERED,
          supplier: {
            id: selectedSupplier.value,
          },
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      },
    );

    await Promise.all(
      selectedProducts.value.map((product: number) =>
        createLine(product, supplierOrder.id),
      ),
    );

    toast.add({
      color: "primary",
      title: "Succès",
      description: "La commande a bien été créée",
      icon: "i-mdi-check",
    });
  } catch (error) {
    console.log(error);
  } finally {
    createModalVisible.value = false;
    supplierOrderStore.fetchSupplierOrder();
  }
};
</script>
