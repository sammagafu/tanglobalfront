<template v-if="authStore.user">
    <h2>Welcome {{authStore.user.full_name}}</h2>
    <template v-if="authStore.user.is_superuser && authStore.user.is_staff">
        <AdminDashboard />
    </template>
    <template v-else-if="authStore.user.is_individual">
        <CargoDashboard />
    </template>
    <template v-else-if="authStore.user.is_company && authStore.user.company_details.company_type === 'Cargo Company'">
        <CargoDashboard />
    </template>
    <template v-else-if="authStore.user.is_company && authStore.user.company_details.company_type === 'Fleet Company'">
        <FleetDashboard />
    </template>
</template>

<script setup>
import AdminDashboard from '@/components/dashboard/AdminDashboard.vue';
import CargoDashboard from '@/components/dashboard/CargoDashboard.vue';
import FleetDashboard from '@/components/dashboard/FleetDashboard.vue';
import { ref, computed } from 'vue';
import { useAuthStore } from '@/store/authStore'; // Import your auth store

const authStore = useAuthStore();

</script>