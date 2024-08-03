<template>
        <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img src="@/assets/branding/logo-row.svg" alt="Tan Global" class="mb-2 w-16rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-2 px-5 sm:px-8" style="border-radius: 53px">
                    <h4 class="py-4">Forgot Your Password?</h4>
                    <div>
                        <form @submit.prevent="forgetPassword">
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5 bg-green-50 border border-green-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" style="padding: 1rem" v-model="email" />
                        <Button label="Forget password" class="w-full p-3 text-xl bg-primary" type="submit"></Button>
                        </form>
                        <div class="py-4 flex">
                          <router-link :to="{name:'login'}" class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)"><i class="pi pi-angle-double-left px-2"></i>Back to signin</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import apiService from '@/services/apiService';
import { useToast } from 'primevue/usetoast';

const email = ref('');
const toast = useToast();

const forgetPassword = async () => {
  try {
    const response = await apiService.post('auth/users/reset_password/', {
      email: email.value,
    });

    // Assuming the API response indicates success
    if (response.status === 200) {
      toast.add({
        severity: 'success',
        summary: 'Password Reset',
        detail: 'Password reset email sent.',
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to reset password. Please try again later.',
      });
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to reset password. Please try again later.',
    });
  }
};
</script>
