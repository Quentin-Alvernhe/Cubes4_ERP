<template>
  <Ucontainer class="m-6">
    <div class="flex px-3 dark:border-gray-700">
      <UInput
        v-model="searchinput"
        placeholder="Rechercher un fournisseur..."
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
      <UTooltip text="Ajouter un fournisseur">
        <div class="flex items-center">
          <UButton
            icon="i-heroicons-plus"
            size="xl"
            color="primary"
            class="rounded-full"
            :trailing="false"
            @click="showAddSupplierDialog = true"
          />
        </div>
      </UTooltip>
    </div>
    <UCard class="m-6">
      <UTable :rows="filteredSuppliers" :columns="columns">
        <template #actions-data="{ row }">
          <UTooltip text="Modifier un fournisseur" class="mr-3">
            <div class="flex items-center">
              <UButton
                icon="i-heroicons-pencil-square-20-solid"
                size="xl"
                color="primary"
                class="rounded-full"
                :trailing="false"
                @click="
                  (showUpdateSupplierDialog = true),
                    (editSupplierName = { ...row })
                "
              />
            </div>
          </UTooltip>
          <UTooltip text="Supprimer un fournisseur">
            <div class="flex items-center">
              <UButton
                icon="i-heroicons-trash-20-solid"
                size="xl"
                color="red"
                class="rounded-full"
                :trailing="false"
                @click="confirmDeleteSupplier(row.id)"
              />
            </div>
          </UTooltip>
        </template>
      </UTable>
    </UCard>
    <UModal v-model="showAddSupplierDialog" prevent-close>
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
              Ajouter un fournisseur
            </h1>
            <UButton
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="text-white hover:bg-primary hover:text-primary-800"
              @click="showAddSupplierDialog = false"
            />
          </div>
        </template>
        <UForm :state="newSupplierName" @submit="onSubmit">
          <UInput
            v-model="newSupplierName.name"
            size="lg"
            class="mb-4"
            placeholder="Nom"
          />

          <UInput
            v-model="newSupplierName.adress"
            size="lg"
            class="mb-4"
            placeholder="Adresse"
          />

          <UInput
            v-model="newSupplierName.email"
            size="lg"
            class="mb-4"
            placeholder="Email"
          />

          <UInput
            v-model="newSupplierName.phoneNumber"
            size="lg"
            class="mb-4"
            placeholder="Numéro de téléphone"
          />

          <span class="flex gap-6 justify-end">
            <UButton
              size="lg"
              label="Annuler"
              color="red"
              @click="showAddSupplierDialog = false"
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

    <UModal v-model="showUpdateSupplierDialog" prevent-close>
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
              Modifier un fournisseur
            </h1>
            <UButton
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="text-white hover:bg-primary hover:text-primary-800"
              @click="showUpdateSupplierDialog = false"
            />
          </div>
        </template>
        <UForm :state="editSupplierName" @submit="updateSupplier">
          <UInput class="mb-4" v-model="editSupplierName.name" size="lg" />
          <UInput class="mb-4" v-model="editSupplierName.adress" size="lg" />
          <UInput class="mb-4" v-model="editSupplierName.email" size="lg" />
          <UInput
            class="mb-4"
            v-model="editSupplierName.phoneNumber"
            size="lg"
          />

          <span class="flex gap-6 justify-end">
            <UButton
              size="lg"
              label="Annuler"
              color="red"
              @click="showUpdateSupplierDialog = false"
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

    <UModal v-model="showDeleteConfirmationDialog" prevent-close>
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
              Supprimer un fournisseur
            </h1>
            <UButton
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="text-white hover:bg-primary hover:text-primary-800"
              @click="showDeleteConfirmationDialog = false"
            />
          </div>
        </template>
        <p class="p-4">Êtes-vous sûr de vouloir supprimer ce fournisseur ?</p>
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
              label="Valider"
              color="primary"
              @click="deleteSupplier"
            />
          </span>
        </template>
      </UCard>
    </UModal>
  </Ucontainer>
</template>

<script setup lang="ts">
import { type Supplier } from "../types/Supplier";

