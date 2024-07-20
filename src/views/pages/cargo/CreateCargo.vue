<template>
    <div class="m-4">
        <Toolbar class="mb-4">
            <template v-slot:start>
                <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="deleteSelectedCargos" :disabled="!selectedProducts.length" />
            </template>
            <template v-slot:end>
                <FileUpload mode="basic" accept="*" :maxFileSize="5000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" @upload="onDocumentUpload" />
                <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
            </template>
        </Toolbar>

        <DataTable ref="dt" :value="cargos" scrollable paginator :rows="10" v-model:selection="selectedProducts">
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="cargo" header="Cargo Name" :sortable="true" headerStyle="width:15%; min-width:10rem;"></Column>
            <Column field="weight" header="Weight" :sortable="true" headerStyle="width:10%; min-width:10rem;"></Column>
            <Column field="weight_unit" header="Weight Unit" :sortable="true" headerStyle="width:10%; min-width:10rem;"></Column>
            <Column field="length" header="Length" :sortable="true" headerStyle="width:10%; min-width:10rem;"></Column>
            <Column field="width" header="Width" :sortable="true" headerStyle="width:10%; min-width:10rem;"></Column>
            <Column field="height" header="Height" :sortable="true" headerStyle="width:10%; min-width:10rem;"></Column>
            <Column field="origin" header="Origin" :sortable="true" headerStyle="width:15%; min-width:10rem;"></Column>
            <Column field="destination" header="Destination" :sortable="true" headerStyle="width:15%; min-width:10rem;"></Column>
            <Column field="receiver_name" header="Receiver Name" :sortable="true" headerStyle="width:15%; min-width:10rem;"></Column>
            <Column field="receiver_contact" header="Receiver Contact" :sortable="true" headerStyle="width:15%; min-width:10rem;"></Column>
            <Column field="status" header="Status" :sortable="true" headerStyle="width:10%; min-width:10rem;"></Column>
            <Column field="actions" header="Actions" headerStyle="width:10%; min-width:10rem;">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editCargo(slotProps.data)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteCargo(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog :header="dialogHeader" v-model:visible="cargoDialog" :modal="true" :style="{ width: '60vw' }" :closable="false" @hide="hideDialog">
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveCargo" />
            </template>

            <form @submit.prevent="saveCargo">
                <div class="p-fluid">
                    <div class="py-2">
                        <label for="cargo">Cargo Name</label>
                        <InputText id="cargo" v-model="cargo.cargo" required :class="{'p-invalid': submitted && !cargo.cargo}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" />
                        <small v-if="submitted && !cargo.cargo" class="p-error">Cargo name is required.</small>
                    </div>
                    <div class="py-2">
                        <label for="weight">Weight</label>
                        <input type="number" name="weight" id="weight" v-model="cargo.weight" required :class="{'p-invalid': submitted && !cargo.weight}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500">
                        <small v-if="submitted && !cargo.weight" class="p-error">Weight is required.</small>
                    </div>
                    <div class="py-2">
                        <label for="weight_unit">Weight Unit</label>
                        <Dropdown id="weight_unit" v-model="cargo.weight_unit" :options="weightUnits" optionLabel="label" optionValue="value" required :class="{'p-invalid': submitted && !cargo.weight_unit}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"/>
                        <small v-if="submitted && !cargo.weight_unit" class="p-error">Weight unit is required.</small>
                    </div>
                    <div class="py-2">
                        <label for="length">Length</label>
                        <input type="number" name="length" id="length" v-model="cargo.length" required :class="{'p-invalid': submitted && !cargo.length}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500">
                        <small v-if="submitted && !cargo.length" class="p-error">Length is required.</small>
                    </div>
                    <div class="py-2">
                        <label for="width">Width</label>
                        <input type="number" name="width" id="width" v-model="cargo.width" required :class="{'p-invalid': submitted && !cargo.width}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500">
                        <small v-if="submitted && !cargo.width" class="p-error">Width is required.</small>
                    </div>
                    <div class="py-2">
                        <label for="height">Height</label>
                        <input type="number" name="height" id="height" v-model="cargo.height" required :class="{'p-invalid': submitted && !cargo.height}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500">
                        <small v-if="submitted && !cargo.height" class="p-error">Height is required.</small>
                    </div>
                    <div class="py-2">
                        <label for="cargo_type">Cargo Type</label>
                        <Dropdown id="cargo_type" v-model="cargo.cargo_type" :options="cargoTypeChoices" optionLabel="label" optionValue="value" required :class="{'p-invalid': submitted && !cargo.cargo_type}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"/>
                        <small v-if="submitted && !cargo.cargo_type" class="p-error">Cargo type is required.</small>
                    </div>
                    <div class="py-2">
                        <Checkbox inputId="fragile" v-model="cargo.fragile" />
                        <label for="fragile">Fragile</label>
                    </div>
                    <div class="py-2">
                        <Checkbox inputId="temperature_sensitive" v-model="cargo.temperature_sensitive" />
                        <label for="temperature_sensitive">Temperature Sensitive</label>
                    </div>
                    <div class="py-2">
                        <label for="special_handling_instructions">Special Handling Instructions</label>
                        <Textarea id="special_handling_instructions" v-model="cargo.special_handling_instructions" rows="3" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"/>
                    </div>
                    <div class="py-2">
                        <label for="origin">Origin</label>
                        <InputText id="origin" v-model="cargo.origin" required :class="{'p-invalid': submitted && !cargo.origin}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"/>
                        <small v-if="submitted && !cargo.origin" class="p-error">Origin is required.</small>
                    </div>
                    <div class="py-2">
                        <label for="destination">Destination</label>
                        <InputText id="destination" v-model="cargo.destination" required :class="{'p-invalid': submitted && !cargo.destination}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"/>
                        <small v-if="submitted && !cargo.destination" class="p-error">Destination is required.</small>
                    </div>
                    <div class="py-2">
                        <label for="receiver_name">Receiver Name</label>
                        <InputText id="receiver_name" v-model="cargo.receiver_name" required :class="{'p-invalid': submitted && !cargo.receiver_name}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"/>
                        <small v-if="submitted && !cargo.receiver_name" class="p-error">Receiver name is required.</small>
                    </div>
                    <div class="py-2">
                        <label for="receiver_contact">Receiver Contact</label>
                        <InputText id="receiver_contact" v-model="cargo.receiver_contact" required :class="{'p-invalid': submitted && !cargo.receiver_contact}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"/>
                        <small v-if="submitted && !cargo.receiver_contact" class="p-error">Receiver contact is required.</small>
                    </div>
                    <div class="py-2">
                        <label for="cargo_documents">Cargo Documents</label>
                        <input type="file" id="documents" multiple @change="handleFileUpload('documents', $event)" />
                        <ul>
                            <li v-for="(document, index) in cargo.cargo_documents" :key="index">
                                {{ document.file.name }}
                                <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text" @click="removeDocument(index)" />
                            </li>
                        </ul>
                        <small v-if="documentError" class="p-error">{{ documentError }}</small>
                    </div>
                    <div class="py-2">
                        <label for="images">Images</label>
                        <input type="file" id="images" multiple @change="handleFileUpload('images', $event)" />
                        <ul>
                            <li v-for="(image, index) in cargo.images" :key="index">
                                <img :src="image.file ? URL.createObjectURL(image.file) : image.image" alt="Cargo Image" width="100" />
                                <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text" @click="removeImage(index)" />
                            </li>
                        </ul>
                        <small v-if="imageError" class="p-error">{{ imageError }}</small>
                    </div>
                </div>
            </form>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import apiService from '@/services/apiService';

const cargos = ref([]);
const cargoTypes = ref([]);
const cargoDialog = ref(false);
const submitted = ref(false);
const cargo = ref({
    cargo: '',
    weight: null,
    weight_unit: 'kg',
    length: null,
    width: null,
    height: null,
    cargo_type: null,
    fragile: false,
    temperature_sensitive: false,
    special_handling_instructions: '',
    origin: '',
    destination: '',
    receiver_name: '',
    receiver_contact: '',
    cargo_documents: [],
    images: []
});
const selectedCargo = ref(null);
const selectedProducts = ref([]);
const toast = useToast();
const documentError = ref('');
const imageError = ref('');

const WEIGHT_UNIT_CHOICES = [
    { label: 'Kilograms', value: 'kg' },
    { label: 'Liters', value: 'ltr' },
];

const STATUS_CHOICES = [
    { label: 'Pending', value: 'pending' },
    { label: 'In Transit', value: 'in_transit' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Delayed', value: 'delayed' },
    { label: 'Cancelled', value: 'cancelled' },
];

const cargoTypeChoices = computed(() => cargoTypes.value.map(type => ({
    label: type.name,
    value: type.id
})));

const weightUnits = computed(() => WEIGHT_UNIT_CHOICES);

const statusOptions = computed(() => STATUS_CHOICES);

const getCargoTypes = () => {
    apiService.get('cargo/type/cargo/')
        .then(response => {
            cargoTypes.value = response.data;
        })
        .catch(error => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load cargo types', life: 3000 });
        });
};

const getCargos = () => {
    apiService.get('cargo/')
        .then(response => {
            cargos.value = response.data;
        })
        .catch(error => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load cargos', life: 3000 });
        });
};

