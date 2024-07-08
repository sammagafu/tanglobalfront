<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/store/authStore'; // Import your auth store
import apiService from '@/services/apiService'; // Import your API service

const toast = useToast();

const fleet = ref([]);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref([]);
const dt = ref(null);
const filters = ref({});

const fleetype = ref([]);

// form fields
const fomu = ref(null)
const platenumber = ref('');
const weight = ref(null);
const selectedFleetType = ref(null);
const isInsured = ref(null);
const submitted = ref(false);
const files = ref(null);

const getSeverity = (product) => {
    switch (product.inventoryStatus) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warning';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
}


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
    apiService.get('fleet/type')
        .then(response => {
            fleetype.value = response.data;
        })
        .catch(error => {
            console.log(error);
        });
};

const getFleet = () => {
    apiService.get('fleet/')
        .then(response => {
            fleet.value = response.data;
            console.log(fleet.value);
        })
        .catch(error => {
            console.log(error);
        });
};

const saveFleet = () => {
    submitted.value = true;
    if (!platenumber.value || !weight.value || !selectedFleetType.value) {
        return;
    }

    const formData = new FormData(fomu.value);
    formData.append('platenumber', platenumber.value);
    formData.append('capacity', weight.value);
    formData.append('vehicleTypes', selectedFleetType.value);
    formData.append('isInsured', isInsured.value);

    for (let i = 0; i < files.value.files.length; i++) {
        formData.append('images', files.value.files[i]);
    }

    console.log('Form submitted', {
        platenumber: platenumber.value,
        weight: weight.value,
        selectedFleetType: selectedFleetType.value,
        isInsured: isInsured.value,
        files: files.value.files
    });


    apiService.post('fleet/', formData, {
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

const onUpload = (event) => {
    console.log('Files selected:', event.target.files);
    files.value = event.target;
};

const resetForm = () => {
    platenumber.value = '';
    weight.value = null;
    selectedFleetType.value = null;
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
                                                <span class="font-medium text-secondary text-sm">Car Plate Number</span>
                                                <div class="text-lg font-medium text-900 mt-2">{{ item.platenumber }}</div>
                                                <div class="text-lg font-medium text-900">Carrying Capacity{{ item.capacity }} Tons</div>
                                                
                                            </div>
                                        </div>
                                        <div class="flex flex-column md:align-items-end gap-5">
                                            <!-- <span class="text-xl font-semibold text-900">Carrying Capacity{{ item.capacity }} Tons</span> -->
                                            <div class="flex flex-row-reverse md:flex-row gap-2">
                                                <router-link :to="{name:'fleet-detail',params : {fleetnumber:item.id}}"><Button icon="pi pi-search" outlined></Button></router-link>
                                                <!-- <Button icon="pi pi-shopping-cart" label="Buy Now"
                                                    :disabled="item.inventoryStatus === 'OUTOFSTOCK'"
                                                    class="flex-auto md:flex-initial white-space-nowrap"></Button> -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </DataView>

                <Dialog v-model:visible="productDialog" :style="{ width: '650px' }" header="Create Cargo" :modal="true"
                    class="p-fluid">
                    <form @submit.prevent="saveFleet" ref="fomu">
                        <div class="field">
                            <label for="platenumber">Fleet Plate Number</label>
                            <InputText id="platenumber" v-model.trim="platenumber" required autofocus
                                :class="{ 'p-invalid': submitted && !platenumber }" placeholder="T123DZB"
                                name="platenumber" />
                            <small class="p-invalid" v-if="submitted && !platenumber">Fleet plate number is
                                required.</small>
                        </div>
                        <div class="field">
                            <label for="capacity">Carrying Capacity</label>
                            <InputNumber id="capacity" v-model.number="weight" required
                                :class="{ 'p-invalid': submitted && !weight }" placeholder="13" name="capacity" />
                            <small class="p-invalid" v-if="submitted && !weight">Carrying capacity is required.</small>
                        </div>

                        <div class="field">
                            <label for="vehicleType">Fleet Type</label>
                            <Dropdown id="vehicleType" v-model="selectedFleetType" :options="fleetype"
                                optionLabel="name" name="vehicleType" placeholder="Select Fleet Type"
                                optionValue="id" />
                        </div>

                        <div class="field">
                            <label class="mb-3">Is Insured?</label>
                            <div class="formgrid grid">
                                <div class="field-radiobutton col-6">
                                    <RadioButton id="category1" name="isInsuared" value="true" v-model="isInsured" />
                                    <label for="category1" class="p-2">Yes</label>
                                </div>
                                <div class="field-radiobutton col-6">
                                    <RadioButton id="category2" name="isInsured" value="false" v-model="isInsured" />
                                    <label for="category2" class="p-2">No</label>
                                </div>
                            </div>
                        </div>

                        <div class="field">
                            <div class="flex items-center justify-center w-full">
                                <label for="dropzone-file"
                                    class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                    <div class="pt-5 pb-6 mx-auto text-center">
                                        <svg class="w-2 h-2 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                        </svg>
                                        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span class="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX.
                                            800x400px)</p>
                                    </div>
                                    <input id="dropzone-file" ref="files" type="file" class="hidden" name="images"
                                        @change="onUpload" multiple />
                                </label>
                            </div>
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
