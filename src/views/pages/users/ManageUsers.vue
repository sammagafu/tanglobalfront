<template>
    <div class="grid grid-">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4 bg-green-100">
                    <template v-slot:end>
                        <Button label="Export" icon="pi pi-upload" severity="danger" @click="exportCSV($event)" class="bg-green-800 text-green-50 py-2 px-4"/>
                    </template>
                </Toolbar>

                <DataTable ref="dt" :value="users" paginator :rows="10">

                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-between md:items-center py-4">
                            <h5 class="ml-4 text-2xl">Manage Users</h5>
                        </div>
                    </template>

                    <Column field="full_name" header="Full Name" :sortable="true" headerStyle="width:30%; min-width:10rem;">
                        <template #header="slotProps">
                            <div class="p-2"> <!-- Tailwind background and padding classes -->
                                {{ slotProps.header }}
                            </div>
                        </template>
                    </Column>

                    <Column field="email" header="Email" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #header="slotProps">
                            <div class="p-2"> <!-- Tailwind background and padding classes -->
                                {{ slotProps.header }}
                            </div>
                        </template>
                    </Column>

                    <Column field="is_active" header="Is Active" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #header="slotProps">
                            <div class="p-2"> <!-- Tailwind background and padding classes -->
                                {{ slotProps.header }}
                            </div>
                        </template>
                        <template #body="slotProps">
                            <Tag :severity="slotProps.data.is_active ? 'success' : 'danger'" :value="slotProps.data.is_active ? 'Active' : 'Inactive'" />
                        </template>
                    </Column>

                    <Column field="is_company" header="Is Company" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #header="slotProps">
                            <div class="p-2"> <!-- Tailwind background and padding classes -->
                                {{ slotProps.header }}
                            </div>
                        </template>
                    </Column>

                    <Column field="is_individual" header="Is Individual" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #header="slotProps">
                            <div class="p-2"> <!-- Tailwind background and padding classes -->
                                {{ slotProps.header }}
                            </div>
                        </template>
                    </Column>

                    <Column headerStyle="min-width:10rem;" header="Actions">
                        <template #body="slotProps">
                            <Button :icon="slotProps.data.is_active ? 'pi pi-lock' : 'pi pi-lock-open'" class="mr-2" :severity="slotProps.data.is_active ? 'danger' : 'success'" rounded
                                @click="toggleUserLock(slotProps.data.id)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded
                                @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import apiService from '@/services/apiService';
import { useToast } from 'primevue/usetoast';
import Tag from 'primevue/tag';

const toast = useToast();

const users = ref([]);
const getUsers = () => {
    apiService.get('auth/users/').then(response => {
        users.value = response.data;
        console.log(response);
    }).catch(error => {
        console.log(error);
    });
};

const lockUser = (id) => {
    apiService.patch(`/company/${id}/lock/`)
        .then(response => {
            console.log('User locked successfully:', response.data);
            // Update user status locally
            const user = users.value.find(u => u.id === id);
            if (user) user.is_active = false;
            toast.add({ severity: 'success', summary: 'Success', detail: 'User locked successfully', life: 3000 });
        })
        .catch(error => {
            console.error('Error locking user:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to lock user', life: 3000 });
        });
};

const unlockUser = (id) => {
    apiService.patch(`/company/${id}/unlock/`)
        .then(response => {
            console.log('User unlocked successfully:', response.data);
            // Update user status locally
            const user = users.value.find(u => u.id === id);
            if (user) user.is_active = true;
            toast.add({ severity: 'success', summary: 'Success', detail: 'User unlocked successfully', life: 3000 });
        })
        .catch(error => {
            console.error('Error unlocking user:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to unlock user', life: 3000 });
        });
};

const toggleUserLock = (user) => {
    if (user.is_active) {
        lockUser(user.id);
    } else {
        unlockUser(user.id);
    }
};

onBeforeMount(() => {
    getUsers();
});
</script>

<style scoped>
/* Add any custom styles here */
</style>