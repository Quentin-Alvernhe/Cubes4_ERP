<template>
  <div class="w-[97%] gap-3 flex mx-6 mt-6">
    <div class="flex-grow border-solid border rounded-xl bg-white">
      <div class="flex gap-3 m-3">
        <UInput
          v-model="search"
          class="w-1/3"
          size="xl"
          placeholder="Rechercher..."
          variant="outline"
          icon="i-heroicons-magnifying-glass-20-solid"
          :ui="{ icon: { trailing: { pointer: '' } } }"
        >
          <template #trailing>
            <UButton
              v-show="search !== ''"
              color="gray"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              @click="search = ''"
            />
          </template>
        </UInput>
        <USelectMenu
          v-model="selectedStatus"
          size="xl"
          class="w-1/4"
          placeholder="Statut"
          multiple
          :options="OrderStatusList"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { OrderStatusList } from "~/types/enums/OrderStatus";
const customerOrderStore = useCustomerOrderStore();
const search = ref("");
const selectedStatus = ref<any[]>([]);

watch(search, () => {
  customerOrderStore.filterOrders({
    search: search.value,
    status: selectedStatus.value.map((s) => s.value),
  });
});

watch(selectedStatus, () => {
  customerOrderStore.filterOrders({
    search: search.value,
    status: selectedStatus.value.map((s) => s.value),
  });
});
</script>

<style scoped>
.test {
  z-index: 100 !important;
}
</style>
