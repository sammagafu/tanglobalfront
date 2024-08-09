<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/store/authStore';
import apiService from '@/services/apiService';

const toast = useToast();
const authStore = useAuthStore();
const fleet = ref([]);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref([]);
const dt = ref(null);
const filters = ref({});
const fleetype = ref([]);

// Form fields
const platenumber = ref('');
const weight = ref(null);
const selectedFleetType = ref(null);
const isInsured = ref(null);
const submitted = ref(false);
const files = ref(null);
const company = ref(null);
const vehicleType = ref(null);
const capacity = ref(null);
const isApproved = ref(false);
const approvedBy = ref(null);
const manufactureYear = ref(null);
const lastServiceDate = ref(null);
const registrationDate = ref(null);
const color = ref('');
const model = ref('');
const make = ref('');

const getSeverity = (status) => {
    switch (status) {
        case 'INSTOCK':
            return 'success';
        case 'LOWSTOCK':
            return 'warning';
        case 'OUTOFSTOCK':
            return 'danger';
        default:
            return null;
    }
};

const getCategories = async () => {
    try {
        const response = await apiService.get('fleet/type');
        fleetype.value = response.data;
    } catch (error) {
        console.error('Error fetching fleet types:', error);
    }
};

const getFleet = async () => {
    try {
        const response = await apiService.get('fleet/my-vehicles/');
        fleet.value = response.data;
    } catch (error) {
        console.error('Error fetching fleet:', error);
    }
};

const saveFleet = async () => {
    submitted.value = true;
    if (!platenumber.value || !weight.value || !selectedFleetType.value) {
        return;
    }

    const formData = new FormData();
    formData.append('plate_number', platenumber.value);
    formData.append('capacity', weight.value);
    formData.append('vehicle_type', selectedFleetType.value);
    formData.append('isInsured', isInsured.value);
    formData.append('company', company.value);
    formData.append('vehicleType', vehicleType.value);
    formData.append('isApproved', isApproved.value);
    formData.append('manufactureYear', manufactureYear.value);
    formData.append('lastServiceDate', lastServiceDate.value);
    formData.append('registrationDate', registrationDate.value);
    formData.append('color', color.value);
    formData.append('model', model.value);
    formData.append('make', make.value);

    if (files.value && files.value.files.length > 0) {
        for (let i = 0; i < files.value.files.length; i++) {
            formData.append('images', files.value.files[i]);
        }
    }

    try {
        await apiService.post('fleet/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Fleet saved successfully', life: 3000 });
        getFleet();
        productDialog.value = false;
        resetForm();
    } catch (error) {
        console.error('Error saving fleet:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error saving fleet', life: 3000 });
    }
};

const onUpload = (event) => {
    files.value = event.target;
};

const resetForm = () => {
    platenumber.value = '';
    weight.value = null;
    selectedFleetType.value = null;
    isInsured.value = null;
    company.value = null;
    vehicleType.value = null;
    capacity.value = null;
    isApproved.value = null;
    approvedBy.value = null;
    manufactureYear.value = null;
    lastServiceDate.value = null;
    registrationDate.value = null;
    color.value = '';
    model.value = '';
    make.value = '';
    if (files.value) {
        files.value.value = '';
    }
    submitted.value = false;
};

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

const deleteProduct = async () => {
    try {
        await apiService.delete(`fleet/${product.value.id}`);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        getFleet();
        deleteProductDialog.value = false;
    } catch (error) {
        console.error('Error deleting product:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error deleting product', life: 3000 });
    }
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};

const deleteSelectedProducts = async () => {
    try {
        for (let product of selectedProducts.value) {
            await apiService.delete(`fleet/${product.id}`);
        }
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        getFleet();
        deleteProductsDialog.value = false;
        selectedProducts.value = [];
    } catch (error) {
        console.error('Error deleting selected products:', error);
    }
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };
};

