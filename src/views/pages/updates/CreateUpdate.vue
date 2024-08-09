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
                        <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV" />
                    </template>
                </Toolbar>

                <DataView :value="fleet" :sortOrder="sortOrder" :sortField="sortField">
                    <template #header>
                        <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label"
                            placeholder="Sort By Price" @change="onSortChange($event)" />
                    </template>
                    <template #list="slotProps">
                        <div class="grid grid-nogutter">
                            <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                                <div class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3"
                                    :class="{ 'border-top-1 surface-border': index !== 0 }">
                                    <div
                                        class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-4">
                                        <div
                                            class="flex flex-row md:flex-column justify-content-between align-items-start gap-2">
                                            <div>
                                                <span class="font-medium text-primary">{{ item.name }}</span>
                                                <div class="text-lg font-medium text-900 mt-2" v-html="item.content"></div>
                                            </div>
                                        </div>
                                        <div class="flex flex-column md:align-items-end gap-5">
                                            <div class="flex flex-row-reverse md:flex-row gap-2 bg-slate-100">
                                                <Button icon="pi pi-pencil" label="Edit" class="flex-auto md:flex-initial white-space-nowrap bg-blue-700 px-4 py-2 text-white" @click="editProduct(item)"></Button>
                                                <div v-if="item.is_approved !== true">
                                                    <Button icon="pi pi-check" label="Approve" class="flex-auto md:flex-initial white-space-nowrap bg-primary px-4 py-2 text-white" @click="approveVehicle(item.slug)"></Button>
                                                </div>
                                                <router-link :to="{name:'update-details', params: {slug:item.slug}}"> <Button icon="pi pi-search" outlined class="bg-black px-4 py-2 text-white"></Button></router-link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </DataView>

                <Dialog v-model:visible="productDialog" :style="{ width: '850px' }" :header="productDialogHeader" :modal="true"
                    class="p-fluid">
                    <form @submit.prevent="saveUpdate" ref="fomu">
                        <div class="field">
                            <label for="updatename">Update Name</label>
                            <InputText id="updatename" v-model.trim="updatename" required autofocus
                                :class="{ 'p-invalid': submitted && !updatename }" placeholder="Enter Update Name"
                                class="w-full mb-5 bg-green-50 border border-green-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" />
                            <small class="p-invalid" v-if="submitted && !updatename">Update Name is required.</small>
                        </div>
                        <div class="field">
                            <label for="updatetype">Update Type</label>
                            <Dropdown id="updatetype" v-model="updateType" :options="updatetype"
                                optionLabel="name" name="updatetype" placeholder="Select Update Type"
                                optionValue="id" class="w-full mb-5 dropdown-full-width bg-green-50 border border-green-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" />
                        </div>

                        <div class="field">
                            <label for="update">Update Details</label>
                            <Editor v-model="update" :style="{ height: '240px' }" class="editor-full-width" />
                            <small class="p-invalid" v-if="submitted && !update">Update details are required.</small>
                        </div>

                        <div class="mt-4">
                            <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" class="mr-2 w-full p-3 text-xl bg-red-700 text-white rounded-lg mt-4" />
                            <Button label="Save" icon="pi pi-check" type="submit" class="mr-2 w-full p-3 text-xl bg-primary text-white rounded-lg mt-4"/>
                        </div>
                    </form>
                </Dialog>

                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm"
                    :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">Are you sure you want to delete <b>{{ product.name }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm"
                    :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>Are you sure you want to delete the selected products?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onBeforeMount, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import apiService from '@/services/apiService'; // Import your API service
import Editor from 'primevue/editor';

const toast = useToast();

const fleet = ref([]);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref([]);
const dt = ref(null);
const filters = ref({});

const updatetype = ref([]);

// form fields
const fomu = ref(null);
const updatename = ref('');
const weight = ref(null);
const updateType = ref(null);
const update = ref('');
const isInsured = ref(null);
const submitted = ref(false);
const files = ref(null);
const sortKey = ref();
const sortOrder = ref();
const sortField = ref();
const sortOptions = ref([
    { label: 'Price High to Low', value: '!price' },
    { label: 'Price Low to High', value: 'price' },
]);
const onSortChange = (event) => {
    const value = event.value.value;
    const sortValue = event.value;

    if (value.indexOf('!') === 0) {
        sortOrder.value = -1;
        sortField.value = value.substring(1, value.length);
        sortKey.value = sortValue;
    } else {
        sortOrder.value = 1;
        sortField.value = value;
        sortKey.value = sortValue;
    }
};

const productDialogHeader = computed(() => product.value?.id ? 'Edit Update' : 'Create Update');

// method to get all categories
const getCategories = () => {
    apiService.get('update/update-types/')
        .then(response => {
            updatetype.value = response.data;
        })
        .catch(error => {
            console.log(error);
        });
};

