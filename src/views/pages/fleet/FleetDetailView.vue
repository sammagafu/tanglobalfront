<template>
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <h4>Image Plate number {{ fleet.platenumber }}</h4>
          <p>Weight: {{ fleet.capacity }} Tons</p>
          <p>Insurance: {{ fleet.isInsuared ? 'Insured' : 'Not Insured' }}</p>
          <p>Fleet Images</p>
          
          <!-- Galleria Component for Image Display -->
          <div class="py-4">
            <Galleria 
              :value="getImageUrls()" 
              :responsiveOptions="responsiveOptions" 
              :numVisible="5"
              :thumbnailsPosition="position" 
              containerStyle="max-width: 640px"
            >
              <!-- Template for each Image -->
              <template #item="slotProps">
                <img 
                  :src="slotProps.image" 
                  :alt="'Image ' + slotProps.index" 
                  style="width: 100%; display: block;"
                />
              </template>
              <!-- Template for each Thumbnail -->
              <template #thumbnail="slotProps">
                <div class="grid grid-nogutter justify-content-center">
                  <img 
                    :src="slotProps.thumbnailImage" 
                    :alt="'Thumbnail ' + slotProps.index" 
                    style="width: 100%; display: block;"
                  />
                </div>
              </template>
            </Galleria>
          </div>
          
          <!-- Approval Button -->
          <div v-if="!fleet.isApproved">
            <Button 
              icon="pi pi-check" 
              label="Approve" 
              class="flex-auto md:flex-initial white-space-nowrap" 
              @click="approveVehicle"
            ></Button>
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
  
  const route = useRoute();
  const fleet = ref({
    images: [],
    capacity: '',
    platenumber: '',
    isInsuared: false,
    isApproved: false,
  });
  
  const getFleetData = async () => {
    try {
      const response = await apiService.get(`fleet/${route.params.fleetnumber}/`);
      fleet.value = response.data;
    } catch (error) {
      console.error(error);
    }
  };
  
  onBeforeMount(() => {
    getFleetData();
  });
  
  const getImageUrls = () => {
    if (fleet.value.images && Array.isArray(fleet.value.images)) {
      return fleet.value.images.map(image => ({
        image: image.image,
        thumbnailImage: image.image,
      }));
    } else {
      return [];
    }
  };
  
  const approveVehicle = () => {
    apiService.patch(`/fleet/${route.params.fleetnumber}/approve/`)
      .then(response => {
        console.log('Vehicle approved successfully:', response.data);
        fleet.value.isApproved = true; // Update local state after approval
      })
      .catch(error => {
        console.error('Error approving vehicle:', error);
        // Handle error
      });
  };
  </script>
  
  <style scoped>
  /* Add your scoped styles here */
  </style>
  