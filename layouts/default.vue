<template>
  <div class="!max-w-full">
    <header class="flex justify-between items-center bg-primary-500 p-4">
      <section class="flex justify-center items-center">
        <div>
          <NuxtLink
            to="/home"
            class="text-xl inline-flex items-center justify-center text-white font-bold hover:text-primary-800 hover:underline underline-offset-4 decoration-[3px]"
            ><UIcon name="i-mdi-glass-wine" />Negosud</NuxtLink
          >
        </div>
        <div class="flex justify-between items-center space-x-8 ml-8">
          <NuxtLink
            to="/stock"
            class="text-l inline-flex items-center justify-center text-white font-bold hover:text-primary-800 hover:underline underline-offset-4 decoration-[3px]"
          >
            <UIcon name="i-mdi-package-variant-closed" class="mr-2" />
            Stock</NuxtLink
          >
          <NuxtLink
            to="/products"
            class="text-l inline-flex items-center justify-center text-white font-bold hover:text-primary-800 hover:underline underline-offset-4 decoration-[3px]"
          >
            <UIcon name="i-mdi-book-open-page-variant-outline" class="mr-2" />
            Produits</NuxtLink
          >
          <NuxtLink
            to="/family"
            class="text-l inline-flex items-center justify-center text-white font-bold hover:text-primary-800 hover:underline underline-offset-4 decoration-[3px]"
          >
            <UIcon class="mr-2" name="i-mdi-book-edit-outline" />

            Familles</NuxtLink
          >
          <NuxtLink
            to="/Order"
            class="text-l inline-flex items-center justify-center text-white font-bold hover:text-primary-800 hover:underline underline-offset-4 decoration-[3px]"
          >
            <UIcon class="mr-2" name="i-mdi-package-variant-closed-plus" />
            Réassort</NuxtLink
          >
          <NuxtLink
            to="/CustomerOrder"
            class="text-l inline-flex w-44 items-center justify-center text-white font-bold hover:text-primary-800 hover:underline underline-offset-4 decoration-[3px]"
          >
            <UIcon class="mr-2" name="i-mdi-bookmark-outline" />
            Commandes Clients</NuxtLink
          >
          <NuxtLink
            to="/suppliers"
            class="text-l inline-flex items-center justify-center text-white font-bold hover:text-primary-800 hover:underline underline-offset-4 decoration-[3px]"
          >
            <UIcon class="mr-2" name="i-mdi-truck-cargo-container" />
            Fournisseur</NuxtLink
          >

          <NuxtLink
            v-if="userRole === 'admin'"
            to="/userManagement"
            class="text-l inline-flex items-center justify-center text-white font-bold hover:text-primary-800 hover:underline underline-offset-4 decoration-[3px]"
          >
            <UIcon class="mr-2" name="i-mdi-account-edit-outline" />
            Utilisateurs</NuxtLink
          >
        </div>
      </section>
      <span
        class="flex text-l font-bold text-white text-right justify-end w-full mr-3"
      >
        <UIcon name="i-mdi-account-circle" class="mt-1 mr-2" />
        {{ userName }}
      </span>
      <section>
        <div>
          <UButton
            class="text-sm inline-flex items-center justify-center bg-white font-bold text-primary hover:text-primary-800"
            size="xl"
            @click="authStore.disconnect()"
            >Déconnexion <br />
          </UButton>
        </div>
      </section>
    </header>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const userName = ref("Invité");
const userRole = ref(authStore.user?.role || "");
const toast = useToast();

const { user } = storeToRefs(useAuthStore());

onMounted(() => {
  try {
    userName.value =
      user?.value?.firstname + " " + user?.value?.lastname || "Invité";
    userRole.value = authStore.user?.role || "";
  } catch (e) {
    toast.add({
      id: "dropdown-menu-error",
      title: "Erreur lors de l'ajout",
      description: "Une erreur s'est produite dans l'affichage du menu.",
      icon: "i-heroicons-exclamation-circle",
    });
  }
});
</script>
