<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/store/authStore'; // Import your auth store
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
const fomu = ref(null)
const updatename = ref('');
const weight = ref(null);
const updateType = ref(null);
const update = ref('')
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
    }
    else {
        sortOrder.value = 1;
        sortField.value = value;
        sortKey.value = sortValue;
    }
};


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
    if (!updatename.value || !updateType.value || !updateType.value) {
        return;
    }

    const formData = new FormData(fomu.value);
    formData.append('name', updatename.value);
    formData.append('update_type', updateType.value);
    formData.append('content', update.value);

    console.log('Form submitted', {
        'updatename': updatename.value,
        'updateType': updateType.value,
        'content': update.value,
    });


    apiService.post('update/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(response => {
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Fleet saved successfully', life: 3000 });
            getFleet();
            productDialog.value = false;
            resetForm();
        })
        .catch(error => {
            console.error('Error saving fleet:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error saving fleet', life: 3000 });
        });
};

const resetForm = () => {
    platenumber.value = '';
    weight.value = null;
    updateType.value = null;
    isInsured.value = null;
    if (files.value) {
        files.value.value = ''; // Clear file input
    }
    submitted.value = false;
};

onBeforeMount(() => {
    initFilters();
    getCategories();
    getFleet();
});

// const formatCurrency = (value) => {
//     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
// };

const openNew = () => {
    product.value = {};
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

const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
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
</script>


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
                                                <span class="font-medium text-secondary text-sm">{{ item.name }}</span>
                                                <div class="text-lg font-medium text-900 mt-2">{{ item.content }}</div>
                                                
                                            </div>
                                        </div>
                                        <div class="flex flex-column md:align-items-end gap-5">
                                            <!-- <span class="text-xl font-semibold text-900">Carrying Capacity{{ item.capacity }} Tons</span> -->
                                            <div class="flex flex-row-reverse md:flex-row gap-2">
                                                <Button icon="pi pi-search" outlined></Button>
                                                <Button icon="pi pi-shopping-cart" label="Approve Update"
                                                    class="flex-auto md:flex-initial white-space-nowrap"></Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </DataView>

                <Dialog v-model:visible="productDialog" :style="{ width: '850px' }" header="Create Cargo" :modal="true"
                    class="p-fluid">
                    <form @submit.prevent="saveUpdate" ref="fomu">
                        <div class="field">
                            <label for="Update name">Update Name</label>
                            <InputText id="updatename" v-model.trim="updatename" required autofocus
                                :class="{ 'p-invalid': submitted && !platenumber }" placeholder="Enter Update Name"
                                name="updatename" />
                            <small class="p-invalid" v-if="submitted && !updatename">Update Name is Required.</small>
                        </div>
                        <div class="field">
                            <label for="updatetype">Update Type</label>
                            <Dropdown id="updatetype" v-model="updateType" :options="updatetype"
                                optionLabel="name" name="updatetype" placeholder="Select Update Type"
                                optionValue="id" />
                        </div>

                        <div class="field">
                            <label for="update">Update Details</label>
                            <Editor v-model="update" editorStyle="height: 240px" />
                            <small class="p-invalid" v-if="submitted && !update">Updte is required.</small>
                        </div>

                        <div class="mt-3">
                            <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" class="mr-2" />
                            <Button label="Save" icon="pi pi-check" type="submit" class="ml-2" />
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
