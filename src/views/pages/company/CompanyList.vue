
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

                <DataTable ref="dt" :value="company" paginator :rows="10">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Companies</h5>
                        </div>
                    </template>

                    <!-- <Column selectionMode="multiple" headerStyle="width: 3rem"></Column> -->
                    <Column field="companyName" header="Company name" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                    </Column>

                    <Column field="comapnyTelephone" header="Phone" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                    </Column>

                    <Column field="comapnyEmail" header="Email" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                    </Column>

                    <Column field="comapnyWebsite" header="Website" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                    </Column>
                    <Column field="is_approved" header="Apporoved" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                    </Column>

                    <Column headerStyle="min-width:10rem;" header="Actions">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded
                                @click="editProduct(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded
                                @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import apiService from '@/services/apiService'

const company = ref([])
const getCargoType = () => {
    apiService.get('company').then(response => {
        company.value = response.data
        console.log(response);
    }).catch(error => {
        console.log(error);
    })
}
onBeforeMount(() => {
    getCargoType();
});
</script>