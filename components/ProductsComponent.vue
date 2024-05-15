<template>
  <div class="flex px-3 py-3.5 dark:border-gray-700">
    <UInput
      v-model="searchinput"
      placeholder="Rechercher un produit"
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
        >
        </UButton>
      </template>
    </UInput>
    <UTooltip text="Ajouter un produit">
      <div class="flex items-center">
        <UButton
          icon="i-mdi-plus"
          size="xl"
          color="primary"
          class="rounded-full"
          :trailing="false"
          @click="showAddProductDialog = true"
        />
      </div>
    </UTooltip>
  </div>

  <UCard class="m-6">
    <UTable :rows="filteredProducts" :columns="columns">
      <template #image-data="{ row }: { row: Product }">
        <img
          v-if="!isLoading"
          :src="`http://localhost:9000/products/${row.name}.png?t=${new Date().getTime()}`"
          width="100"
          height="100"
        />
      </template>
      <template #familyList-data="{ row }: { row: Product }">
        {{ row.familyList.map((family) => family.name).join(", ") }}
      </template>
      <template #supplier-data="{ row }: { row: Product }">
        <span class="">
          {{ row.supplier.name }}
        </span>
      </template>
      <template #price-data="{ row }: { row: Product }">
        <span class=""> {{ row.price / 100 }} € </span>
      </template>
      <template #purchase_price-data="{ row }: { row: Product }">
        <span class=""> {{ row.purchase_price / 100 }} € </span>
      </template>

      <template #actions-data="{ row }">
        <UTooltip text="Modifier un produit" class="mr-3">
          <div class="flex items-center">
            <UButton
              icon="i-heroicons-pencil-square-20-solid"
              size="xl"
              color="primary"
              class="rounded-full"
              :trailing="false"
              @click="
                (showUpdateProductDialog = true),
                  (editProductName = {
                    ...row,
                    supplier: row.supplier.id,
                    familyList: row.familyList.map((family: Family) => ({
                      id: family.id,
                      name: family.name,
                    })),
                  })
              "
            />
          </div>
        </UTooltip>
        <UTooltip text="Supprimer un produit">
          <div class="flex items-center">
            <UButton
              icon="i-heroicons-trash-20-solid"
              size="xl"
              color="red"
              class="rounded-full"
              :trailing="false"
              @click="confirmDeleteProduct(row.id)"
            />
          </div>
        </UTooltip>
      </template>
    </UTable>
  </UCard>

  <UModal v-model="showAddProductDialog" prevent-close>
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        header: { background: 'bg-primary' },
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-white dark:text-white"
          >
            Ajouter un produit
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1 hover:bg-primary hover:text-black text-white"
            @click="showAddProductDialog = false"
          />
        </div>
      </template>
      <UForm :state="newProduct" @submit="addProduct">
        <UFormGroup label="Nom" name="name">
          <UInput v-model="newProduct.name" />
        </UFormGroup>
        <UFormGroup label="Quantité" name="quantity">
          <UInput v-model="newProduct.quantity" type="number" />
        </UFormGroup>
        <UFormGroup name="familyList" label="Famille">
          <USelectMenu
            model-value="newProduct.familyList"
            multiple
            placeholder="Choisir famille"
            :options="familyOptions"
          />
        </UFormGroup>
        <UFormGroup name="supplier" label="Fournisseur">
          <USelect
            v-model="newProduct.supplier"
            placeholder="Choisir fournisseur"
            :options="supplierOptions"
          />
        </UFormGroup>
        <UFormGroup label="Prix d'achat" name="purchase_price">
          <UInput
            type="text"
            :value="newProduct.purchase_price"
            @change="newProduct.purchase_price = $event.target.value"
          />
        </UFormGroup>
        <UFormGroup label="Prix de vente" name="price">
          <UInput
            type="text"
            :value="newProduct.price"
            @change="newProduct.price = $event.target.value"
          />
        </UFormGroup>
        <UFormGroup name="description" label="Description">
          <UInput v-model="newProduct.description" />
        </UFormGroup>
        <UFormGroup name="degustation" label="Degustation">
          <UInput v-model="newProduct.degustation" />
        </UFormGroup>

        <input
          class="my-3 relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
          type="file"
          @change="file = ($event.target as HTMLInputElement)?.files"
        />

        <UButton type="submit" color="primary">Ajouter</UButton>
      </UForm>
    </UCard>
  </UModal>

  <UModal v-model="showUpdateProductDialog" prevent-close>
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        header: { background: 'bg-primary' },
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-white dark:text-white"
          >
            Modifier un produit
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1 hover:text-black text-white hover:bg-primary"
            @click="showUpdateProductDialog = false"
          />
        </div>
      </template>
      <UForm :state="editProductName" @submit="updateProduct">
        <UFormGroup name="name" label="Nom">
          <UInput v-model="editProductName.name" />
        </UFormGroup>
        <UFormGroup name="quantity" label="Quantité">
          <UInput v-model="editProductName.quantity" type="number" />
        </UFormGroup>

        <UFormGroup name="supplier" label="Fournisseur">
          <USelect
            v-model="editProductName.supplier"
            placeholder="Choisir fournisseur"
            :options="supplierOptions"
          />
        </UFormGroup>
        <UFormGroup label="Prix d'achat" name="purchase_price">
          <UInput
            type="text"
            :value="editProductName.purchase_price / 100"
            @change="editProductName.purchase_price = $event.target.value * 100"
          />
        </UFormGroup>
        <UFormGroup label="Prix de vente" name="price">
          <UInput
            type="text"
            :value="editProductName.price / 100"
            @change="editProductName.price = $event.target.value * 100"
          />
        </UFormGroup>
        <UFormGroup name="description" label="Description">
          <UInput v-model="editProductName.description" />
        </UFormGroup>
        <UFormGroup name="degustation" label="Degustation">
          <UInput v-model="editProductName.degustation" />
        </UFormGroup>

        <input
          class="my-3 relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
          type="file"
          @change="updateFile = ($event.target as HTMLInputElement)?.files"
        />

        <UButton class="mt-4" type="submit" color="primary">Modifier</UButton>
      </UForm>
    </UCard>
  </UModal>

  <UModal v-model="showDeleteConfirmationDialog" prevent-close>
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Confirmation de suppression
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="showDeleteConfirmationDialog = false"
          />
        </div>
      </template>
      <p class="p-4">Êtes-vous sûr de vouloir supprimer ce produit ?</p>
      <template #footer>
        <span class="flex gap-6 justify-end">
          <div>
            <UButton size="lg" class="flex justify-end p-4" />
            <UButton @click="showDeleteConfirmationDialog = false" class="mr-2">
              Non
            </UButton>
            <UButton @click="deleteProduct" color="primary"> Oui </UButton>
          </div>
          label="Annuler" color="red" @click="showDeleteConfirmationDialog =
          false" />
          <UButton
            size="lg"
            label="Valider"
            color="primary"
            @click="deleteProduct()"
          />
        </span>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import axios from "axios";
