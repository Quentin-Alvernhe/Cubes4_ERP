<template>
  <div class="h-full pt-[16vh]">
    <div class="flex justify-center text-6xl">
      <UIcon name="i-mdi-glass-wine" />
      <h1>Négosud</h1>
    </div>
    <div class="flex justify-center items-center h-[100vh] pb-[39vh]">
      <LoginForm />
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  title: "Connexion",
  description: "Page de connexion",
  layout: false,
});
</script>
