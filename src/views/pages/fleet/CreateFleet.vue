<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { ProductService } from '@/services/ProductService';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/store/authStore'; // Import your auth store
import apiService from '@/services/apiService'; // Import your API service
const toast = useToast();

const products = ref(null);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const cargotype = ref({})
const selectedCargoType = ref()

// form fields
const cargoname = ref()
const weight = ref()
const dimensions = ref()
const flagile = ref(false)
const tempsensitive = ref(false)
const handlingInstruction = ref()
const origin = ref()
const destination = ref()
const receiverName = ref()
const receiverContact = ref()
const cargoDocumentName = ref()
const cargoDocument = ref()
const pickupdate = ref()
const deliveryDate = ref()


// method to get all categories
const getCategories = function () {
	apiService.get('cargo/type')
		.then(async (response) => {
			console.log(response.data);
			cargotype.value = await response.data;
		})
		.catch(error => {
			console.log(error);
		});
};

const statuses = ref([
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' }
]);

const productService = new ProductService();

const getBadgeSeverity = (inventoryStatus) => {
    switch (inventoryStatus.toLowerCase()) {
        case 'instock':
            return 'success';
        case 'lowstock':
            return 'warning';
        case 'outofstock':
            return 'danger';
        default:
            return 'info';
    }
};

onBeforeMount(() => {
    initFilters();
    getCategories();
    
});
onMounted(() => {
    productService.getProducts().then((data) => (products.value = data));
});
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

const saveProduct = () => {
    if (cargoname.value && cargoname.value.trim() && weight.value && cargoDocument.value) {
        const formData = new FormData();
        formData.append('name', cargoname.value);
        formData.append('weight', weight.value);
        formData.append('dimensions', dimensions.value);
        formData.append('flagile', flagile.value);
        formData.append('tempsensitive', tempsensitive.value);
        formData.append('handlingInstruction', handlingInstruction.value);
        formData.append('origin', origin.value);
        formData.append('destination', destination.value);
        formData.append('receiverName', receiverName.value);
        formData.append('receiverContact', receiverContact.value);
        // formData.append('cargoDocumentName', cargoDocumentName.value);
        // formData.append('cargoDocument', cargoDocument.value);
        formData.append('pickupdate', pickupdate.value);
        formData.append('deliveryDate', deliveryDate.value);
        formData.append('cargoType', selectedCargoType.value);

    //     if (cargoDocument.value) {
    //     formData.append('file', cargoDocument.value);
    //   }

        // Log formData to ensure all data is included
        // console.log("Form Data:", formData);

        // axios.post('http://localhost:8000/api/v1/cargo/', formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     }
        // })
        // .then(response => {
        //     console.log('Cargo data posted successfully:', response.data);
        //     toast.add({ severity: 'success', summary: 'Successful', detail: 'Cargo data posted successfully', life: 3000 });
        // })
        // .catch(error => {
        //     console.error('Error posting cargo data:', error);
        //     toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to post cargo data', life: 3000 });
        // });
        // Optionally, you can reset form fields or close dialog after posting data


        apiService.post('cargo/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        toast.add({ severity: 'success', summary: 'Success', detail: 'Form submitted successfully' });
        // Reset form fields after successful submission if needed
        name.value = '';
        weight.value = 0;
        file.value = null;
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to submit form' });
      });


        productDialog.value = false;
        cargoname.value = '';
        weight.value = '';
        dimensions.value = '';
        flagile.value = false;
        tempsensitive.value = false;
        handlingInstruction.value = '';
        origin.value = '';
        destination.value = '';
        receiverName.value = '';
        receiverContact.value = '';
        cargoDocumentName.value = '';
        cargoDocument.value = '';
        pickupdate.value = '';
        deliveryDate.value = '';
        selectedCargoType.value = null;
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields and upload cargo document', life: 3000 });
    }
};



const onUpload = (event) => {
    cargoDocument.value = event.target.files[0]; 
};


const editProduct = (editProduct) => {
    product.value = { ...editProduct };
    productDialog.value = true;
};

const confirmDeleteProduct = (editProduct) => {
    product.value = editProduct;
    deleteProductDialog.value = true;
};

