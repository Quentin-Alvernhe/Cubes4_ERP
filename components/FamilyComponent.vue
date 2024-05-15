<template>
  <div class="flex px-3 py-3.5 dark:border-gray-700">
    <UInput
      v-model="searchinput"
      placeholder="Rechercher une famille"
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
    <UTooltip text="Ajouter une famille">
      <div class="flex items-center">
        <UButton
          icon="i-mdi-plus"
          size="xl"
          color="primary"
          class="rounded-full"
          :trailing="false"
          @click="showAddForm = true"
        />
      </div>
    </UTooltip>
  </div>
  <UModal v-model="showAddForm" class="m-4">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        header: { background: 'bg-primary' },
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold leading-6 text-white">
            Ajouter une famille
          </h1>
          <UButton
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="text-white hover:bg-primary hover:text-primary-800"
            @click="showAddForm = false"
          />
        </div>
      </template>
      <UForm :state="newFamily" @submit="submitAddFamily">
        <UInput
          v-model="newFamily.name"
          placeholder="Nom de famille"
          size="lg"
          class="mb-4"
        />
        <!-- Ajouter d'autres champs si nécessaire -->
        <span class="flex gap-6 justify-end">
          <UButton
            size="lg"
            label="Annuler"
            color="red"
            @click="showAddForm = false"
          />
          <UButton
            size="lg"
            type="submit"
            label="Valider"
            color="primary"
            :loading="isLoading"
          />
        </span>
      </UForm>
    </UCard>
  </UModal>
  <UCard class="m-6">
    <UTable :rows="filteredFamilies" :columns="columns">
      <template #id-data="{ row }: { row: Family }">
        <span class="w-2/8 text-left"> {{ row.id }} </span>
      </template>
      <template #name-data="{ row }: { row: Family }">
        <span class="w-4/8 text-center"> {{ row.name }} </span>
      </template>
      <template #actions-data="{ row }">
        <div class="w-2/8 text-right justify-end">
          <!-- <UButton
            color="primary"
            square
            size="sm"
            variant="solid"
            icon="i-heroicons-pencil-square-20-solid"
            @click="(showEditForm = true), (editedFamily = { ...row })"
          />

          <UButton
            icon="i-heroicons-trash-20-solid"
            size="sm"
            color="red"
            square
            variant="solid"
            class="ml-2"
            @click="confirmDeleteFamily(row.id)"
          /> -->
          <UTooltip text="Modifier une famille" class="mr-3">
            <div class="flex items-center">
              <UButton
                icon="i-heroicons-pencil-square-20-solid"
                size="xl"
                color="primary"
                class="rounded-full"
                :trailing="false"
                @click="(showEditForm = true), (editedFamily = { ...row })"
              />
            </div>
          </UTooltip>
          <UTooltip text="Supprimer une famille">
            <div class="flex items-center">
              <UButton
                icon="i-heroicons-trash-20-solid"
                size="xl"
                color="red"
                class="rounded-full"
                :trailing="false"
                @click="confirmDeleteFamily(row.id)"
              />
            </div>
          </UTooltip>
        </div>
      </template>
    </UTable>
    <UModal
      v-model="showDeleteConfirmationDialog"
      :state="deletedFamilyID"
      prevent-close
    >
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          header: { background: 'bg-primary' },
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold leading-6 text-white">
              Supprimer une famille
            </h1>
            <UButton
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="text-white hover:bg-primary hover:text-primary-800"
              @click="showDeleteConfirmationDialog = false"
            />
          </div>
        </template>

        <p>Êtes-vous sûr de vouloir supprimer cette famille ?</p>

        <template #footer>
          <span class="flex gap-6 justify-end">
            <UButton
              size="lg"
              label="Annuler"
              color="red"
              @click="showDeleteConfirmationDialog = false"
            />
            <UButton
              size="lg"
              type="submit"
              label="Valider"
              color="primary"
              :loading="isLoading"
              @click="deleteFamily"
            />
          </span>
        </template>
      </UCard>
    </UModal>
    <UModal v-model="showEditForm" prevent-close>
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          header: { background: 'bg-primary' },
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold leading-6 text-white">
              Modifier une famille
            </h1>
            <UButton
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="text-white hover:bg-primary hover:text-primary-800"
              @click="showEditForm = false"
            />
          </div>
        </template>
        <UForm :state="editedFamily" @submit="submitEditFamily">
          <UInput
            v-model="editedFamily.name"
            size="lg"
            placeholder="Nom de famille"
            class="mb-4"
          />

          <span class="flex gap-6 justify-end">
            <UButton
              size="lg"
              label="Annuler"
              color="red"
              @click="showEditForm = false"
            />
            <UButton
              size="lg"
              type="submit"
              label="Valider"
              color="primary"
              :loading="isLoading"
            />
          </span>
        </UForm>
      </UCard>
    </UModal>
  </UCard>
