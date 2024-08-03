<template>
  <div class="surface-ground flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
    <div class="flex flex-col items-center justify-center">
      <img src="@/assets/branding/monst-logo.svg" alt="Tan Global" class="py-8 w-16rem flex-shrink-0" />
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
          <form @submit.prevent="login">
            <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
            <input id="email1" type="email" placeholder="Email address" v-model="email" 
                   class="w-full md:w-80rem mb-5 bg-green-50 border border-green-300 
                          text-gray-900 text-sm rounded-lg focus:ring-green-500 
                          focus:border-green-500 block p-2.5 dark:bg-gray-700 
                          dark:border-gray-600 dark:placeholder-gray-400 
                          dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                   required />

            <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
            <input id="password1" type="password" v-model="password" placeholder="Password" 
                   class="w-full md:w-80rem mb-5 bg-green-50 border border-green-300 
                          text-gray-900 text-sm rounded-lg focus:ring-green-500 
                          focus:border-green-500 block p-2.5 dark:bg-gray-700 
                          dark:border-gray-600 dark:placeholder-gray-400 
                          dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                   required />
            
            <!-- Display error message -->
            <div v-if="authError" class="text-red-500 mb-3">{{ authError }}</div>

            <div class="flex items-center justify-between mb-5 gap-5">
              <div class="flex items-center">
                <input type="checkbox" id="rememberme1" v-model="rememberMe" class="mr-2">
                <label for="rememberme1">Remember me</label>
              </div>
              <router-link :to="{ name: 'forgotpassword' }" 
                           class="font-medium no-underline ml-2 text-right cursor-pointer" 
                           style="color: var(--primary-color)">Forgot Password?</router-link>
            </div>

            <button type="submit" class="w-full p-3 text-xl bg-primary rounded-lg text-white hover:bg-primary-dark">Sign In</button>
          </form>
          
          <div class="py-4 flex">
            <div class="">Don't have an account?</div>
            <router-link :to="{ name: 'register' }" 
                         class="font-medium no-underline ml-2 text-right cursor-pointer" 
                         style="color: var(--primary-color)">Create Account</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import apiService from '@/services/apiService';

const router = useRouter();
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const authStore = useAuthStore();
const authError = ref(null);

const login = async () => {
  authError.value = null; // Clear previous errors
  try {
    const response = await apiService.post('auth/token/', { email: email.value, password: password.value });
    authStore.setTokens(response.data.access, response.data.refresh, rememberMe.value);
    apiService.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

    const userResponse = await apiService.get('auth/users/me/');
    authStore.setUser(userResponse.data);

    router.push({ name: 'dashboard' });
  } catch (error) {
    console.error('Login error:', error);
    if (error.response && error.response.status === 400) {
      authError.value = 'Invalid email or password.';
    } else if (error.response && error.response.status === 404) {
      authError.value = 'User not found.';
    } else {
      authError.value = 'An unexpected error occurred. Please try again.';
    }
  }
};
</script>

<style scoped>
.text-red-500 {
  color: #f56565;
}
</style>