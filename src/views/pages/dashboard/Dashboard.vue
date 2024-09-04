<template v-if="authStore.user">
  <h2 class="py-4 font-2xl font-bold">Welcome {{ authStore.user.full_name }}</h2>
  <template v-if="authStore.user.is_superuser && authStore.user.is_staff">
    <AdminDashboard
      :userData="users"
      :companyData="company"
      :fleetData="fleetData"
      :updateData="update"
      :cargoData="cargo"
    />
  </template>
  <template v-else-if="authStore.user.is_individual">
    <CargoDashboard :fleetData="myFleetData" :updateData="update" :cargoData="cargo" />
  </template>
  <template
    v-else-if="
      authStore.user.is_company &&
      authStore.user.company_details.company_type === 'Cargo Company'
    "
  >
    <CargoDashboard :fleetData="myFleetData" :updateData="update" :cargoData="cargo" />
  </template>
  <template
    v-else-if="
      authStore.user.is_company &&
      authStore.user.company_details.company_type === 'Fleet Company'
    "
  >
    <FleetDashboard :fleetData="myFleetData" :updateData="update" :cargoData="cargo" />
  </template>
</template>

<script setup>
import AdminDashboard from "@/components/dashboard/AdminDashboard.vue";
import CargoDashboard from "@/components/dashboard/CargoDashboard.vue";
import FleetDashboard from "@/components/dashboard/FleetDashboard.vue";
import apiService from "@/services/apiService";
import { ref, onBeforeMount } from "vue";
import { useAuthStore } from "@/store/authStore"; // Import your auth store

const authStore = useAuthStore();
const users = ref([]);
const company = ref([]);
const fleetData = ref([]); // Properly initialized as an empty array
const myFleetData = ref([]); // Ensure myFleetData is correctly initialized
const update = ref([]);
const cargo = ref([]);

// Fetch users
const getUsers = () => {
  apiService
    .get("auth/users/")
    .then((response) => {
      users.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// Fetch companies
const getCompanies = () => {
  apiService
    .get("company")
    .then((response) => {
      company.value = response.data;
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

// Fetch fleet data
const getFleet = () => {
  apiService
    .get("fleet/")
    .then((response) => {
      fleetData.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// Fetch updates
const getUpdates = () => {
  apiService
    .get("update/")
    .then((response) => {
      update.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// Fetch cargo data
const getCategories = () => {
  apiService
    .get("cargo/")
    .then((response) => {
      cargo.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// Fetch user's fleet
const fetchMyFleet = () => {
  apiService
    .get("fleet/my-vehicles/")
    .then((response) => {
      myFleetData.value = response.data; // Set the fetched data correctly
    })
    .catch((error) => {
      console.log(error);
    });
};

// Fetch data when component is mounted
onBeforeMount(() => {
  getUsers();
  fetchMyFleet();
  getCompanies();
  getFleet();
  getUpdates();
  getCategories();
});
</script>
