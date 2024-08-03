<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template #start>
                        <div class="my-2">
                            <Button label="Export CSV" icon="pi pi-file" class="mr-2 bg-green-700 px-4 py-2 text-white" @click="exportToCSV" />
                            <Button label="Export Excel" icon="pi pi-file-excel" class="mr-2 bg-blue-700 px-4 py-2 text-white" @click="exportToExcel" />
                        </div>
                    </template>
                </Toolbar>
                <DataTable ref="dt" :value="companies" paginator :rows="10" scrollable scrollHeight="flex">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Companies</h5>
                        </div>
                    </template>

                    <Column field="companyName" header="Company Name" :sortable="true" headerStyle="width:30%; min-width:10rem;">
                        <template #header="slotProps">
                            <div class="p-2">{{ slotProps.header }}</div>
                        </template>
                    </Column>

                    <Column field="comapnyTelephone" header="Phone" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                        <template #header="slotProps">
                            <div class="p-2">{{ slotProps.header }}</div>
                        </template>
                    </Column>

                    <Column field="comapnyEmail" header="Email" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                        <template #header="slotProps">
                            <div class="p-2">{{ slotProps.header }}</div>
                        </template>
                    </Column>

                    <Column field="comapnyWebsite" header="Website" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                        <template #header="slotProps">
                            <div class="p-2">{{ slotProps.header }}</div>
                        </template>
                    </Column>
                    
                    <Column field="is_approved" header="Approved" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                        <template #header="slotProps">
                            <div class="p-2">{{ slotProps.header }}</div>
                        </template>
                        <template #body="slotProps">
                            <Tag :severity="slotProps.data.is_approved ? 'success' : 'danger'" :value="slotProps.data.is_approved ? 'Active' : 'Inactive'" />
                        </template>
                    </Column>

                    <Column headerStyle="min-width:10rem;" header="Actions">
                        <template #header="slotProps">
                            <div class="p-2">{{ slotProps.header }}</div>
                        </template>
                        <template #body="slotProps">
                            <Button icon="pi pi-lock" class="mr-2" severity="success" rounded
                                @click="lockorUnlockCompany(slotProps.data.id)" />
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
import apiService from '@/services/apiService';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Toolbar from 'primevue/toolbar';
import { utils, writeFile } from 'xlsx';

const companies = ref([]);

const getCompanies = async () => {
    try {
        const response = await apiService.get('company');
        companies.value = response.data;
    } catch (error) {
        console.error('Error fetching companies:', error);
    }
};

const lockorUnlockCompany = async (id) => {
    try {
        const response = await apiService.patch(`/company/${id}/approve-company/`);
        console.log('Company approved successfully:', response.data);
        await getCompanies(); // Refresh the data
    } catch (error) {
        console.error('Error approving company:', error);
    }
};

const exportToCSV = () => {
    const worksheet = utils.json_to_sheet(companies.value);
    const csvOutput = utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'companies.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const exportToExcel = () => {
    const worksheet = utils.json_to_sheet(companies.value);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Companies');
    writeFile(workbook, 'companies.xlsx');
};

onBeforeMount(() => {
    getCompanies();
});
</script>

<style scoped>
@media (max-width: 600px) {
    .card h5 {
        font-size: 1rem;
    }

    .card .p-datatable-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .card .p-button {
        margin-bottom: 0.5rem;
    }

    .card .p-datatable-tbody > tr > td {
        font-size: 0.9rem;
    }

    .p-datatable-wrapper {
        overflow-x: auto;
    }
}
</style>