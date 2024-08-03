<!-- <template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h4>Image Plate Number: {{ fleet.plate_number }}</h4>
        <p>Weight: {{ fleet.capacity }} Tons</p>
        <p>Insurance: {{ fleet.is_insured ? 'Insured' : 'Not Insured' }}</p>
        <p>Owner Type: {{ fleet.owner_type }}</p>
        <p>Model: {{ fleet.model }}</p>
        <p>Make: {{ fleet.make }}</p>
        <p>Color: {{ fleet.color }}</p>
        <p>Created At: {{ fleet.created_at }}</p>
        <p>Updated At: {{ fleet.updated_at }}</p>
        <p>Fleet Images</p>

        
      </div>
    </div>
  </div>
</template> -->
<template>
  <div class="grid">
    <div class="col-12">
      <Toolbar class="mb-4 bg-green-100">
        <template v-slot:start>
          <h4 class="font-bold text-xl ml-2">{{ fleet.id }}</h4>
        </template>
        <template v-slot:end>
          <Button label="Export" icon="pi pi-upload" severity="danger" @click="exportCSV($event)"
            class="bg-green-800 text-green-50 py-2 px-4" />
        </template>
      </Toolbar>

      <div class="card">
        <div class="grid grid-cols-2">
          <div class="col-span-1">
            <p class="py-2 font-bold">Fleet Details</p>
            <div class="py-2">

              <div class="py-2">
                <p class="font-bold">Car Plate Number</p>
                {{ fleet.plate_number }}
              </div>

              <div class="py-2">
                <p class="font-bold">Car Model</p>
                {{ fleet.model }}
              </div>

              <div class="py-2">
                <p class="font-bold">Car Make</p>
                {{ fleet.make }}
              </div>

              <div class="py-2">
                <p class="font-bold">Car Color</p>
                {{ fleet.color }}
              </div>

              <div class="py-2">
                <p class="font-bold">Carrying Capacity </p>
                {{ fleet.capacity }} Tonns
              </div>

              <div class="py-2">
                          <p class="font-bold">Is Insuared</p>
                          {{ fleet.is_insured ? 'Yes' : 'No' }}
                      </div>


              <!-- <div class="py-2">
                          <p class="font-bold">Car Carrying Capacity</p>
                          {{ cargo.weight }} {{ cargo.capacity }}
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
                      </div> -->
            </div>
          </div>
          <div class="col-span-1">
            <p class="py-2 font-bold">Fleet Images</p>
            <div class="py-2">
              <Galleria :value="imageUrls" :responsiveOptions="responsiveOptions" :numVisible="5"
                :thumbnailsPosition="position" containerStyle="max-width: 640px">

                <template #item="slotProps">
                  <img :src="slotProps.item.image" :alt="'Image ' + slotProps.index"
                    style="width: 100%; display: block;" />
                </template>

                <template #thumbnail="slotProps">
                  <div class="grid grid-nogutter justify-content-center">
                    <img :src="slotProps.item.thumbnailImage" :alt="'Thumbnail ' + slotProps.index"
                      style="width: 100%; display: block;" />
                  </div>
                </template>
              </Galleria>
            </div>
          </div>
        </div>

        <div v-if="authStore.user.is_superuser && authStore.user.is_staff">
          <div v-if="!fleet.is_approved">
            <Button icon="pi pi-check" label="Approve Vehicle" class="flex-auto md:flex-initial white-space-nowrap bg-primary p-2"
              @click="approveVehicle"></Button>
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
import Galleria from 'primevue/galleria';
import Button from 'primevue/button'; // Make sure to import Button component
import { useAuthStore } from '@/store/authStore';
const authStore = useAuthStore();

// Route and fleet data
const route = useRoute();
const fleet = ref({
  images: [],
  capacity: '',
  plate_number: '',
  is_insured: false,
  is_approved: false,
  vehicle_type: null,
  created_by: null,
  owner_type: '',
  manufacture_year: null,
  registration_date: null,
  color: '',
  model: '',
  make: '',
  slug: '',
  created_at: '',
  updated_at: '',
  company: null,
  approved_by: null,
});

const imageUrls = ref([]);

// Fetch fleet data
const getFleetData = async () => {
  try {
    const response = await apiService.get(`/fleet/${route.params.fleetnumber}/`);
    fleet.value = response.data;
    updateImageUrls();
  } catch (error) {
    console.error('Error fetching fleet data:', error);
  }
};

const updateImageUrls = () => {
  if (fleet.value.images && Array.isArray(fleet.value.images)) {
    imageUrls.value = fleet.value.images.map(image => ({
      image: image.image,
      thumbnailImage: image.image,
    }));
    console.log("Image URLs:", imageUrls.value); // Debugging: Check the mapped URLs
  } else {
    imageUrls.value = [];
  }
};

onBeforeMount(() => {
  getFleetData();
});

// Approve vehicle function
const approveVehicle = async () => {
  try {
    const response = await apiService.patch(`/fleet/${route.params.fleetnumber}/approve/`);
    console.log('Vehicle approved successfully:', response.data);
    fleet.value.is_approved = true; // Update local state after approval
  } catch (error) {
    console.error('Error approving vehicle:', error);
    // Handle error
  }
};

// Responsive options and thumbnail position for Galleria
const responsiveOptions = ref([
  {
    breakpoint: '1024px',
    numVisible: 5,
  },
  {
    breakpoint: '768px',
    numVisible: 3,
  },
  {
    breakpoint: '560px',
    numVisible: 1,
  },
]);

const position = ref('bottom');
</script>

<style scoped>
/* Add your scoped styles here */
</style>