const suppliers = ref<Supplier[]>([]);
const showAddSupplierDialog = ref(false);
const showUpdateSupplierDialog = ref(false);
const showDeleteConfirmationDialog = ref(false);
const toast = useToast();
const isLoading = ref(false);
const { token } = storeToRefs(useAuthStore());
const newSupplierName = ref<Omit<Supplier, "id">>({
  name: "",
  adress: "",
  email: "",
  phoneNumber: "",
});

const editSupplierName = ref({
  id: null,
  name: "",
  adress: "",
  email: "",
  phoneNumber: "",
});

const columns = [
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
  {
    key: "adress",
    label: "Adresse",
    sortable: true,
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
  },
  {
    key: "phoneNumber",
    label: "Téléphone",
    sortable: true,
  },
  {
    key: "actions",
    label: "Actions",
  },
];

onMounted(async () => {
  try {
    suppliers.value = await $fetch<Supplier[]>(
      "http://localhost:8080/suppliers",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      },
    );
  } catch (error) {
    toast.add({
      id: "supplier-error",
      title: "Erreur lors de la récupération de la liste des fournisseurs",
      description:
        "Une erreur s'est produite lors de la récupération de la liste des fournisseurs.",
      icon: "i-heroicons-exclamation-circle",
    });
  }
});

const onSubmit = async () => {
  try {
    isLoading.value = true;
    const response = await $fetch<Supplier>("http://localhost:8080/supplier", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: newSupplierName.value,
    });

    showAddSupplierDialog.value = false;
    suppliers.value.push(response);
    // Réinitialiser les données du nouveau produit
    newSupplierName.value = {
      name: "",
      adress: "",
      email: "",
      phoneNumber: "",
    };

    toast.add({
      id: "supplier-success",
      title: "Ajout réussi",
      icon: "i-heroicons-check-circle",
    });
  } catch (error) {
    toast.add({
      id: "supplier-error",
      title: "Erreur lors de l'ajout",
      description: "Une erreur s'est produite lors de l'ajout du fournisseur.",
      icon: "i-heroicons-exclamation-circle",
    });
  } finally {
    isLoading.value = false;
  }
};

const updateSupplier = async () => {
  try {
    await $fetch<Supplier>(`http://localhost:8080/supplier`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: JSON.stringify(editSupplierName.value),
    });

    editSupplierName.value = {
      id: null,
      name: "",
      adress: "",
      email: "",
      phoneNumber: "",
    };

    showUpdateSupplierDialog.value = false;

    suppliers.value = await $fetch<Supplier[]>(
      "http://localhost:8080/suppliers",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      },
    );

    toast.add({
      id: "supplier-success",
      title: "Modification réussie",
      icon: "i-heroicons-check-circle",
    });
  } catch (error) {
    toast.add({
      id: "supplier-error",
      title: "Erreur lors de la modification",
      description:
        "Une erreur s'est produite lors de la modification du fournisseur.",
      icon: "i-heroicons-exclamation-circle",
    });
  }
};

const deleteSupplier = async (id: number) => {
  try {
    const id = editSupplierName.value.id;

    await $fetch<void>(`http://localhost:8080/supplier/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
    });

    suppliers.value = suppliers.value.filter((supplier) => supplier.id !== id);

    editSupplierName.value.id = null;

    showDeleteConfirmationDialog.value = false;

    toast.add({
      id: "supplier-success",
      title: "Suppression réussie",
      icon: "i-heroicons-check-circle",
    });
  } catch (error) {
    toast.add({
      id: "supplier-error",
      title: "Erreur lors de la suppression",
      description:
        "Une erreur s'est produite lors de la suppression du fournisseur.",
      icon: "i-heroicons-exclamation-circle",
    });
  }
};

const confirmDeleteSupplier = (id: null) => {
  editSupplierName.value.id = id;
  showDeleteConfirmationDialog.value = true;
};

const searchinput = ref("");
const filteredSuppliers = computed(() => {
  if (!searchinput.value) {
    return suppliers.value;
  }

    return suppliers.value.filter((supplier) => {
        // Recherche dans name, familyList et supplier
        return [supplier.name, supplier.adress, supplier.email].some(field => {
            return field.toLowerCase().includes(searchinput.value.toLowerCase());
        });
    });
});
</script>