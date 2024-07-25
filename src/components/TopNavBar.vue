<script setup>
import logoUrl from '@/assets/branding/monst-logo.svg';
import { ref,computed } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import AppConfig from '@/layout/AppConfig.vue';
const { layoutConfig } = useLayout();

const smoothScroll = (id) => {
    document.querySelector(id).scrollIntoView({
        behavior: 'smooth'
    });
};

const isOpen = ref(false);
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
  console.log("clicked fuke")
};
</script>

<template>
<nav class="bg-gray-100">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-4">
    <router-link :to="{name:'landing'}">
      <img :src="logoUrl" alt="Logo" class="h-16">
    </router-link>

    <button data-collapse-toggle="navbar-default" type="button"  @click="toggleMenu" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
    </button>

    <div class="w-full md:block md:w-auto" id="navbar-default" :class="{ 'hidden': !isOpen }">
      <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
        
        <li>
          <a @click="smoothScroll('#features')" class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple" v-ripple>
                                <span>Features</span>
                            </a>
        </li>
        <li>
          <a @click="smoothScroll('#features')" class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple" v-ripple>
                                <span>How it Works</span>
                            </a>
        </li>
        <li>
          <a @click="smoothScroll('#features')" class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple" v-ripple>
                                <span>Pricing</span>
                            </a>
        </li>
    </ul>
    </div>
    <div class="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
        <router-link :to="{name:'login'}"><Button label="Login" class="p-button-text p-button-rounded border-none font-light line-height-2 text-blue-500 p-2"></Button></router-link>
        <router-link :to="{name:'register'}"><Button label="Register" class="p-button-rounded border-none ml-5 font-light text-white line-height-2 bg-blue-500 p-2"></Button></router-link>
                        
                        
                    </div>
  </div>
</nav>

</template>