import { type Product } from "../types/Product";
import { type Supplier } from "../types/Supplier";
import { type Family } from "../types/Family";

const { token } = storeToRefs(useAuthStore());
const products = ref<Product[]>([]);
const showAddProductDialog = ref(false);
const showUpdateProductDialog = ref(false);
const familyOptions = ref<Array<{ label: string; value: number }>>([]);
const supplierOptions = ref<Array<{ label: string; value: number }>>([]);
const showDeleteConfirmationDialog = ref(false);
const toast = useToast();
const file = ref<FileList | null>(null);
const updateFile = ref<FileList | null>(null);
const isLoading = ref(false);
const editProductName = ref<any>({
  id: null,
  name: "",
  quantity: 0,
  familyList: [],
  supplier: "",
  price: 0.0,
  purchase_price: 0.0,
  description: "",
  degustation: "",
});

const newProduct = ref({
  name: "",
  quantity: 0,
  familyList: [],
  supplier: "",
  price: 0.0,
  purchase_price: 0.0,
  description: "",
  degustation: "",
});

const columns = [
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
  {
    key: "image",
    label: "Image",
    sortable: false,
  },
  {
    key: "familyList",
    label: "Famille",
    sortable: true,
  },
  {
    key: "supplier",
    label: "Fournisseur",
    sortable: true,
  },
  {
    key: "price",
    label: "Prix de vente",
    sortable: true,
  },
  {
    key: "purchase_price",
    label: "Prix fournisseur",
    sortable: true,
  },
  {
    key: "actions",
    label: "Actions",
  },
];

onMounted(async () => {
  try {
    // Liste familles
    const families = await $fetch<Family[]>("http://localhost:8080/families", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
    });
    familyOptions.value = families.map((family) => ({
      label: family.name,
      value: family.id || 0,
    }));

    // Liste fournisseurs
    const suppliers = await $fetch<Supplier[]>(
      "http://localhost:8080/suppliers",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      },
    );
    supplierOptions.value = suppliers.map((supplier) => ({
      label: supplier.name,
      value: supplier.id,
    }));

    // Liste produits
    products.value = await $fetch<Product[]>("http://localhost:8080/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
    });
  } catch (error) {}
});

