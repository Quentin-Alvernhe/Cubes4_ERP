<template>
  <UCard class="w-[60vh] h-[47vh]">
    <template #header>
      <h1 class="text-2xl font-bold flex justify-center">Connexion</h1>
    </template>
    <UForm
      :schema="schema"
      class="space-y-8"
      :state="userCredentials"
      @submit="login()"
    >
      <UFormGroup label="Email" name="email" size="xl">
        <UInput
          v-model="userCredentials.email"
          trailing-icon="i-mdi-mail"
          :ui="{ icon: { leading: { pointer: '' } } }"
          size="xl"
        />
      </UFormGroup>

      <UFormGroup label="Mot de passe" name="password" size="xl">
        <UInput
          v-model="userCredentials.password"
          :type="isPasswordVisible ? 'text' : 'password'"
          :ui="{ icon: { trailing: { pointer: '' } } }"
          size="xl"
        >
          <template #trailing>
            <UButton
              color="gray"
              variant="link"
              :icon="isPasswordVisible ? 'i-mdi-eye-off' : 'i-mdi-eye'"
              :padded="false"
              @click="isPasswordVisible = !isPasswordVisible"
            />
          </template>
        </UInput>
      </UFormGroup>

      <div class="flex justify-center py-[3vh]">
        <UButton
          class="flex text-center"
          size="xl"
          type="submit"
          :loading="isLoading"
        >
          Se connecter
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>
<script setup lang="ts">
import { z } from "zod";

const userCredentials = reactive({
  email: "",
  password: "",
});

const isLoading = ref(false);

const isPasswordVisible = ref(false);

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string(),
});

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(useAuthStore());
const router = useRouter();
const toast = useToast();
const login = async () => {
  try {
    isLoading.value = true;
    await authStore.login({
      login: userCredentials.email,
      password: userCredentials.password,
    });
    if (isAuthenticated.value) {
      toast.add({
        id: "login-success",
        title: "Connexion réussie",
        icon: "i-mdi-check",
      });
      router.push("/home");
    }
  } catch (error) {
    toast.add({
      id: "login-error",
      title: "Erreur d'authentification",
      description: "Identifiants incorrects",
      icon: "i-mdi-alert-circle",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
