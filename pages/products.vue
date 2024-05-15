<template>
  <div>
    <span class="flex text-6xl gap-6 mt-5 ml-5 items-center">
      <UIcon class="mt-[0px]" name="i-mdi-book-open-page-variant-outline" />
      <h1 class="text-5xl">Gestion des produits</h1>
    </span>
    <ProductsComponent />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  title: "Produits",
  description: "CRUD produit",
});
</script>
