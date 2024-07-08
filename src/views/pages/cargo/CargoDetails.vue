<template>
   
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h4>{{ cargo.cargo }}</h4>
                <p>Cargo number : {{ cargo.uuid }}</p>
                <p>Weight: {{ cargo.weight }} Tons</p>
                <p>Dimensions: {{ cargo.dimensions}}</p>
                <p>is Fragile: {{ cargo.fragile}}</p>
                <p>Temperature Sensitive: {{ cargo.temperature_sensitive}}</p>
                <p>Special handling Instruction</p>
                <p>{{ cargo.special_handling_instructions }}</p>
                <p>From {{ cargo.origin }} - To {{ cargo.destination  }}</p>
                <p class="py-4">cargo Images</p>
                <!-- <div class="py-4">
                    <Galleria :value="getImageUrls()" :responsiveOptions="responsiveOptions" :numVisible="5"
                        :thumbnailsPosition="position" containerStyle="max-width: 640px">
                        <template #item="slotProps">
                            <img :src="slotProps.image" :alt="cargo.platenumber" style="width: 100%; display: block" />
                        </template>
                        <template #thumbnail="slotProps">
                            <div class="grid grid-nogutter justify-content-center">
                                <img :src="slotProps" :alt="cargo.platenumber" style="width: 100%; display: block;" />
                            </div>
                        </template>
                    </Galleria>
                    <div class="field">
                            <label for="name">Cargo Name {{ cargoname }}</label>
                            <InputText id="name" name="cargo" v-model="cargoname" required="true" autofocus
                                :invalid="submitted && !cargoname" placeholder="13Tons of Coal " />
                            <small class="p-invalid" v-if="submitted && !cargoname">Cargo name is required.</small>
                        </div>
                </div> -->
                
                <div class="" v-if="authStore.user.is_superuser === 'true' && authStore.user.is_staff === 'true'">
                <div class="form">
                    <form @submit.prevent="">
                       <div class="field">
                        <label for="estimate">Enter the estimate price</label>
                        <InputNumber id="estimate" v-model="value2" inputId="locale-us" locale="en-US" :minFractionDigits="2" />
                       </div>
                <Button icon="pi pi-shopping-cart" label="Bid to transport"
                                                    class="flex-auto md:flex-initial white-space-nowrap"></Button>
                    </form>
                </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router'
import apiService from '@/services/apiService'; // Import your API service
import { useAuthStore } from '@/store/authStore'; 
const authStore = useAuthStore();
const route = useRoute()
const cargo = ref({})

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
