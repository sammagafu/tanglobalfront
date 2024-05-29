<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
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
const fomu = ref(null)
const cargotype = ref({})
const companyCargo = ref([])

// form fields
// Define ref variables for form fields
// Define reactive variables for form fields
const cargoname = ref('');
const weight = ref('');
const dimensions = ref('');
const selectedCargoType = ref('');
const flagile = ref(false);
const temperatureSensitive = ref(false);
const handlingInstruction = ref('');
const origin = ref('');
const destination = ref('');
const receiverName = ref('');
const receiverContact = ref('');
const cargoDocuments = ref([{ documentName: '', documentFile: null }]);


// Method to add image
const addCargoDocument = () => {
    cargoDocuments.value.push({ documentName: '', documentFile: null });
    console.log(cargoDocuments.value);
};


// Method to remove cargo
const removeCargoDocument = (index) => {
    cargoDocuments.value.splice(index, 1);
};




const saveCargo = async () => {
    try {
        const formData = new FormData(fomu.value);
        // formData.append('cargoname', cargoname.value);
        // formData.append('weight', weight.value);
        // formData.append('dimensions', dimensions.value);
        // formData.append('selectedCargoType', selectedCargoType.value);
        // formData.append('flagile', flagile.value);
        // formData.append('temperatureSensitive', temperatureSensitive.value);
        // formData.append('handlingInstruction', handlingInstruction.value);
        // formData.append('origin', origin.value);
        // formData.append('destination', destination.value);
        // formData.append('receiver_name', receiverName.value);
        // formData.append('receiver_contact', receiverContact.value);
        // formData.append('cargoDocumentName', cargoDocumentName.value);
        // formData.append('cargoDocument', cargoDocument.value);

        cargoDocuments.value.forEach((document, index) => {
            formData.append(`cargo_documents[${index}][name]`, document.name);
            formData.append(`cargo_documents[${index}][file]`, document.file);
        });

        const response = await apiService.post('cargo/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.status === 200||201) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Cargo saved successfully' });
            resetForm();
            hideDialog();
        } else {
            console.error('Failed to save cargo');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const resetForm = () => {
  cargoname.value = '';
  weight.value = '';
  dimensions.value = '';
  selectedCargoType.value = '';
  flagile.value = false;
  temperatureSensitive.value = false;
  handlingInstruction.value = '';
  origin.value = '';
  destination.value = '';
  receiverName.value = '';
  receiverContact.value = '';
  cargoDocuments.value = [{ documentName: '', documentFile: null }];
};


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

const getCompanyCargo = function () {
    apiService.get('cargo/')
        .then(async (response) => {
            console.log(response.data);
            companyCargo.value = await response.data;
        })
        .catch(error => {
            console.log(error);
        });
};



onBeforeMount(() => {
    initFilters();
    getCategories();
    getCompanyCargo();

});

const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};