const deleteProduct = () => {
    products.value = products.value.filter((val) => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
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
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
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
                            <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="products"
                    v-model:selection="selectedProducts"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Fleet</h5>
                            <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                <InputIcon class="pi pi-search" />
                                <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Search..." />
                            </IconField>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="code" header="Code" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Code</span>
                            {{ slotProps.data.code }}
                        </template>
                    </Column>
                    <Column field="name" header="Name" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Name</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column header="Image" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Image</span>
                            <img :src="'/demo/images/product/' + slotProps.data.image" :alt="slotProps.data.image" class="shadow-2" width="100" />
                        </template>
                    </Column>
                    <Column field="price" header="Price" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Price</span>
                            {{ formatCurrency(slotProps.data.price) }}
                        </template>
                    </Column>
                    <Column field="category" header="Category" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Category</span>
                            {{ slotProps.data.category }}
                        </template>
                    </Column>
                    <Column field="rating" header="Reviews" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Rating</span>
                            <Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" />
                        </template>
                    </Column>
                    <Column field="inventoryStatus" header="Status" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Tag :severity="getBadgeSeverity(slotProps.data.inventoryStatus)">{{ slotProps.data.inventoryStatus }}</Tag>
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editProduct(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="productDialog" :style="{ width: '650px' }" header="Create Cargo" :modal="true" class="p-fluid">
                    <form @submit.prevent="saveProduct">
                    <div class="field">
                        <label for="name">Cargo Name</label>
                        <InputText id="name" v-model.trim="cargoname" required="true" autofocus :invalid="submitted && !cargoname" placeholder="13Tons of Coal " />
                        <small class="p-invalid" v-if="submitted && !cargoname">Cargo name is required.</small>
                    </div>
                    <div class="field">
                        <label for="name">Cargo Weight in Tons</label>
                        <InputNumber id="name" v-model.trim="weight" required="true" autofocus :invalid="submitted && !weight" placeholder="13 " />
                        <small class="p-invalid" v-if="submitted && !weight">Cargo weight is required.</small>
                    </div>

                    <div class="field">
                        <label for="name">Cargo Dimensions in Metres</label>
                        <InputText id="name" v-model.trim="dimensions" required="true" autofocus :invalid="submitted && !dimensions" placeholder="110x5x3 meters" />
                        <small class="p-invalid" v-if="submitted && !dimensions">Name is required.</small>
                    </div>

                    <div class="field">
                        <label for="inventoryStatus" class="mb-3">Cargo Type</label>
                        <!-- <Dropdown id="inventoryStatus" v-model="selectedCargoType" :options="cargotype" optionLabel="label" placeholder="Select a Status">
                            
                        </Dropdown> -->
                        <Dropdown v-model="selectedCargoType" :options="cargotype" filter optionLabel="name" 
                            placeholder="Select Cargo Type">
                            <template #value="slotProps">
                                <div v-if="slotProps.name && slotProps.name.value">
                                    <span :class="'product-badge status-' + slotProps.name.value">{{ slotProps.name.label }}</span>
                                </div>
                                <div v-else-if="slotProps.name && !slotProps.name.value">
                                    <span :class="'product-badge status-' + slotProps.name.toLowerCase()">{{ slotProps.name }}</span>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                        </Dropdown>
                    </div>

                    <div class="formgrid grid">
                        <div class="field col">
                        <label class="mb-3">Is the Cargo Fragile ?</label>
                        <div class="formgrid grid">
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category1" name="category" value="Accessories" v-model="flagile" />
                                <label for="category1">Yes</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category2" name="category" value="Clothing" v-model="flagile" />
                                <label for="category2">No</label>
                            </div>
                        </div>
                    </div>

                    <div class="field col">
                        <label class="mb-3">Is the Cargo Temperature Sensitve ?</label>
                        <div class="formgrid grid">
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category1" name="category" value="Accessories" v-model="tempsensitive" />
                                <label for="category1">Yes</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category2" name="category" value="Clothing" v-model="tempsensitive" />
                                <label for="category2">No</label>
                            </div>
                        </div>
                    </div>
                    </div>

                    <div class="field">
                        <label for="description">Special Handling Instruction</label>
                        <Textarea id="description" v-model="handlingInstruction" required="true" rows="3" cols="20" />
                    </div>

                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="pickup">Origin / Pickup Location</label>
                            <InputText id="pickup" v-model="origin" mode="currency" locale="en-US" :invalid="submitted && !origin" :required="true" />
                            <small class="p-invalid" v-if="submitted && !origin">Pickup Location is required.</small>
                        </div>
                        <div class="field col">
                            <label for="destination">Destination or Drop Point</label>
                            <InputText id="destination" v-model="destination" integeronly :invalid="submitted && !destination"/>
                            <small class="p-invalid" v-if="submitted && !destination">Destination Location is required.</small>

                        </div>
                    </div>

                    
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="receiver">Receiver's Name</label>
                            <InputText id="receiver" v-model="receiverName" mode="currency" currency="USD" locale="en-US" :invalid="submitted && !receiverName" :required="true" />
                            <small class="p-invalid" v-if="submitted && !receiverName">Receiver is required.</small>
                        </div>
                        <div class="field col">
                            <label for="quantity">Receiver's Contact Address</label>
                            <InputText id="quantity" v-model="receiverContact" integeronly :invalid="submitted && !receiverContact" :required="true"/>
                            <small class="p-invalid" v-if="submitted && !receiverContact">Receiver is required.</small>

                        </div>
                    </div>

                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="price">Document Name</label>
                            <InputText id="price" v-model="cargoDocumentName" mode="currency" currency="USD" locale="en-US" :invalid="submitted && !cargoDocumentName" :required="true" />
                            <small class="p-invalid" v-if="submitted && !cargoDocumentName">Document name is required.</small>
                        </div>
                        <div class="field col">
                            <label for="quantity">&nbsp;</label>
                            <FileUpload mode="basic" name="cargoDocument" :maxFileSize="1000000" chooseLabel="Browse Document"  v-model="cargoDocument" @upload="onUpload"/>
                        </div>
                        
                    </div>
                    <Button label="Cancel" icon="pi pi-times" text="" @click="hideDialog" />
                    <Button label="Save" icon="pi pi-check" type="submit" />
                </form>
                   
                </Dialog>

                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product"
                            >Are you sure you want to delete <b>{{ product.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">Are you sure you want to delete the selected products?</span>
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
