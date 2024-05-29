<script setup>
import { ref,computed } from 'vue';
import { useAuthStore } from '@/store/authStore'; // Import your auth store
import AppMenuItem from './AppMenuItem.vue';

const authStore = useAuthStore();
const companyModel = ref([
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

// Use computed properties to dynamically select the menu items based on user role
const menuItems = computed(() => {
  if (authStore.user) {
    if (authStore.user.is_superuser && authStore.user.is_staff) {
      return adminMenu;
    } else if (authStore.user.is_individual) {
      return individualModel;
    } else if (authStore.user.is_company) {
      return companyModel;
    }
  }
  return [];
});

</script>

<template>
    <ul class="layout-menu">
      <template v-if="authStore.user">
        <template v-if="authStore.user.is_superuser && authStore.user.is_staff">
          <template v-for="(item, i) in adminMenu" :key="i">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-else-if="item.separator" class="menu-separator"></li>
          </template>
        </template>
        <template v-else-if="authStore.user.is_individual">
          <template v-for="(item, i) in individualModel" :key="i">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-else-if="item.separator" class="menu-separator"></li>
          </template>
        </template>
        <template v-else-if="authStore.user.is_company">
          <template v-for="(item, i) in companyModel" :key="i">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-else-if="item.separator" class="menu-separator"></li>
          </template>
        </template>
      </template>
    </ul>
  </template>
  
<style lang="scss" scoped></style>
