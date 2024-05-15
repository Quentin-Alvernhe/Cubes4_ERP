<template>
  <div>
    <span class="flex text-6xl gap-6 mt-5 ml-5 items-center">
      <UIcon class="mt-[0px]" name="i-mdi-package-variant-closed" />
      <h1 class="text-5xl">Stock produits</h1>
    </span>
    <StockList />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  title: "Stock",
  description: "Visualisation du stock",
});
</script>
