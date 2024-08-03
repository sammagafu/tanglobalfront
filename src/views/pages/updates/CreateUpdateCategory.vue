<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="mr-2" severity="success" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected"
                                :disabled="!selectedUpdates || !selectedUpdates.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import"
                            chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable ref="dt" :value="updates" paginator :rows="10" v-model:selection="selectedUpdates">
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="name" header="Update Name" :sortable="true" headerStyle="width:75%; min-width:10rem;">
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded
                                @click="editUpdate(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded
                                @click="confirmDeleteUpdate(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="updateDialog" :style="{ width: '500px' }" :header="dialogHeader" :modal="true"
                    class="p-fluid">
                    <form @submit.prevent="saveUpdate" ref="form">
                        <div class="field">
                            <label for="name">Update Name</label>
                            <InputText id="name" name="updateName" v-model="updateName" required autofocus
                                :class="{ 'p-invalid': submitted && !updateName }" placeholder="Enter Update Name" class="w-full md:w-30rem mb-5 bg-green-50 border border-green-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" />
                            <small class="p-invalid" v-if="submitted && !updateName">Update name is required.</small>
                        </div>

                        <div class="mt-4">
                            <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" class="mr-2 w-full p-3 text-xl bg-red-700 text-white rounded-lg mt-4" />
                            <Button label="Save" icon="pi pi-check" type="submit" class="mr-2 w-full p-3 text-xl bg-primary text-white rounded-lg mt-4"/>
                        </div>
                    </form>
                </Dialog>

                <ConfirmDialog />
                <Toast ref="toast" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import apiService from '@/services/apiService';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

const router = useRouter();
const updates = ref([]);
const updateDialog = ref(false);
const submitted = ref(false);
const updateName = ref('');
const selectedUpdates = ref([]);
const selectedUpdate = ref(null);
const toast = useToast();

const getUpdates = () => {
    apiService.get('update/update-types/')
        .then(response => {
            updates.value = response.data;
        })
        .catch(error => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load updates', life: 3000 });
        });
};

const saveUpdate = () => {
    submitted.value = true;

    if (!updateName.value) {
        return;
    }

    const payload = { name: updateName.value };

    if (selectedUpdate.value) {
        // Update existing update
        apiService.put(`update/update-types/${selectedUpdate.value.slug}/`, payload)
            .then(response => {
                const index = updates.value.findIndex(upd => upd.slug === selectedUpdate.value.slug);
                updates.value[index] = response.data;
                updateDialog.value = false;
                updateName.value = '';
                submitted.value = false;
                selectedUpdate.value = null;
                toast.add({ severity: 'success', summary: 'Success', detail: 'Update updated', life: 3000 });
            })
            .catch(error => {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update update', life: 3000 });
            });
    } else {
        // Create new update
        apiService.post('update/update-types/', payload)
            .then(response => {
                updates.value.push(response.data);
                updateDialog.value = false;
                updateName.value = '';
                submitted.value = false;
                toast.add({ severity: 'success', summary: 'Success', detail: 'Update created', life: 3000 });
            })
            .catch(error => {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create update', life: 3000 });
            });
    }
};

const editUpdate = (update) => {
    selectedUpdate.value = update;
    updateName.value = update.name;
    updateDialog.value = true;
};

const confirmDeleteUpdate = (update) => {
    confirmDialog({
        message: 'Are you sure you want to delete this update?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => deleteUpdate(update),
    });
};

const deleteUpdate = (update) => {
    apiService.delete(`update/update-types/${update.slug}/`)
        .then(() => {
            updates.value = updates.value.filter(upd => upd.slug !== update.slug);
            toast.add({ severity: 'success', summary: 'Success', detail: 'Update deleted', life: 3000 });
        })
        .catch(error => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete update', life: 3000 });
        });
};

const confirmDeleteSelected = () => {
    confirmDialog({
        message: 'Are you sure you want to delete the selected updates?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: deleteSelectedUpdates,
    });
};

const deleteSelectedUpdates = () => {
    const slugs = selectedUpdates.value.map(update => update.slug);
    Promise.all(slugs.map(slug => apiService.delete(`update/update-types/${slug}/`)))
        .then(() => {
            updates.value = updates.value.filter(update => !slugs.includes(update.slug));
            selectedUpdates.value = [];
            toast.add({ severity: 'success', summary: 'Success', detail: 'Selected updates deleted', life: 3000 });
        })
        .catch(error => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete selected updates', life: 3000 });
        });
};

const openNew = () => {
    updateName.value = '';
    submitted.value = false;
    selectedUpdate.value = null;
    updateDialog.value = true;
};

const hideDialog = () => {
    updateDialog.value = false;
};

const dialogHeader = computed(() => selectedUpdate.value ? 'Edit Update' : 'Create Update');

onBeforeMount(() => {
    getUpdates();
});
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
