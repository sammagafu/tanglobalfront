<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';

import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore'; // Import your auth store
import apiService from '@/services/apiService'; // Import your API service

const { layoutConfig } = useLayout();

const router = useRouter();
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const authStore = useAuthStore();

const logoUrl = computed(() => {
    return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const login = async () => {
  try {
    const response = await apiService.post('auth/token/', {
      email: email.value,
      password: password.value,
    });
    const { access, refresh } = response.data;
    authStore.setTokens(access, refresh, rememberMe.value);
    apiService.defaults.headers.common['Authorization'] = `Bearer ${access}`;

    // Fetch user data immediately after successful login
    await getUserData();
  } catch (error) {
    console.error('Error logging in:', error);
    // Handle error, such as displaying a message to the user
  }
};

const getUserData = async () => {
  try {
    const response = await apiService.get('auth/users/me/');
    const userData = response.data;
    // Do something with the user data, such as storing it in a Vuex store
    console.log('User Data:', userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    router.push('/');
  }
};


</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" />
                        <div class="text-900 text-3xl font-medium mb-3">Welcome, Isabel!</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>

                    <div>
                        <form @submit.prevent="login">
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="rememberMe" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                        </div>
                        <Button label="Sign In" class="w-full p-3 text-xl" type="submit"></Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
