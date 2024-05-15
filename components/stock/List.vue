<template>
  <Ucontainer class="m-6">
    <div class="flex px-3 dark:border-gray-700">
      <UInput
        v-model="searchinput"
        placeholder="Rechercher dans le stock..."
        class="ml-4 mr-3"
        :ui="{ icon: { trailing: { pointer: '' } } }"
        size="xl"
      >
        <template #trailing>
          <UButton
            v-show="searchinput !== ''"
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            :padded="false"
            @click="searchinput = ''"
          />
        </template>
      </UInput>
      <UTooltip text="Exporter en format CSV">
        <div class="flex items-center">
          <UButton
            icon="i-mdi-export-variant"
            size="xl"
            color="primary"
            class="rounded-full"
            :trailing="false"
          />
        </div>
      </UTooltip>
    </div>
    <UCard class="m-6">
      <UTable
        v-model="selected"
        :columns="columns"
        :rows="filteredStockProducts"
        class=""
      >
        <template #actions-data="{ row }">
          <div>
            <UTooltip text="Visualiser l'historique du stock">
              <div class="flex items-center">
                <UButton
                  icon="i-mdi-chart-line"
                  size="xl"
                  color="primary"
                  class="rounded-full"
                  :trailing="false"
                  @click="(isOpen = true), (idProduct = row.id)"
                />
              </div>
            </UTooltip>
          </div>
        </template>
      </UTable>
    </UCard>
    <UModal v-model="isOpen">
      <StockGraph />
    </UModal>
  </Ucontainer>
</template>
<script setup lang="ts">
import { type Product } from "../../types/Product";

const products = ref<Product[]>([]);
const { idProduct } = storeToRefs(useStockStore());

onMounted(async () => {
  try {
    const { token } = storeToRefs(useAuthStore());
    
    products.value = await $fetch<Product[]>("http://localhost:8080/products", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("error", error);
  }
});

const columns = [
  {
    key: "name",
    label: "Nom",
    sortable: true,
  },
  {
    key: "supplier.name",
    label: "Fournisseur",
    sortable: true,
  },
  {
    key: "quantity",
    label: "Quantité",
    sortable: true,
  },
  {
    key: "reliquat",
    label: "Reliquat",
    sortable: true,
  },
  {
    key: "actions",
    label: "Historique",
  },
];
const selected = ref([]);
const isOpen = ref(false);
const searchinput = ref("");
const filteredStockProducts = computed(() => {
  if (!searchinput.value) {
    return products.value;
  }

  return products.value.filter((product) => {
    const supplierString = product.supplier.name;

    return [product.name, supplierString].some((field) => {
      return field.toLowerCase().includes(searchinput.value.toLowerCase());
    });
  });
});


</script>
