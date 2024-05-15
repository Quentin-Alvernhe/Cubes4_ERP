<template>
  <div>
    <span class="flex text-6xl gap-6 mt-5 ml-5 items-center">
      <UIcon class="mt-[0px]" name="i-mdi-account-edit-outline" />
      <h1 class="text-5xl">Gestion des utilisateurs</h1>
    </span>
    <UserManagementComponent />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  title: "Gestion des utilisateurs",
  description: "CRUD Utilisateur",
});
</script>
