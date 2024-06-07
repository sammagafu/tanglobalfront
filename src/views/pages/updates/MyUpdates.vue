<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h4>Select Updates that you want to receive</h4>
                <div class="py-4">
                    <VueMultiselect v-model="selectedTags" :multiple="true" :close-on-select="false"
                        placeholder="Pick some" :options="updatesType" @input="updateSelected" :loading="isLoading"
                        @search-change="asyncFind" label="name">
                    </VueMultiselect>
                    <div class="flex justify-content-start py-4">
                        <Button type="button" label="Update my update options" icon="pi pi-plus"
                            @click="selectMyUpdates" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h4>My Updates</h4>
                <div class="py-4">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import VueMultiselect from 'vue-multiselect';
import { useAuthStore } from '@/store/authStore'; // Import your auth store
import apiService from '@/services/apiService'; // Import your API service

const updates = ref(null);
const updatesType = ref([]);
const selectedTags = ref([]);
const isLoading = ref(false)

const getUpdates = async () => {
  try {
    const response = await apiService.get('update/mine/');
    updates.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const getUpdateTypes = async () => {
    isLoading.value = true
  try {
    const response = await apiService.get('update/update-types/');
    updatesType.value = response.data;
  } catch (error) {
    console.error(error);
  }
};


const selectMyUpdates = () => {
   console.log(selectedTags.value)
};

onBeforeMount(() => {
  getUpdates();
  getUpdateTypes();
});

</script>
