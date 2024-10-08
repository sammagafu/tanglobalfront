<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    <!-- Fleet Count Card -->
    <div class="col-span-1">
      <div class="card mb-0 bg-yellow-300">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-900 font-bold mb-3">Number of Fleet</span>
            <div class="text-900 font-bold text-4xl">{{ totalFleet }}</div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-yellow-400 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-shopping-cart text-black text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Completed Cargo Count Card -->
    <div class="col-span-1">
      <div class="card mb-0 bg-green-300">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-900 font-bold mb-3">Completed Cargo</span>
            <div class="text-900 font-bold text-4xl">{{ completedCargoCount }}</div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-green-500 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-map-marker text-black-500 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Open Cargos Count Card -->
    <div class="col-span-1">
      <div class="card mb-0 bg-cyan-100">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-900 font-bold mb-3">Open Cargos</span>
            <div class="text-900 font-bold text-4xl">{{ totalCargo }}</div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-cyan-300 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-inbox text-black text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Updates Count Card -->
    <div class="col-span-1">
      <div class="card mb-0 bg-gray-300">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-900 font-bold mb-3">My Updates</span>
            <div class="text-900 font-bold text-4xl">{{ totalUpdates || 0 }}</div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-gray-500 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-comment text-gray-100 text-xl"></i>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="py-4">
    <!-- Available Cargos Section -->
    <div class="col-12">
      <h4 class="p-4 font-bold text-2xl">Available Cargos</h4>
      <DataView :value="cargoData" :sortOrder="sortOrder" :sortField="sortField">
        <template #header>
          <Dropdown
            v-model="sortField"
            :options="sortOptions"
            optionLabel="label"
            placeholder="Sort By"
            @change="onSortChange($event)"
          />
        </template>
        <template #list="slotProps">
          <div class="grid grid-nogutter">
            <div v-for="(item, index) in slotProps.items" :key="index" class="">
              <div
                class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3"
                :class="{ 'border-top-1 surface-border': index !== 0 }"
              >
                <img
                  v-if="item.images && item.images.length > 0"
                  :src="item.images[0].image"
                  class="block xl:block mx-auto rounded"
                  :alt="item.platenumber"
                />
                <div
                  class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-4"
                >
                  <div
                    class="flex flex-row md:flex-column justify-content-between align-items-start gap-2"
                  >
                    <div>
                      <span class="font-medium text-secondary text-sm my-4"
                        >Cargo Information</span
                      >
                      <div class="text-lg font-medium text-900">
                        Cargo Name: {{ item.cargo }}
                      </div>
                      <div class="font-baseline font-medium flex flex-row">
                        From: {{ item.origin }}
                      </div>
                      <div class="font-baseline font-medium flex flex-row">
                        Fragile: {{ item.fragile }}
                      </div>
                    </div>
                  </div>
                  <div
                    class="flex flex-row md:flex-column justify-content-between align-items-start gap-2"
                  >
                    <div>
                      <span class="font-medium text-secondary text-sm">&nbsp;</span>
                      <div class="font-baseline font-medium">
                        Weight: {{ item.weight }} {{ item.weight_unit }}
                      </div>
                      <div class="font-baseline font-medium">
                        To: {{ item.destination }}
                      </div>
                      <div class="font-baseline font-medium">
                        Temperature Sensitive: {{ item.temperature_sensitive }}
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-column md:align-items-end gap-5">
                    <div class="flex flex-row-reverse md:flex-row gap-2">
                      <router-link
                        :to="{ name: 'cargo-details', params: { uuid: item.uuid } }"
                      >
                        <Button
                          icon="pi pi-search"
                          label="view"
                          outlined
                          class="p-button-lg bg-blue-700 text-white px-4 py-2"
                        ></Button>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataView>
    </div>

    <!-- My Updates Section -->
    <div class="col-12 lg:col-5">
      <h4 class="p-4 font-bold text-2xl">My Updates</h4>
      <div
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
        v-for="update in updateData"
        :key="update.index"
      >
        <router-link :to="{ name: 'update-details', params: { slug: update.slug } }">
          <strong class="font-bold">{{ update.name }}</strong>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed, ref } from "vue";

const props = defineProps({
  fleetData: {
    type: Array,
    required: true,
  },
  updateData: {
    type: Array,
    required: true,
  },
  cargoData: {
    type: Array,
    required: true,
  },
});

// Calculate totals
const totalFleet = computed(() => props.fleetData.length);
const totalUpdates = computed(() => props.updateData.length);
const totalCargo = computed(() => props.cargoData.length);
const completedCargoCount = computed(
  () => props.cargoData.filter((item) => item.status.toLowerCase() === "completed").length
);

// Sorting functionality
const sortField = ref("cargo");
const sortOrder = ref(1);
const sortOptions = [
  { label: "Cargo Name", value: "cargo" },
  { label: "Weight", value: "weight" },
  { label: "Origin", value: "origin" },
  { label: "Destination", value: "destination" },
];

const onSortChange = (event) => {
  sortField.value = event.value;
};
</script>
