<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/authStore'; // Import your auth store
import AppMenuItem from './AppMenuItem.vue';

const authStore = useAuthStore();
const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },

    {
        label: 'Cargo',
        icon: 'pi pi-fw pi-briefcase',
        to: '/cargo',
        items: [
            {
                label: 'My Cargos',
                icon: 'pi pi-fw pi-box',
                to: '/cargo/create'
            },
            
        ]
    },

    {
        label: 'Fleet',
        icon: 'pi pi-fw pi-bookmark',
        to: '/pages',
        items: [
            {
                label: 'My Fleet',
                icon: 'pi pi-fw pi-car',
                to: '/fleet'
            },
        ]
    },

]);

const individualModel = ref([
    {
        label: 'Home',
        items: [{ label: 'My Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },

    {
        label: 'Cargo',
        icon: 'pi pi-fw pi-briefcase',
        to: '/cargo',
        items: [
            {
                label: 'My Cargos',
                icon: 'pi pi-fw pi-box',
                to: '/cargo/create'
            },
        ]
    },

    {
        label: 'Fleet',
        icon: 'pi pi-fw pi-bookmark',
        to: '/pages',
        items: [
            {
                label: 'My Fleet',
                icon: 'pi pi-fw pi-car',
                to: '/fleet'
            },
        ]
    },

]);


const adminMenu = ref([
    {
        label : 'Admin Home',
        items : [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'User Management',
        icon: 'pi pi-fw pi-briefcase',
        to: '/cargo',
        items: [
            {
                label: 'Users',
                icon: 'pi pi-fw pi-box',
                to: '/users/'
            },
        ]
    },
    {
        label: 'Company Management',
        icon: 'pi pi-fw pi-briefcase',
        to: '/cargo',
        items: [
            {
                label: 'Companies',
                icon: 'pi pi-fw pi-box',
                to: '/company'
            },
        ]
    },
    {
        label: 'Manage Cargo',
        icon: 'pi pi-fw pi-briefcase',
        to: '/cargo/',
        items: [
            {
                label: 'Cargos',
                icon: 'pi pi-fw pi-box',
                to: '/cargo'
            },
            {
                label: 'Cargo Categories',
                icon: 'pi pi-fw pi-box',
                to: '/cargo/create'
            },
        ]
    },
    {
        label: 'Manage Fleet',
        icon: 'pi pi-fw pi-briefcase',
        to: '/fleet/',
        items: [
            {
                label: 'Fleets',
                icon: 'pi pi-fw pi-box',
                to: '/fleet'
            },
            {
                label: 'Fleets Types',
                icon: 'pi pi-fw pi-box',
                to: '/fleet/create'
            },
        ]
    },

])
</script>

<template>
    <ul class="layout-menu">
         
        <div v-if="authStore.user.is_superuser === true && authStore.user.is_staff">
            {{ authStore.user }}
        <template v-for="(item, i) in adminMenu" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        </div>
        <div v-else-if="authStore.user.is_individual">
        <template v-for="(item, i) in individualModel" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        </div>
        <div v-else-if="authStore.user.is_company">
        <template v-for="(item, i) in individualModel" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        </div>
        <!-- <li>
            456671
            <a href="https://www.primefaces.org/primeblocks-vue/#/" target="_blank">
                <img src="/layout/images/banner-primeblocks.png" alt="Prime Blocks" class="w-full mt-3" />
            </a>
        </li> -->
    </ul>
</template>

<style lang="scss" scoped></style>
