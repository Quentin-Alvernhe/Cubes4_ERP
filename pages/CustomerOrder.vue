<template>
    <div>
      <div class="flex flex-col w-full">
        <span class="flex text-6xl gap-6 mt-5 ml-5">
          <UIcon class="mt-[0px]" name="i-mdi-bookmark-outline" />
          <h1>Commandes client</h1>
        </span>
        <customerorderFilters />
      </div>
      <customerorderItems />
    </div>
  </template>
  