onBeforeMount(() => {
    initFilters();
    getCategories();
    getFleet();
    console.log(authStore.user.company_details);
});
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
                            placeholder="Sort By" @change="onSortChange($event)" />
                    </template>
                    <template #list="slotProps">
                        <div class="grid grid-nogutter">
                            <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                                <div class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3"
                                    :class="{ 'border-top-1 surface-border': index !== 0 }">
                                    
                                    <div class="md:w-40 relative">
                                        <img
                                            v-if="item.images && item.images.length > 0"
                                            :src="item.images[0].image" 
                                            class="block xl:block mx-auto rounded w-full"
                                            :alt="item.platenumber"
                                        />
                                        <img
                                            v-else
                                            src="https://via.placeholder.com/300"
                                            class="block xl:block mx-auto rounded w-full"
                                            alt="No Image Available"
                                        />
                                    </div>

                                    <div class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-4">
                                        <div class="flex flex-row md:flex-column justify-content-between align-items-start gap-2">
                                            <div>
                                                <span class="font-medium text-secondary text-sm">Car Plate Number</span>
                                                <div class="text-lg font-medium text-900 mt-2">{{ item.platenumber }}</div>
                                                <div class="text-lg font-medium text-900">Carrying Capacity: {{ item.capacity }} Tons</div>
                                            </div>
                                        </div>
                                        <div class="flex flex-column md:align-items-end gap-5">
                                            <div class="flex flex-row-reverse md:flex-row gap-2">
                                                <router-link :to="{name:'fleet-detail', params: {fleetnumber: item.id}}">
                                                    <Button icon="pi pi-search" outlined></Button>
                                                </router-link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </DataView>

                <Dialog v-model:visible="productDialog" :style="{ width: '650px' }" header="Create Fleet" :modal="true"
                    class="p-fluid">
                    <form @submit.prevent="saveFleet" ref="fomu">
                        <div class="field">
                            <label for="platenumber">Fleet Plate Number</label>
                            <InputText id="platenumber" v-model.trim="platenumber" required autofocus
                                :class="{ 'p-invalid': submitted && !platenumber }" placeholder="T123DZB" />
                            <small class="p-invalid" v-if="submitted && !platenumber">Fleet plate number is required.</small>
                        </div>
                        <div class="field">
                            <label for="capacity">Carrying Capacity</label>
                            <InputNumber id="capacity" v-model.number="weight" required
                                :class="{ 'p-invalid': submitted && !weight }" placeholder="13" />
                            <small class="p-invalid" v-if="submitted && !weight">Carrying capacity is required.</small>
                        </div>
                        <div class="field">
                            <label for="vehicleType">Fleet Type</label>
                            <Dropdown id="vehicleType" v-model="selectedFleetType" :options="fleetype"
                                optionLabel="name" placeholder="Select Fleet Type" />
                        </div>
                        <div class="field">
                            <label class="mb-3">Is Insured?</label>
                            <div class="formgrid grid">
                                <div class="field-radiobutton col-6">
                                    <RadioButton id="insuredYes" name="isInsured" value="true" v-model="isInsured" />
                                    <label for="insuredYes" class="p-2">Yes</label>
                                </div>
                                <div class="field-radiobutton col-6">
                                    <RadioButton id="insuredNo" name="isInsured" value="false" v-model="isInsured" />
                                    <label for="insuredNo" class="p-2">No</label>
                                </div>
                            </div>
                        </div>
                        <div class="field" v-if="authStore.user.company_details">
                            <label for="company">Company</label>
                            <InputText id="company" v-model.trim="company" placeholder="Company" />
                        </div>
                        <div class="field">
                            <label for="manufactureYear">Manufacture Year</label>
                            <InputNumber id="manufactureYear" v-model.number="manufactureYear" placeholder="Manufacture Year" />
                        </div>
                        <div class="field">
                            <label for="lastServiceDate">Last Service Date</label>
                            <InputText id="lastServiceDate" v-model="lastServiceDate" placeholder="Last Service Date" />
                        </div>
                        <div class="field">
                            <label for="registrationDate">Registration Date</label>
                            <InputText id="registrationDate" v-model="registrationDate" placeholder="Registration Date" />
                        </div>
                        <div class="field">
                            <label for="color">Color</label>
                            <InputText id="color" v-model.trim="color" placeholder="Color" />
                        </div>
                        <div class="field">
                            <label for="model">Model</label>
                            <InputText id="model" v-model.trim="model" placeholder="Model" />
                        </div>
                        <div class="field">
                            <label for="make">Make</label>
                            <InputText id="make" v-model.trim="make" placeholder="Make" />
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
                                    <input id="dropzone-file" ref="files" type="file" class="hidden" @change="onUpload" multiple />
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
                        <span v-if="product">Are you sure you want to delete <b>{{ product.platenumber }}</b>?</span>
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