const getFleet = () => {
    apiService.get('update/')
        .then(response => {
            fleet.value = response.data;
            console.log(fleet.value);
        })
        .catch(error => {
            console.log(error);
        });
};

const saveUpdate = () => {
    submitted.value = true;
    if (!updatename.value || !updateType.value || !update.value) {
        return;
    }

    const formData = new FormData(fomu.value);
    formData.append('name', updatename.value);
    formData.append('update_type', updateType.value);
    formData.append('content', update.value);

    console.log('Form submitted', {
        updatename: updatename.value,
        updateType: updateType.value,
        content: update.value,
    });

    if (product.value?.id) {
        apiService.put(`update/${product.value.id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Update updated successfully', life: 3000 });
                getFleet();
                productDialog.value = false;
                resetForm();
            })
            .catch(error => {
                console.error('Error updating update:', error);
                toast.add({ severity: 'error', summary: 'Error', detail: 'Error updating update', life: 3000 });
            });
    } else {
        apiService.post('update/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Update saved successfully', life: 3000 });
                getFleet();
                productDialog.value = false;
                resetForm();
            })
            .catch(error => {
                console.error('Error saving update:', error);
                toast.add({ severity: 'error', summary: 'Error', detail: 'Error saving update', life: 3000 });
            });
    }
};

const resetForm = () => {
    updatename.value = '';
    updateType.value = null;
    update.value = '';
    if (files.value) {
        files.value.value = ''; // Clear file input
    }
    submitted.value = false;
    product.value = {};
};

onBeforeMount(() => {
    initFilters();
    getCategories();
    getFleet();
});

const openNew = () => {
    resetForm();
    submitted.value = false;
    productDialog.value = true;
};

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
    resetForm();
};

const editProduct = (editProduct) => {
    product.value = { ...editProduct };
    updatename.value = editProduct.name;
    updateType.value = editProduct.update_type;
    update.value = editProduct.content;
    productDialog.value = true;
};

const confirmDeleteProduct = (productToDelete) => {
    product.value = productToDelete;
    deleteProductDialog.value = true;
};

const deleteProduct = () => {
    apiService.delete(`fleet/${product.value.id}`)
        .then(response => {
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
            getFleet();
            deleteProductDialog.value = false;
        })
        .catch(error => {
            console.error('Error deleting product:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error deleting product', life: 3000 });
        });
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};

const deleteSelectedProducts = () => {
    selectedProducts.value.forEach(product => {
        apiService.delete(`fleet/${product.id}`)
            .catch(error => {
                console.error('Error deleting product:', error);
            });
    });

    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    getFleet();
    deleteProductsDialog.value = false;
    selectedProducts.value = [];
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const approveVehicle = (slug) => {
    apiService.patch(`/update/${slug}/approve/`)
        .then(response => {
            console.log('Vehicle approved successfully:', response.data);
            getFleet(); // Refresh the fleet after approval
        })
        .catch(error => {
            console.error('Error approving vehicle:', error);
        });
};
</script>

<style scoped>
.field {
    margin-bottom: 1.5rem;
}

.field label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
}

.p-fluid .field {
    width: 100%;
}

.mt-3 {
    margin-top: 1rem;
}

.mt-4 {
    margin-top: 1.5rem;
}

button.mr-2,
button.ml-2 {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
}

button.pi.pi-times,
button.pi.pi-check {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
}

.bg-green-50 {
    background-color: #f0fdf4;
}

.border-green-300 {
    border-color: #d1fae5;
}

.text-gray-900 {
    color: #1f2937;
}

.text-sm {
    font-size: 0.875rem;
}

.rounded-lg {
    border-radius: 0.5rem;
}

.focus\:ring-green-500:focus {
    ring-color: #10b981;
}

.focus\:border-green-500:focus {
    border-color: #10b981;
}

.block {
    display: block;
}

.p-2.5 {
    padding: 0.625rem;
}

.dark\:bg-gray-700 {
    background-color: #374151;
}

.dark\:border-gray-600 {
    border-color: #4b5563;
}

.dark\:placeholder-gray-400::placeholder {
    color: #9ca3af;
}

.dark\:text-white {
    color: #fff;
}

.dark\:focus\:ring-green-500:focus {
    ring-color: #10b981;
}

.dark\:focus\:border-green-500:focus {
    border-color: #10b981;
}

.dropdown-full-width .p-dropdown {
    width: 100%;
}

.dropdown-full-width .p-dropdown-label {
    white-space: normal !important;
}

.editor-full-width .p-editor {
    width: 100%;
}

.editor-full-width .p-editor-container {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.editor-full-width .p-editor-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.editor-full-width .p-editor-toolbar {
    flex: 0 0 auto;
}

.editor-full-width .p-editor-editable {
    flex: 1;
    overflow: auto;
}
</style>
 