</template>

<script setup lang="ts">
import { type Family } from "../types/Family";

const families = ref<Family[]>([]);
const showAddForm = ref(false);
const showEditForm = ref(false);
const showDeleteConfirmationDialog = ref(false);
const columns = [
  { key: "id", label: "Numéro", sortable: true },
  { key: "name", label: "Nom", sortable: true },
  { key: "actions", label: "Actions", class: "text-end -translate-x-4" },
];
const toast = useToast();
const { token } = storeToRefs(useAuthStore());
const isLoading = ref(false);
onMounted(() => {
  fetchFamilies();
});

const fetchFamilies = async () => {
  try {
    families.value = await $fetch<Family[]>("http://localhost:8080/families", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
    });
  } catch (error) {
    toast.add({
      id: "fetchFamilies-error",
      title: "Erreur lors du chargement des familles",
      icon: "i-heroicons-exclamation-circle",
      timeout: 1000,
    });
  }
};

const newFamily = ref<Family>({ name: "" });
function submitAddFamily() {
  isLoading.value = true;
  addFamily(newFamily.value);
  isLoading.value = false;
  showAddForm.value = false;
  newFamily.value = { name: "" }; // Réinitialiser le formulaire
}

const addFamily = async (family: Family) => {
  try {
    await $fetch("http://localhost:8080/family", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: family,
    });
    toast.add({
      id: "addFamily-success",
      title: "Famille ajoutée avec succès",
      icon: "i-heroicons-check-circle",
      timeout: 1000,
    });
    await fetchFamilies();
  } catch (error) {
    toast.add({
      id: "addFamily-error",
      title: "Erreur lors de l'ajout de la famille",
      icon: "i-heroicons-exclamation-circle",
      timeout: 1000,
    });
  }
};

const editedFamily = ref<Family>({ name: "", id: undefined });
function submitEditFamily() {
  isLoading.value = true;
  editFamily(editedFamily.value);
  isLoading.value = false;
  showEditForm.value = false;
  editedFamily.value = { name: "" }; // Réinitialiser le formulaire
}

const editFamily = async (family: Family) => {
  try {
    await $fetch("http://localhost:8080/family", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: family,
    });
    toast.add({
      id: "editFamily-success",
      title: "Famille modifiée avec succès",
      icon: "i-heroicons-check-circle",
      timeout: 1000,
    });
    await fetchFamilies();
  } catch (error) {
    toast.add({
      id: "editFamily-error",
      title: "Erreur lors de la modification de la famille",
      icon: "i-heroicons-exclamation-circle",
      timeout: 1000,
    });
  }
};

const deletedFamilyID = ref({
  id: null,
  name: "",
});

const deleteFamily = async () => {
  try {
    const id = deletedFamilyID.value.id;
    await $fetch<void>(`http://localhost:8080/family/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
    });

    await fetchFamilies();

    deletedFamilyID.value.id = null;

    showDeleteConfirmationDialog.value = false;

    toast.add({
      id: "deleteFamily-success",
      title: "Suppression réussie",
      icon: "i-heroicons-check-circle",
      timeout: 1000,
    });
  } catch (error) {
    toast.add({
      id: "deleteFamily-error",
      title: "Erreur lors de la suppression de la famille",
      icon: "i-heroicons-exclamation-circle",
      timeout: 1000,
    });
    showDeleteConfirmationDialog.value = false;
  }
};

const confirmDeleteFamily = (id: any) => {
  deletedFamilyID.value.id = id;
  showDeleteConfirmationDialog.value = true;
};

const searchinput = ref("");
const filteredFamilies = computed(() => {
  if (!searchinput.value) {
    return families.value;
  }
  return families.value.filter((family) => {
    // Recherche dans name
    return [family.name].some((field) => {
      return field.toLowerCase().includes(searchinput.value.toLowerCase());
    });
  });
});
</script>
