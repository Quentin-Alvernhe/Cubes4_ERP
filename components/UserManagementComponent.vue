<template>
  <Ucontainer class="m-6">
    <div class="flex px-3 py-3.5 dark:border-gray-700">
      <!-- <UInput
        v-model="searchinput"
        placeholder="Filtre utilisateur..."
        class="ml-4"
      />
      <UButton
        @click="
          opencloseModal('add', true),
            (roleID = 0),
            (roleSelectedName = ' Veuillez selectionner un role')
        "
        icon="i-heroicons-plus"
        class="ml-2"
      >
        Ajouter un utilisateur</UButton
      > -->
      <UInput
        v-model="searchinput"
        placeholder="Rechercher un utilisateur..."
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
      <UTooltip text="Ajouter un utilisateur">
        <div class="flex items-center">
          <UButton
            icon="i-heroicons-plus"
            size="xl"
            color="primary"
            class="rounded-full"
            :trailing="false"
            @click="
              opencloseModal('add', true),
                (roleID = 0),
                (roleSelectedName = ' Veuillez selectionner un role')
            "
          />
        </div>
      </UTooltip>
    </div>
    <UCard class="m-6">
      <UTable
        class="w-full"
        :loading-state="{
          icon: 'i-heroicons-arrow-path-20-solid',
          label: 'Loading...',
        }"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No Users',
        }"
        :rows="filteredRows"
        :columns="columnsTable"
      >
        <template #actions-data="{ row }">
          <UTooltip text="Modifier un utilisateur" class="mr-3">
            <div class="flex items-center">
              <UButton
                icon="i-heroicons-pencil-square-20-solid"
                size="xl"
                color="primary"
                class="rounded-full"
                :trailing="false"
                @click="
                  opencloseModal('edit', true),
                    (userData = { ...row }),
                    (roleID = row.role.id),
                    (roleSelectedName = row.role.name)
                "
              />
            </div>
          </UTooltip>
          <UTooltip text="Supprimer un utilisateur">
            <div class="flex items-center">
              <UButton
                icon="i-heroicons-trash-20-solid"
                size="xl"
                color="red"
                class="rounded-full"
                :trailing="false"
                @click="opencloseModal('delete', true), (userData = { ...row })"
              />
            </div>
          </UTooltip>
        </template>
        <!-- Si il n'y a rien -->
        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <span class="italic text-sm">No one here!</span>
            <UButton label="Ajouter des utilisateurs" />
          </div>
        </template>
      </UTable>
    </UCard>
    <UModal v-model="addFormIsOpen" prevent-close>
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
              Ajouter un utilisateur
            </h1>
            <UButton
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="text-white hover:bg-primary hover:text-primary-800"
              @click="opencloseModal('add', false)"
            />
          </div>
        </template>
        <UForm :state="userData" @submit="addUser">
          <UInput
            v-model="userData.firstname"
            placeholder="Prénom"
            class="mb-4"
            size="lg"
          />
          <UInput
            v-model="userData.lastname"
            placeholder="Nom"
            class="mb-4"
            size="lg"
          />
          <UInput
            v-model="userData.login"
            type="email"
            placeholder="Email"
            class="mb-4"
            size="lg"
          />
          <UInput
            v-model="userData.password"
            type="password"
            placeholder="Mot de passe"
            class="mb-4"
            size="lg"
          />
          <UDropdown
            :items="allRoles"
            :popper="{ placement: 'bottom-start' }"
            size="lg"
          >
            <UButton
              color="white"
              :label="roleSelectedName"
              trailing-icon="i-heroicons-chevron-down-20-solid"
            />
          </UDropdown>
        </UForm>
        <template #footer>
          <span class="flex gap-6 justify-end">
            <UButton
              size="lg"
              label="Annuler"
              color="red"
              @click="opencloseModal('add', false)"
            />
            <UButton
              size="lg"
              type="submit"
              label="Valider"
              color="primary"
              :loading="isLoading"
              @click="addUser"
            />
          </span>
        </template>
      </UCard>
    </UModal>
    <UModal v-model="editFormIsOpen" prevent-close>
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
              Modifier un utilisateur
            </h1>
            <UButton
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="text-white hover:bg-primary hover:text-primary-800"
              @click="opencloseModal('edit', false)"
            />
          </div>
        </template>
        <UForm :state="userData" @submit="updateUser">
          <UInput
            v-model="userData.firstname"
            placeholder="Prénom"
            size="lg"
            class="mb-4"
          />
          <UInput
            v-model="userData.lastname"
            placeholder="Prénom"
            size="lg"
            class="mb-4"
          />
          <UInput
            v-model="userData.login"
            placeholder="Prénom"
            size="lg"
            class="mb-4"
          />
          <UDropdown :items="allRoles" :popper="{ placement: 'bottom-start' }">
            <UButton
              color="white"
              :label="roleSelectedName"
              trailing-icon="i-heroicons-chevron-down-20-solid"
            />
          </UDropdown>
        </UForm>
        <template #footer>
          <span class="flex gap-6 justify-end">
            <UButton
              size="lg"
              label="Annuler"
              color="red"
              @click="opencloseModal('edit', false)"
            />
            <UButton
              size="lg"
              type="submit"
              label="Valider"
              color="primary"
              :loading="isLoading"
              @click="updateUser"
            />
          </span>
        </template>
      </UCard>
    </UModal>
    <UModal v-model="deleteFormIsOpen" prevent-close>
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
              Supprimer un utilisateur
            </h1>
            <UButton
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="text-white hover:bg-primary hover:text-primary-800"
              @click="opencloseModal('delete', false)"
            />
          </div>
        </template>
        Êtes-vous sûr de vouloir supprimer cet utilisateur ?
        <template #footer>
          <span class="flex gap-6 justify-end">
            <UButton
              size="lg"
              label="Annuler"
              color="red"
              @click="opencloseModal('delete', false)"
            />
            <UButton
              size="lg"
              type="submit"
              label="Valider"
              color="primary"
              :loading="isLoading"
              @click="deleteUser"
            />
          </span>
        </template>
      </UCard>
    </UModal>
  </Ucontainer>