const addProduct = async () => {
  try {
    isLoading.value = true;
    // Vérification pour s'assurer que newProduct.value.familyList est un tableau avant d'utiliser map
    // On convertis familyList en tableau d'identifiants de familles

    const familyList = (newProduct.value.familyList as any).map(
      (family: any) => {
        return { id: family.value };
      },
    );

    await $fetch<Product>(`http://localhost:8080/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: {
        name: newProduct.value.name,
        quantity: newProduct.value.quantity,
        reliquat: newProduct.value.quantity,
        familyList,
        supplier: { id: newProduct.value.supplier },
        price: newProduct.value.price * 100,
        purchase_price: newProduct.value.purchase_price * 100,
        description: newProduct.value.description,
        degustation: newProduct.value.degustation,
      },
    });

    if (file.value?.length) {
      const fd = new FormData();
      fd.append("file", file.value[0]);
      fd.append("name", newProduct.value.name);
      await axios.post("http://localhost:3031", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    showAddProductDialog.value = false;

    products.value = [];

    // Actualisation de la liste des produits
    products.value = await $fetch<Product[]>("http://localhost:8080/products", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    // Réinitialisation des données du nouveau produit
    newProduct.value = {
      name: "",
      quantity: 0,
      familyList: [],
      supplier: "",
      price: 0.0,
      purchase_price: 0.0,
      description: "",
      degustation: "",
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
      description: "Une erreur s'est produite lors de l'ajout du produit.",
      icon: "i-heroicons-exclamation-circle",
    });
  } finally {
    isLoading.value = false;
  }
};

const updateProduct = async () => {
  try {
    // Vérification pour s'assurer que newProduct.value.familyList est un tableau avant d'utiliser map
    // On convertis familyList en tableau d'identifiants de familles
    const familyListEdited = editProductName.value.familyList.map(
      (family: any) => {
        return { id: family.id };
      },
    );

    await $fetch<Product>(`http://localhost:8080/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: {
        id: editProductName.value.id,
        name: editProductName.value.name,
        quantity: editProductName.value.quantity,
        reliquat: editProductName.value.quantity,
        familyList: familyListEdited,
        supplier: { id: editProductName.value.supplier },
        price: editProductName.value.price,
        purchase_price: editProductName.value.purchase_price,
        description: editProductName.value.description,
        degustation: editProductName.value.degustation,
      },
    });

    if (updateFile.value?.length) {
      const fd = new FormData();
      fd.append("file", updateFile.value[0]);
      fd.append("name", editProductName.value.name);
      await axios.post("http://localhost:3031", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    // Réinitialisation des données de l'édition du produit
    editProductName.value = {
      id: null,
      name: "",
      quantity: 0,
      familyList: [],
      supplier: "",
      price: 0.0,
      purchase_price: 0.0,
      description: "",
      degustation: "",
    };

    showUpdateProductDialog.value = false;

    // Actualisation de la liste des produits
    products.value = await $fetch<Product[]>("http://localhost:8080/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
    });

    toast.add({
      id: "product-success",
      title: "Modification réussie",
      icon: "i-heroicons-check-circle",
    });
  } catch (error) {
    toast.add({
      id: "product-error",
      title: "Erreur lors de la modification",
      description:
        "Une erreur s'est produite lors de la modification du produit.",
      icon: "i-heroicons-exclamation-circle",
    });
  }
};

const deleteProduct = async () => {
  try {
    const id = editProductName.value.id;

    await $fetch<void>(`http://localhost:8080/product/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
    });

    products.value = products.value.filter((product) => product.id !== id);

    editProductName.value.id = null;

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
        "Une erreur s'est produite lors de la suppression du produit.",
      icon: "i-heroicons-exclamation-circle",
    });
  }
};

const confirmDeleteProduct = (id: null) => {
  editProductName.value.id = id;
  showDeleteConfirmationDialog.value = true;
};

const searchinput = ref("");
const filteredProducts = computed(() => {
  if (!searchinput.value) {
    return products.value;
  }

  return products.value.filter((product) => {
    const familyListString = product.familyList
      .map((family) => family.name)
      .join(" ");
    const supplierString = product.supplier.name;

    return [product.name, familyListString, supplierString].some((field) => {
      return field.toLowerCase().includes(searchinput.value.toLowerCase());
    });
  });
});
</script>
