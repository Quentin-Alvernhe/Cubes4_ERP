<template>
  <div>
    <div class="flex flex-col w-full">
      <span class="flex text-6xl gap-6 mt-5 ml-5">
        <UIcon class="mt-[0px]" name="i-mdi-package-variant-closed-plus" />
        <h1>Commandes fournisseurs</h1>
      </span>
      <OrderFilters />
    </div>
    <OrderItems />
    <OrderCreateModal />
  </div>
</template>