</template>

<script setup lang="ts">
import { type User } from "../types/User";
import { type UserRole } from "../types/UserRole";

const columnsTable = [
  { key: "id", label: "ID" },
  { key: "firstname", label: "Prénom" },
  { key: "lastname", label: "Nom" },
  { key: "login", label: "Email" },
  { key: "role.name", label: "Role" },
  { key: "actions", label: "Actions" },
];

const toast = useToast();
const addFormIsOpen = ref(false);
const editFormIsOpen = ref(false);
const deleteFormIsOpen = ref(false);
const isLoading = ref(false);

onMounted(async () => {
  getAllUsers();
  getAllRoles();
});

const opencloseModal = (action: "add" | "edit" | "delete", bool: boolean) => {
  switch (action) {
    case "add":
      addFormIsOpen.value = bool;
      break;

    case "edit":
      editFormIsOpen.value = bool;
      break;

    case "delete":
      deleteFormIsOpen.value = bool;
      break;
  }

  if (!bool) {
    setTimeout(() => reinitialisteUserData(), 1000);
  }
};

const userData = ref<Partial<User>>({
  id: 0,
  firstname: "",
  lastname: "",
  login: "",
  password: "",
});
const roleID = ref(0);

const reinitialisteUserData = (): void => {
  userData.value = {
    id: undefined,
    firstname: "",
    lastname: "",
    login: "",
    password: "",
  };
  roleID.value = 0;
};

const addUser = async () => {
  const { token } = storeToRefs(useAuthStore());
  try {
    isLoading.value = true;
    const userToSave = { ...userData.value, role: { id: roleID.value } };
    const response = await $fetch("http://localhost:8080/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: JSON.stringify(userToSave),
    });
    await getAllUsers();
    opencloseModal("add", false);
    toast.add({
      id: "addUser-success",
      title: "Ajout réussie",
      icon: "i-heroicons-check-circle",
      timeout: 1000,
    });
  } catch (error) {
    toast.add({
      id: "addUser-error",
      title: "Erreur lors de l'ajout de l'utilisateur",
      icon: "i-mdi-alert-circle",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
};

const updateUser = async () => {
  const { token } = storeToRefs(useAuthStore());
  try {
    isLoading.value = true;
    const userToSave = { ...userData.value, role: { id: roleID.value } };
    const response = await $fetch(
      `http://localhost:8080/user/${userToSave.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
        body: JSON.stringify(userToSave),
      },
    );
    await getAllUsers();
    opencloseModal("edit", false);
    toast.add({
      id: "updateUser-success",
      title: "Modification réussie",
      icon: "i-heroicons-check-circle",
      timeout: 1000,
    });
  } catch (error) {
    toast.add({
      id: "updateUser-failure",
      title: "Erreur lors de la modification",
      icon: "i-mdi-alert-circle",
      color: "red",
      timeout: 1000,
    });
  } finally {
    isLoading.value = false;
  }
};

const deleteUser = async () => {
  const { token } = storeToRefs(useAuthStore());
  try {
    isLoading.value = true;
    await $fetch(`http://localhost:8080/user/${userData.value.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });
    await getAllUsers();
    opencloseModal("delete", false);
    toast.add({
      id: "deleteUser-success",
      title: "Suppression réussie",
      icon: "i-heroicons-check-circle",
      timeout: 1000,
    });
  } catch (error) {
    toast.add({
      id: "deleteUser-failure",
      title: "Erreur de suppression",
      icon: "i-mdi-alert-circle",
      color: "red",
      timeout: 1000,
    });
  } finally {
    isLoading.value = false;
  }
};

const getAllUsers = async () => {
  try {
    const { token } = storeToRefs(useAuthStore());
    users.value = await $fetch<User[]>("http://localhost:8080/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });
  } catch (error) {}
  reinitialisteUserData();
};

let allRoles: { label: string }[][] = [];
const getAllRoles = async () => {
  try {
    const { token } = storeToRefs(useAuthStore());
    allRoles = await $fetch<UserRole[]>("http://localhost:8080/roles", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    }).then((listRole) =>
      listRole.map((role) => {
        return [
          {
            label: role.name,
            click: () => {
              handleItemClick(role.id, role.name);
            },
          },
        ];
      }),
    );
  } catch (error) {}
};

let roleSelectedName: string = "Selectionner un Role";
const handleItemClick = (id: number, name: string) => {
  if (id) {
    roleSelectedName = name;
    roleID.value = id;
  }
};

const users = ref<User[]>([]);

const searchinput = ref("");
const filteredRows = computed(() => {
  if (!searchinput.value) {
    return users.value;
  }

  return users.value.filter((person) => {
    return Object.values(person).some((value) => {
      return String(value)
        .toLowerCase()
        .includes(searchinput.value.toLowerCase());
    });
  });
});
</script>
