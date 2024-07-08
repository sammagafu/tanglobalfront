<template>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0 bg-yellow-300">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-900 font-bold mb-3">Number of Fleet</span>
                        <div class="text-900 font-bold text-4xl">{{ totalFleet }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-yellow-400 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-black text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0 bg-green-300">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-900 font-bold mb-3">Completed Cargo</span>
                        <div class="text-900 font-bold text-4xl">{{ completedCargoCount }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-green-500 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-map-marker text-black-500 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0 bg-cyan-100">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-900 font-bold mb-3">Open Cargos</span>
                        <div class="text-900 font-bold text-4xl">{{ totalCargo }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-cyan-300 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-inbox text-black text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0 bg-gray-300">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-900 font-bold mb-3">My Updates</span>
                        <div class="text-900 font-bold text-4xl">{{ totalUpdates || 0 }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-gray-500 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-comment text-gray-100 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="grid py-4">
        <div class="col-12 lg:col-7">
            <h4>Available Cargos</h4>
            <DataView :value="cargoData" :sortOrder="sortOrder" :sortField="sortField">
                <!-- <template #header>
                        <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label"
                            placeholder="Sort By Price" @change="onSortChange($event)" />
                    </template> -->
                <template #list="slotProps">
                    <div class="grid grid-nogutter">
                        <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                            <div class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3"
                                :class="{ 'border-top-1 surface-border': index !== 0 }">

                                <div
                                    class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-4">
                                    <div
                                        class="flex flex-row md:flex-column justify-content-between align-items-start gap-2">
                                        <div>
                                            <span class="font-medium text-secondary text-sm my-4">Cargo
                                                Information</span>
                                            <div class="text-lg font-medium text-900">Cargo Name : {{ item.cargo }}
                                            </div>
                                            <div class="font-baseline font-medium flex flex-row">From : {{ item.origin
                                                }}</div>
                                            <div class="font-baseline font-medium flex flex-row">Flagile : {{
                                                item.fragile }}</div>

                                        </div>

                                    </div>
                                    <div
                                        class="flex flex-row md:flex-column justify-content-between align-items-start gap-2">
                                        <div>
                                            <span class="font-medium text-secondary text-sm">&nbsp;</span>
                                            <div class="font-baseline font-medium">Weight : {{ item.weight }} Tons</div>
                                            <div class="font-baseline font-medium">To : {{ item.destination }}</div>
                                            <div class="font-baseline font-medium">Temperature Senistive : {{
                                                item.temperature_sensitive }}</div>

                                        </div>

                                    </div>
                                    <div class="flex flex-column md:align-items-end gap-5">
                                        <!-- <span class="text-xl font-semibold text-900">Carrying Capacity{{ item.capacity }} Tons</span> -->
                                        <div class="flex flex-row-reverse md:flex-row gap-2">
                                            <router-link :to="{ name: 'cargo-details', params: { uuid: item.uuid } }"><Button
                                                    icon="pi pi-search" outlined></Button></router-link>
                                            <!-- <Button icon="pi pi-check" label="Approve " class="flex-auto md:flex-initial white-space-nowrap"></Button> -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
        <div class="col-12 lg:col-5">
            <h4>My Updates</h4>
            <Message severity="success" icon="pi pi-bell" v-for="update in updateData" :key="update.index">
                        <div class="flex flex-row justify-between">
                            <router-link :to="{name:'update-details',params : {slug:update.slug}}">{{ update.name }}</router-link>
                        </div>
                    </Message>
        </div>
    </div>

</template>

<script setup>
import { defineProps, computed, ref } from 'vue';

const props = defineProps({
    fleetData: {
        type: Array,
        required: true
    },
    updateData: {
        type: Array,
        required: true
    },
    cargoData: {
        type: Array,
        required: true
    },
});

// Calculate total users
const totalFleet = computed(() => props.fleetData.length);
const totalUpdates = computed(() => props.updateData.length);
const totalCargo = computed(() => props.cargoData.length);

// Calculate completed cargo count
const completedCargoCount = computed(() => {
    return props.cargoData.filter(item => item.status.toLowerCase() === 'completed').length;
});
</script>
