<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div class="col-span-1">
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
        <div class="col-span-1">
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
        <div class="col-span-1">
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
        <div class="col-span-1">
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

// Calculate totals
const totalFleet = computed(() => props.fleetData.length);
const totalUpdates = computed(() => props.updateData.length);
const totalCargo = computed(() => props.cargoData.length);
const completedCargoCount = computed(() => {
    return props.cargoData.filter(item => item.status.toLowerCase() === 'completed').length;
});

// Sorting functionality
const sortField = ref('cargo');
const sortOrder = ref(1);

const sortOptions = [
    { label: 'Cargo Name', value: 'cargo' },
    { label: 'Weight', value: 'weight' },
    { label: 'Origin', value: 'origin' },
    { label: 'Destination', value: 'destination' }
];

const onSortChange = (event) => {
    sortField.value = event.value;
};
</script>