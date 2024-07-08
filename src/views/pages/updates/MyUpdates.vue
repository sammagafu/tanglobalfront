<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h4>Select Updates that you want to receive</h4>
                <div class="py-4">
                    <form @submit.prevent="selectMyUpdates">
                        <div class="card flex justify-content-center">
                            <MultiSelect v-model="selectedTags" display="chip" :options="updatesType" optionLabel="name"
                                placeholder="Select Updates" :maxSelectedLabels="10" filter class="w-full" />
                        </div>
                        <div class="flex justify-content-start py-4">
                            <Button label="Update my update options" icon="pi pi-plus" type="submit" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h4>My Updates</h4>
                <div class="py-4">
                    <Message severity="success" icon="pi pi-bell" v-for="update in mySubscribeList" :key="update.index">
                        <div class="flex flex-row justify-between">
                            <router-link :to="{name:'update-details',params : {slug:update.slug}}">{{ update.name }}</router-link>
                        </div>
                    </Message>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import apiService from '@/services/apiService'; // Import your API service

const updates = ref(null);
const updatesType = ref([]);
const mySubscribeList = ref({})
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
const getMyUpdatesCategories = async () => {
    try {
        const response = await apiService.get('update/mine/categories/');
        mySubscribeList.value = response.data;
    } catch (error) {
        console.error(error);
    }
};

const getUpdateTypes = async () => {
    isLoading.value = true
    try {
        const response = await apiService.get('update/update-types/');
        updatesType.value = response.data;
        console.log(response);
    } catch (error) {
        console.error(error);
    }
};


const selectMyUpdates = async () => {
    const selectedUpdateTypeIds = selectedTags.value.map(tag => tag.id);
    const updateTypeObject = { update_types: selectedUpdateTypeIds }; // Fixed key name with dynamic values
    try {
        const response = await apiService.post('update/mine/', updateTypeObject);
        console.log(response.data); // Handle response as needed
    } catch (error) {
        console.error(error);
    }
};

onBeforeMount(() => {
    getUpdates();
    getUpdateTypes();
    getMyUpdatesCategories();
});

</script>
