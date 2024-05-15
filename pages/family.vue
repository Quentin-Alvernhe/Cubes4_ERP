<template>
  <div>
    <span class="flex text-6xl gap-6 mt-5 ml-5 items-center">
      <UIcon class="mt-[0px]" name="i-mdi-book-edit-outline" />
      <h1 class="text-5xl">Gestion des familles de produit</h1>
    </span>
    <FamilyComponent />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  title: "Famille de produit",
  description: "CRUD famille",
});
</script>
