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

                <DataTable ref="dt" :value="cargotype" paginator :rows="10">

                    <!-- <Column selectionMode="multiple" headerStyle="width: 3rem"></Column> -->
                    <Column field="name" header="Cargo Category Name" :sortable="true" headerStyle="width:75%; min-width:10rem;">
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

                <Dialog v-model:visible="categoryNameDialog" :style="{ width: '500px' }" header="Create Update Types" :modal="true"
                    class="p-fluid">
                    <form @submit.prevent="createUpdateCategory" ref="fomu">
                        <div class="field">
                            <label for="name">Updatea Category Name</label>
                            <InputText id="name" name="name" v-model="updatename" required="true" autofocus
                                :invalid="submitted && !updatename" placeholder="Enter Update Name" />
                            <small class="p-invalid" v-if="submitted && !updatename">Cargo name is required.</small>
                        </div>

                        <Button label="Cancel" icon="pi pi-times" text="" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" type="submit" />
                    </form>

                </Dialog>

            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import apiService from '@/services/apiService'
import { useRouter } from 'vue-router';
const router = useRouter();
const cargotype = ref([])
const categoryNameDialog = ref(false);
const submitted = ref(false);
const updatename =ref()

const createUpdateCategory = () => {
    apiService.post('update/update-types/',{
        'name':updatename.value
    }).then(response => {
        cargotype.value = response.data
        router.go();
    }).catch(error => {
        console.log(error);
    })
}

const getCargoType = () => {
    apiService.get('update/update-types/').then(response => {
        cargotype.value = response.data
        console.log(response);
    }).catch(error => {
        console.log(error);
    })
}

const openNew = () => {
    // cargotype.value = {};
    // submitted.value = false;
    categoryNameDialog.value = true;
};

onBeforeMount(() => {
    getCargoType();
});

</script>