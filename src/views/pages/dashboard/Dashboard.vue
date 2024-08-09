<template v-if="authStore.user">
    <h2 class="py-4 font-2xl font-bold">Welcome {{authStore.user.full_name}}</h2>
    <template v-if="authStore.user.is_superuser && authStore.user.is_staff">
        <AdminDashboard :userData="users" :comapnyData="company" :fleetData="fleetData" :updateData="update" :cargoData="cargo" />
    </template>
    <template v-else-if="authStore.user.is_individual">
        <CargoDashboard :fleetData="myFleet" :updateData="update" :cargoData="cargo"/>
    </template>
    <template v-else-if="authStore.user.is_company && authStore.user.company_details.company_type === 'Cargo Company'">
        <CargoDashboard :fleetData="myFleet" :updateData="update" :cargoData="cargo"/>
    </template>
    <template v-else-if="authStore.user.is_company && authStore.user.company_details.company_type === 'Fleet Company'">
        <FleetDashboard :fleetData="myFleet" :updateData="update" :cargoData="cargo"/>
    </template>
</template>

<script setup>
import AdminDashboard from '@/components/dashboard/AdminDashboard.vue';
import CargoDashboard from '@/components/dashboard/CargoDashboard.vue';
import FleetDashboard from '@/components/dashboard/FleetDashboard.vue';
import apiService from '@/services/apiService'
import { ref, computed,onBeforeMount } from 'vue';

import { useAuthStore } from '@/store/authStore'; // Import your auth store
const authStore = useAuthStore();
const users  = ref ([])
const company  = ref ([])
const fleetData  = ref ([])
const myfleet  = ref ([])
const update  = ref ([])
const cargo  = ref ([])


const getUsers = () => {
    apiService.get('auth/users/').then(response => {
        users.value = response.data
    }).catch(error => {
        console.log(error);
    })
};

const getcompanies = () => {
    apiService.get('company').then(response => {
        company.value = response.data
        console.log(response);
    }).catch(error => {
        console.log(error);
    })
};

const getFleet = () => {
    apiService.get('fleet/')
        .then(response => {
            fleetData.value = response.data;
        })
        .catch(error => {
            console.log(error);
        });
};

const getUpdates = () => {
    apiService.get('update/')
        .then(response => {
            update.value = response.data;
        })
        .catch(error => {
            console.log(error);
        });
};

// method to get all categories
const getCategories = function () {
    apiService.get('cargo/')
        .then(async (response) => {
            cargo.value = await response.data;
        })
        .catch(error => {
            console.log(error);
        });
};

const myFleet = function () {
    apiService.get('fleet/my-vehicles/')
        .then(async (response) => {
            myfleet.value = await response.data;
        })
        .catch(error => {
            console.log(error);
        });
};



onBeforeMount(()=>{
    getUsers();
    myFleet();
    getcompanies();
    getFleet();
    getUpdates();
    getCategories();
});

</script>