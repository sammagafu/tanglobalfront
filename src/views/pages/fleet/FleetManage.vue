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

                <DataTable ref="dt" :value="cargotype" paginator :rows="10" v-model:selection="selectedProducts">
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="name" header="Fleet Category Name" :sortable="true" headerStyle="width:75%; min-width:10rem;">
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="m-2 bg-blue-700 text-white" severity="success" rounded
                                @click="editCategory(slotProps.data)" />
                            <Button icon="pi pi-trash" class="m-2 bg-red-700 text-white" severity="warning" rounded
                                @click="confirmDeleteCategory(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="categoryNameDialog" :style="{ width: '500px' }" :header="dialogHeader" :modal="true"
                    class="p-fluid">
                    <form @submit.prevent="saveCategory" ref="fomu">
                        <div class="field">
                            <label for="name">Fleet Category Name</label>
                            <InputText id="name" name="categoryname" v-model="categoryname" required autofocus
                                :class="{ 'p-invalid': submitted && !categoryname }" placeholder="Enter Fleet Category name" class="w-full md:w-30rem mb-5 bg-green-50 border border-green-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" />
                            <small class="p-invalid" v-if="submitted && !categoryname">Fleet name is required.</small>
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

const cargotype = ref([]);
const categoryNameDialog = ref(false);
const submitted = ref(false);
const categoryname = ref('');
const selectedCategory = ref(null);
const selectedProducts = ref([]);
const toast = useToast();

const getCargoType = () => {
    apiService.get('fleet/type')
        .then(response => {
            cargotype.value = response.data;
        })
        .catch(error => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load fleed types', life: 3000 });
        });
};

const saveCategory = () => {
    submitted.value = true;

    if (!categoryname.value) {
        return;
    }

    const payload = { name: categoryname.value };

    if (selectedCategory.value) {
        // Update category
        apiService.put(`fleet/type/${selectedCategory.value.slug}/`, payload)
            .then(response => {
                const index = cargotype.value.findIndex(cat => cat.slug === selectedCategory.value.slug);
                cargotype.value[index] = response.data;
                categoryNameDialog.value = false;
                categoryname.value = '';
                submitted.value = false;
                selectedCategory.value = null;
                toast.add({ severity: 'success', summary: 'Success', detail: 'Fleet category updated', life: 3000 });
            })
            .catch(error => {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update fleet category', life: 3000 });
            });
    } else {
        // Create new category
        apiService.post('fleet/type/', payload)
            .then(response => {
                cargotype.value.push(response.data);
                categoryNameDialog.value = false;
                categoryname.value = '';
                submitted.value = false;
                toast.add({ severity: 'success', summary: 'Success', detail: 'Fleet category created', life: 3000 });
            })
            .catch(error => {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create fleet category', life: 3000 });
            });
    }
};

const editCategory = (category) => {
    selectedCategory.value = category;
    categoryname.value = category.name;
    categoryNameDialog.value = true;
};

const confirmDeleteCategory = (category) => {
    confirmDialog({
        message: 'Are you sure you want to delete this Fleet category?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => deleteCategory(category),
    });
};

const deleteCategory = (category) => {
    apiService.delete(`fleet/type/${category.slug}/`)
        .then(() => {
            cargotype.value = cargotype.value.filter(cat => cat.slug !== category.slug);
            toast.add({ severity: 'success', summary: 'Success', detail: 'Fleet category deleted', life: 3000 });
        })
        .catch(error => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Fleet category', life: 3000 });
        });
};

const confirmDeleteSelected = () => {
    confirmDialog({
        message: 'Are you sure you want to delete the selected Fleet categories?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: deleteSelectedCategories,
    });
};

const deleteSelectedCategories = () => {
    const slugs = selectedProducts.value.map(product => product.slug);
    Promise.all(slugs.map(slug => apiService.delete(`fleet/type/${slug}/`)))
        .then(() => {
            cargotype.value = cargotype.value.filter(cat => !slugs.includes(cat.slug));
            selectedProducts.value = [];
            toast.add({ severity: 'success', summary: 'Success', detail: 'Selected fleet categories deleted', life: 3000 });
        })
        .catch(error => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete selected fleet categories', life: 3000 });
        });
};

const openNew = () => {
    categoryname.value = '';
    submitted.value = false;
    selectedCategory.value = null;
    categoryNameDialog.value = true;
};

const hideDialog = () => {
    categoryNameDialog.value = false;
};

const dialogHeader = computed(() => selectedCategory.value ? 'Edit Fleet Category' : 'Create Fleet Category');

onBeforeMount(() => {
    getCargoType();
});
</script>
