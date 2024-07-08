<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h4>{{ update.name }}</h4>
                <div class="py-4">
                    <div v-html="update.content"></div>
                    <!-- {{ update.content }} -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router'
import apiService from '@/services/apiService'; // Import your API service
const route = useRoute()
const update = ref({})


const getMyUpdatesCategories = async () => {
    try {
        const response = await apiService.get(`update/${route.params.slug}/`);
        update.value = response.data;
    } catch (error) {
        console.error(error);
    }
};
onBeforeMount(() => {
    getMyUpdatesCategories()
    console.log(route.params.slug)
});

</script>