<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="mr-2" severity="success" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected"
                                :disabled="!selectedProducts.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import"
                            chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable ref="dt" :value="cargotypes" paginator :rows="10" v-model:selection="selectedProducts">
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="name" header="Cargo Type Name" :sortable="true" headerStyle="width:75%; min-width:10rem;">
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded
                                @click="editCargoType(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded
                                @click="confirmDeleteCargoType(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="cargoTypeDialog" :style="{ width: '500px' }" :header="dialogHeader" :modal="true"
                    class="p-fluid">
                    <form @submit.prevent="saveCargoType" ref="form">
                        <div class="field">
                            <label for="name">Cargo Type Name</label>
                            <InputText id="name" name="cargoTypeName" v-model="cargoTypeName" required autofocus
                                :class="{ 'p-invalid': submitted && !cargoTypeName }" placeholder="Enter Cargo Type name" class="w-full md:w-30rem mb-5 bg-green-50 border border-green-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" />
                            <small class="p-invalid" v-if="submitted && !cargoTypeName">Cargo type name is required.</small>
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
import { ref, computed, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import apiService from '@/services/apiService';

const cargotypes = ref([]);
const cargoTypeDialog = ref(false);
const submitted = ref(false);
const cargoTypeName = ref('');
const selectedCargoType = ref(null);
const selectedProducts = ref([]);
const toast = useToast();

const getCargoTypes = () => {
    apiService.get('cargo/type/cargo')
        .then(response => {
            cargotypes.value = response.data;
        })
        .catch(error => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load cargo types', life: 3000 });
        });
};

const saveCargoType = () => {
    submitted.value = true;

    if (!cargoTypeName.value) {
        return;
    }

    const payload = { name: cargoTypeName.value };

    if (selectedCargoType.value) {
        // Update cargo type
        apiService.put(`cargo/type/cargo/${selectedCargoType.value.slug}/`, payload)
            .then(response => {
                const index = cargotypes.value.findIndex(cat => cat.slug === selectedCargoType.value.slug);
                cargotypes.value[index] = response.data;
                cargoTypeDialog.value = false;
                cargoTypeName.value = '';
                submitted.value = false;
                selectedCargoType.value = null;
                toast.add({ severity: 'success', summary: 'Success', detail: 'Cargo type updated', life: 3000 });
            })
            .catch(error => {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update cargo type', life: 3000 });
            });
    } else {
        // Create new cargo type
        apiService.post('cargo/type/cargo/', payload)
            .then(response => {
                cargotypes.value.push(response.data);
                cargoTypeDialog.value = false;
                cargoTypeName.value = '';
                submitted.value = false;
                toast.add({ severity: 'success', summary: 'Success', detail: 'Cargo type created', life: 3000 });
            })
            .catch(error => {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create cargo type', life: 3000 });
            });
    }
};

const editCargoType = (cargoType) => {
    selectedCargoType.value = cargoType;
    cargoTypeName.value = cargoType.name;
    cargoTypeDialog.value = true;
};

const confirmDeleteCargoType = (cargoType) => {
    confirmDialog({
        message: 'Are you sure you want to delete this cargo type?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => deleteCargoType(cargoType),
    });
};

const deleteCargoType = (cargoType) => {
    apiService.delete(`cargo/type/${cargoType.slug}/`)
        .then(() => {
            cargotypes.value = cargotypes.value.filter(cat => cat.slug !== cargoType.slug);
            toast.add({ severity: 'success', summary: 'Success', detail: 'Cargo type deleted', life: 3000 });
        })
        .catch(error => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete cargo type', life: 3000 });
        });
};

const confirmDeleteSelected = () => {
    confirmDialog({
        message: 'Are you sure you want to delete the selected cargo types?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: deleteSelectedCargoTypes,
    });
};

const deleteSelectedCargoTypes = () => {
    const slugs = selectedProducts.value.map(product => product.slug);
    Promise.all(slugs.map(slug => apiService.delete(`cargo/type/${slug}/`)))
        .then(() => {
            cargotypes.value = cargotypes.value.filter(cat => !slugs.includes(cat.slug));
            selectedProducts.value = [];
            toast.add({ severity: 'success', summary: 'Success', detail: 'Selected cargo types deleted', life: 3000 });
        })
        .catch(error => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete selected cargo types', life: 3000 });
        });
};

const openNew = () => {
    cargoTypeName.value = '';
    submitted.value = false;
    selectedCargoType.value = null;
    cargoTypeDialog.value = true;
};

const hideDialog = () => {
    cargoTypeDialog.value = false;
};

const dialogHeader = computed(() => selectedCargoType.value ? 'Edit Cargo Type' : 'Create Cargo Type');

onBeforeMount(() => {
    getCargoTypes();
});
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>