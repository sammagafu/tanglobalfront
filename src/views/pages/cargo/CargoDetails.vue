<template>
    <div class="grid">
        <div class="col-12">
            <Toolbar class="mb-4 bg-green-100">
                <template v-slot:start>
                    <h4 class="font-bold text-xl ml-2">{{ cargo.cargo }}</h4>
                </template>
                <template v-slot:end>
                    <Button label="Export" icon="pi pi-upload" severity="danger" @click="exportCSV($event)"
                        class="bg-green-800 text-green-50 py-2 px-4" />
                </template>
            </Toolbar>

            <div class="card">
                <div class="grid grid-cols-2">
                    <div class="col-span-1">
                        <p class="py-2 font-bold">Cargo Details</p>
                        <div class="py-2">
                        <div class="py-2">
                            <p class="font-bold">Cargo Tracking Number</p>
                            {{ cargo.uuid }}
                        </div>
                        <div class="py-2">
                            <p class="font-bold">Cargo Weight</p>
                            {{ cargo.weight }} {{ cargo.weight_unit }}
                        </div>

                        <div class="py-2">
                            <p class="font-bold">Dimensions</p>
                            Height {{ cargo.height }}m Length{{ cargo.length }}m {{ cargo.width }}m
                        </div>

                        <div class="py-2">
                            <p class="font-bold">From</p>
                            {{ cargo.origin }}
                        </div>

                        <div class="py-2">
                            <p class="font-bold">Destination</p>
                            {{ cargo.destination }}
                        </div>

                        <div class="py-2">
                            <p class="font-bold">Temperature Sensitive</p>
                            {{ cargo.temperature_sensitive ? 'Yes' : 'No' }}
                        </div>

                        <div class="py-2">
                            <p class="font-bold">Fragile Cargo</p>
                            {{ cargo.fragile ? 'Yes' : 'No' }}
                        </div>
                        <div class="py-2">
                            <p class="font-bold">Special Handling Instructions</p>
                            {{ cargo.special_handling_instructions }}
                        </div>
                        </div>
                    </div>
                    <div class="col-span-1">
                        <p class="py-2 font-bold">Cargo Images</p>
                        <div class="py-2">
                            <Galleria :value="cargo.images" :responsiveOptions="responsiveOptions" :numVisible="5"
                                :thumbnailsPosition="position" containerStyle="max-width: 640px">
                                <template #item="slotProps">
                                    <img :src="slotProps.item.image" :alt="cargo.cargo"
                                        style="width: 100%; display: block;" />
                                </template>
                                <template #thumbnail="slotProps">
                                    <div class="grid grid-nogutter justify-content-center">
                                        <img :src="slotProps.item.image" :alt="cargo.cargo"
                                            style="width: 100%; display: block;" />
                                    </div>
                                </template>
                            </Galleria>
                        </div>
                    </div>
                </div>

                <div v-if="authStore.user.is_superuser && authStore.user.is_staff">
                    <div class="form">
                        <form @submit.prevent="">
                            <div class="field">
                                <label for="estimate">Enter the estimate price</label>
                                <InputNumber id="estimate" v-model="value2" inputId="locale-us" locale="en-US"
                                    :minFractionDigits="2" />
                            </div>
                            <Button icon="pi pi-shopping-cart" label="Bid to transport"
                                class="flex-auto md:flex-initial white-space-nowrap bg-primary px-4 py-2"></Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import apiService from '@/services/apiService'; // Import your API service
import { useAuthStore } from '@/store/authStore';
const authStore = useAuthStore();
const route = useRoute();
const cargo = ref({});
const value2 = ref(0); // Added for estimate price input

const responsiveOptions = ref([
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
]);

const getCargoData = async () => {
    try {
        const response = await apiService.get(`cargo/${route.params.uuid}/`);
        cargo.value = response.data;
    } catch (error) {
        console.error(error);
    }
};

onBeforeMount(() => {
    getCargoData();
});
</script>
