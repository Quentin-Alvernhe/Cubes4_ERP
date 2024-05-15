<template>
  <div>
    <span class="flex text-6xl gap-6 mt-5 ml-5 items-center">
      <UIcon class="mt-[0px]" name="i-mdi-truck-cargo-container" />
      <h1 class="text-5xl">Gestion des fournisseurs</h1>
    </span>
    <suppliersComponent />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  title: "Fournisseurs",
  description: "CRUD fournisseurs",
});
</script>