const editProduct = (editProduct) => {
    cargoname.value = editProduct.cargo;
    weight.value = editProduct.weight;
    dimensions.value = editProduct.dimensions;
    // selectedCargoType.value = editProduct.cargo_type.id.toString(); // Assuming cargo_type.id is a string
    flagile.value = editProduct.fragile.toString(); // Assuming fragile is a string
    temperatureSensitive.value = editProduct.temperature_sensitive.toString(); // Assuming temperature_sensitive is a string
    handlingInstruction.value = editProduct.handling_instruction;
    origin.value = editProduct.origin;
    destination.value = editProduct.destination;
    receiverName.value = editProduct.receiver_name;
    receiverContact.value = editProduct.receiver_contact;
    cargoDocuments.value = editProduct.cargo_document_name;
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
                            <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected"
                                :disabled="!selectedProducts || !selectedProducts.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import"
                            chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable ref="dt" :value="companyCargo" paginator :rows="10">

                    <!-- <Column selectionMode="multiple" headerStyle="width: 3rem"></Column> -->
                    <Column field="cargo" header="Code" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                    </Column>
                    <Column field="dimensions" header="Dimensions (m)" :sortable="true"
                        headerStyle="width:14%; min-width:10rem;">
                    </Column>
                    <Column field="fragile" header="Flagile" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Tag :severity="slotProps.fragile">{{ slotProps.data.fragile }}</Tag>
                        </template>
                    </Column>
                    <Column field="temperature_sensitive" header="Sensintive" :sortable="true"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Tag :severity="slotProps.temperature_sensitive">{{ slotProps.data.temperature_sensitive}}</Tag>
                        </template>
                    </Column>

                    <Column field="cargo_type.name" header="Cargo Type" :sortable="true"
                        headerStyle="width:14%; min-width:10rem;">
                    </Column>
                    <Column field="origin" header="From" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                    </Column>
                    <Column field="destination" header="Destination" :sortable="true"
                        headerStyle="width:14%; min-width:10rem;">
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded
                                @click="editProduct(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded
                                @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>


                <Dialog v-model:visible="productDialog" :style="{ width: '650px' }" header="Create Cargo" :modal="true"
                    class="p-fluid">
                    <form @submit.prevent="saveCargo" ref="fomu">
                        <div class="field">
                            <label for="name">Cargo Name {{ cargoname }}</label>
                            <InputText id="name" name="cargo" v-model="cargoname" required="true" autofocus
                                :invalid="submitted && !cargoname" placeholder="13Tons of Coal " />
                            <small class="p-invalid" v-if="submitted && !cargoname">Cargo name is required.</small>
                        </div>
                        <div class="field">
                            <label for="name">Cargo Weight in Tons</label>
                            <InputText id="name" name="weight" v-model="weight" required="true" autofocus
                                :invalid="submitted && !weight" placeholder="13 " />
                            <small class="p-invalid" v-if="submitted && !weight">Cargo weight is required.</small>
                        </div>

                        <div class="field">
                            <label for="name">Cargo Dimensions in Metres</label>
                            <InputText id="name" name="dimensions" v-model="dimensions" required="true" autofocus
                                :invalid="submitted && !dimensions" placeholder="110x5x3 meters" />
                            <small class="p-invalid" v-if="submitted && !dimensions">Name is required.</small>
                        </div>

                        <div class="field">
                            <label for="inventoryStatus" class="mb-3">Cargo Type</label>
                            <Dropdown id="cargoType" v-model="selectedCargoType" :options="cargotype" optionLabel="name"
                                placeholder="Select Cargo Type" />
                        </div>

                        <div class="formgrid grid">
                            <div class="field col">
                                <label class="mb-3">Is the Cargo Fragile ?</label>
                                <div class="formgrid grid">
                                    <div class="field-radiobutton col-6">
                                        <RadioButton id="category1" name="flagile" value="true" v-model="flagile" />
                                        <label for="category1">Yes</label>
                                    </div>
                                    <div class="field-radiobutton col-6">
                                        <RadioButton id="category2" name="flagile" value="false" v-model="flagile" />
                                        <label for="category2">No</label>
                                    </div>
                                </div>
                            </div>

                            <div class="field col">
                                <label class="mb-3">Is the Cargo Temperature Sensitve ?</label>
                                <div class="formgrid grid">
                                    <div class="field-radiobutton col-6">
                                        <RadioButton id="category1" name="temperatureSensitive" value="true"
                                            v-model="temperatureSensitive" />
                                        <label for="category1">Yes</label>
                                    </div>
                                    <div class="field-radiobutton col-6">
                                        <RadioButton id="category2" name="temperatureSensitive" value="false"
                                            v-model="temperatureSensitive" />
                                        <label for="category2">No</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="field">
                            <label for="description">Special Handling Instruction</label>
                            <Textarea id="description" v-model="handlingInstruction" name="handlingInstruction"
                                required="true" rows="3" cols="20" />
                        </div>

                        <div class="formgrid grid">
                            <div class="field col">
                                <label for="pickup">Origin / Pickup Location</label>
                                <InputText id="pickup" name="origin" v-model="origin" :invalid="submitted && !origin"
                                    :required="true" />
                                <small class="p-invalid" v-if="submitted && !origin">Pickup Location is
                                    required.</small>
                            </div>
                            <div class="field col">
                                <label for="destination">Destination or Drop Point</label>
                                <InputText id="destination" name="destination" v-model="destination" integeronly
                                    :invalid="submitted && !destination" />
                                <small class="p-invalid" v-if="submitted && !destination">Destination Location is
                                    required.</small>

                            </div>
                        </div>


                        <div class="formgrid grid">
                            <div class="field col">
                                <label for="receiver">Receiver's Name</label>
                                <InputText id="receiver" v-model="receiverName" name="receiver_name"
                                    :invalid="submitted && !receiverName" :required="true" />
                                <small class="p-invalid" v-if="submitted && !receiverName">Receiver is required.</small>
                            </div>
                            <div class="field col">
                                <label for="quantity">Receiver's Contact Address</label>
                                <InputText id="quantity" v-model="receiverContact" name="receiver_contact" integeronly
                                    :invalid="submitted && !receiverContact" :required="true" />
                                <small class="p-invalid" v-if="submitted && !receiverContact">Receiver is
                                    required.</small>

                            </div>
                        </div>

                        <!-- Iterate over cargoDocuments array -->
                        <div class="p-fluid formgrid grid" v-for="(document, index) in cargoDocuments"
                            :key="index">
                            <div class="field col-12 md:col-6">
                                <!-- Bind input field to document name using v-model -->
                                <label :for="'supportDocumentName_' + index">Document {{ index + 1 }}</label>
                                <InputText name="document_name" :id="'supportDocumentName_' + index" type="text" v-model="document.name" />
                            </div>
                            <div class="field col-12 md:col-4">
                                <label :for="'supportDocumentFile_' + index">Document {{ index + 1 }}</label>
                                <FileUpload name="document_file" customUpload :id="'document_' + index" mode="basic" :accept="'.pdf,.jpg,.jpeg,.png,.doc,.docx'" @onSelect="addDocument($event, index)" />
                            </div>
                            <div class="field col-12 md:col-2">
                                <label>&nbsp;</label>
                                <div class="flex flex-row">
                                    <!-- If index is greater than 0, show remove button -->
                                    <Button v-if="index > 0" class="mr-1" severity="danger" rounded icon="pi pi-minus"
                                        @click="removeCargoDocument(index)" />
                                    <!-- If it's the last document or index is 0, show add button -->
                                    <Button v-if="index === cargoDocuments.length - 1 || index === 0" class="mr-1"
                                        severity="success" rounded icon="pi pi-plus" @click="addCargoDocument" />
                                </div>
                            </div>
                        </div>

                        <Button label="Cancel" icon="pi pi-times" text="" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" type="submit" />
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
            </div>
        </div>
    </div>
</template>
