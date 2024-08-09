<template>
    <div class="card">
        <DataView :value="cargos" :layout="layout">
            <template #header>
                <div class="flex justify-end">
                    <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                        <template #option="{ option }">
                            <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
                        </template>
                    </SelectButton>
                </div>
            </template>

            <template #list="slotProps">
                <div class="flex flex-col">
                    <div v-for="(item, index) in slotProps.items" :key="index">
                        <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4"
                            :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                            <div class="md:w-40 relative">
                                <img class="block xl:block mx-auto rounded w-full"
                                    :src="item.images.length > 0 ? item.images[0].image : 'https://via.placeholder.com/300'"
                                    :alt="item.cargo" />
                                <Tag :value="item.status" :severity="getSeverity(item.status)"
                                    class="absolute dark:!bg-surface-900" style="left: 4px; top: 4px"></Tag>
                            </div>
                            <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                                <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                    <div>
                                        <span class="font-medium text-surface-500 text- text-sm">{{
                                            item.origin }} to {{ item.destination }}</span>
                                        <div class="text-lg font-medium mt-2">{{ item.cargo }}</div>
                                    </div>
                                    <div class="bg-surface-100 p-1" style="border-radius: 30px">
                                        <div class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2"
                                            style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)">
                                            <span class="text-surface-900 font-medium text-sm">{{ item.weight }} {{
                                                item.weight_unit }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col md:items-end gap-8">
                                    <span class="text-xl font-semibold">{{ item.receiver_name }}</span>
                                    <div class="flex flex-row-reverse md:flex-row gap-2">
                                        <Button icon="pi pi-info-circle" label="Details"></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <template #grid="slotProps">
                <div class="grid grid-cols-12 gap-4">
                    <div v-for="(item, index) in slotProps.items" :key="index"
                        class="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-4 p-2">
                        <div
                            class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                            <div class="bg-surface-50 flex justify-center rounded p-4">
                                <div class="relative mx-auto">
                                    <img class="rounded w-full"
                                        :src="item.images.length > 0 ? item.images[0].image : 'https://via.placeholder.com/300'"
                                        :alt="item.cargo" style="max-width: 300px" />
                                    <Tag :value="item.status" :severity="getSeverity(item.status)"
                                        class="absolute dark:!bg-surface-900" style="left: 4px; top: 4px"></Tag>
                                </div>


                            </div>
                            <div class="pt-6">
                                <div class="text-2xl font-semibold mt-1">{{ item.cargo }}</div>
                                <div class="flex flex-col gap-1 mt-4">
                                    <span class="text-baseline font-semibold">Weight : {{ item.weight }} {{
                                        item.weight_unit }}</span>
                                    <span class="text-baseline font-semibold pt-2">From {{ item.origin }} to {{
                                        item.destination }}</span>
                                </div>
                                <div class="flex flex-row-reverse md:flex-row gap-2 items-center justify-center py-4">
                                        <router-link :to="{ name: 'cargo-details', params: { uuid: item.uuid } }"><Button icon="pi pi-info-circle" label="Details" class="bg-blue-700 py-2 px-4 text-slate-50"></Button></router-link>
                                    </div>

                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </DataView>
    </div>
</template>


<script setup>
import { ref, onBeforeMount } from 'vue';
import apiService from '@/services/apiService';

const cargos = ref([]);
const layout = ref('grid');
const options = ref(['list', 'grid']);

const getSeverity = (status) => {
    switch (status) {
        case 'pending':
            return 'warn';
        case 'delivered':
            return 'success';
        case 'out_of_stock':
            return 'danger';
        default:
            return null;
    }
};

onBeforeMount(() => {
    apiService.get('cargo')
        .then(response => {
            cargos.value = response.data;
        })
        .catch(error => {
            console.log(error);
        });
});
</script>