const saveCargo = () => {
    submitted.value = true;

    if (!cargo.value.cargo || !cargo.value.weight || !cargo.value.weight_unit || !cargo.value.length || !cargo.value.width || !cargo.value.height || !cargo.value.origin || !cargo.value.destination || !cargo.value.receiver_name || !cargo.value.receiver_contact || !cargo.value.cargo_type || !cargo.value.status) {
        return;
    }

    const formData = new FormData();
    formData.append('cargo', cargo.value.cargo);
    formData.append('weight', cargo.value.weight);
    formData.append('weight_unit', cargo.value.weight_unit);
    formData.append('length', cargo.value.length);
    formData.append('width', cargo.value.width);
    formData.append('height', cargo.value.height);
    formData.append('cargo_type', cargo.value.cargo_type);
    formData.append('fragile', cargo.value.fragile ? 'true' : 'false');
    formData.append('temperature_sensitive', cargo.value.temperature_sensitive ? 'true' : 'false');
    formData.append('special_handling_instructions', cargo.value.special_handling_instructions);
    formData.append('origin', cargo.value.origin);
    formData.append('destination', cargo.value.destination);
    formData.append('receiver_name', cargo.value.receiver_name);
    formData.append('receiver_contact', cargo.value.receiver_contact);
    formData.append('status', cargo.value.status);

    cargo.value.cargo_documents.forEach((doc) => {
        formData.append('documents', doc.file);
    });

    cargo.value.images.forEach((img) => {
        formData.append('images', img.file);
    });

    if (selectedCargo.value) {
        apiService.put(`cargo/${selectedCargo.value.uuid}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                const index = cargos.value.findIndex(c => c.uuid === selectedCargo.value.uuid);
                cargos.value[index] = response.data;
                cargoDialog.value = false;
                resetForm();
                toast.add({ severity: 'success', summary: 'Success', detail: 'Cargo updated', life: 3000 });
            })
            .catch(error => {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update cargo', life: 3000 });
            });
    } else {
        apiService.post('cargo/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                cargos.value.push(response.data);
                cargoDialog.value = false;
                resetForm();
                toast.add({ severity: 'success', summary: 'Success', detail: 'Cargo created', life: 3000 });
            })
            .catch(error => {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create cargo', life: 3000 });
            });
    }
};

const editCargo = (cargo) => {
    selectedCargo.value = cargo;
    cargo.value = { ...cargo };
    cargoDialog.value = true;
};

const confirmDeleteCargo = (cargo) => {
    confirmDialog({
        message: 'Are you sure you want to delete this cargo?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => deleteCargo(cargo),
    });
};

const deleteCargo = (cargo) => {
    apiService.delete(`cargo/${cargo.uuid}/`)
        .then(() => {
            cargos.value = cargos.value.filter(c => c.uuid !== cargo.uuid);
            toast.add({ severity: 'success', summary: 'Success', detail: 'Cargo deleted', life: 3000 });
        })
        .catch(error => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete cargo', life: 3000 });
        });
};

const confirmDeleteSelected = () => {
    confirmDialog({
        message: 'Are you sure you want to delete the selected cargos?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: deleteSelectedCargos,
    });
};

const deleteSelectedCargos = () => {
    const ids = selectedProducts.value.map(product => product.uuid);
    Promise.all(ids.map(id => apiService.delete(`cargo/${id}/`)))
        .then(() => {
            cargos.value = cargos.value.filter(c => !ids.includes(c.uuid));
            selectedProducts.value = [];
            toast.add({ severity: 'success', summary: 'Success', detail: 'Selected cargos deleted', life: 3000 });
        })
        .catch(error => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete selected cargos', life: 3000 });
        });
};

const openNew = () => {
    resetForm();
    cargoDialog.value = true;
};

const hideDialog = () => {
    cargoDialog.value = false;
};

const resetForm = () => {
    cargo.value = {
        cargo: '',
        weight: null,
        weight_unit: 'kg',
        length: null,
        width: null,
        height: null,
        cargo_type: null,
        fragile: false,
        temperature_sensitive: false,
        special_handling_instructions: '',
        origin: '',
        destination: '',
        receiver_name: '',
        receiver_contact: '',
        status: 'pending',
        cargo_documents: [],
        images: []
    };
    submitted.value = false;
    selectedCargo.value = null;
};

const handleFileUpload = (type, event) => {
    const files = event.target.files;
    if (type === 'documents') {
        cargo.value.cargo_documents.push(...Array.from(files).map(file => ({ file })));
    } else if (type === 'images') {
        cargo.value.images.push(...Array.from(files).map(file => ({ file })));
    }
};

const removeDocument = (index) => {
    cargo.value.cargo_documents.splice(index, 1);
};

const removeImage = (index) => {
    cargo.value.images.splice(index, 1);
};

const dialogHeader = computed(() => selectedCargo.value ? 'Edit Cargo' : 'Create Cargo');

onBeforeMount(() => {
    getCargos();
    getCargoTypes();
});
</script>

<style scoped>
.p-error {
    color: #f44336;
    font-size: 0.75rem;
    margin-top: 0.25rem;
}
</style>