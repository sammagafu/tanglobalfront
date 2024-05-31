<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import RadioButton from 'primevue/radiobutton';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore'; // Import your auth store
import apiService from '@/services/apiService'; // Import your API service

const { layoutConfig } = useLayout();

const router = useRouter();
const email = ref('');
const fullname = ref('');
const usertype = ref("")
const is_individual = computed(() => usertype.value === 'individual');
const is_company = computed(() => usertype.value === 'business');
const password = ref('');
const rememberMe = ref(false);
const authStore = useAuthStore();

const logoUrl = computed(() => {
  return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const registerUser = async () => {
  try {
    const response = await apiService.post('auth/users/', {
      full_name : fullname.value,
      email: email.value,
      password: password.value,
      is_individual: is_individual.value,
      is_company: is_company.value,
    });
    
  } catch (error) {
    console.error('Error logging in:', error);
    // Handle error, such as displaying a message to the user
  }
  router.push({ name: 'login' });
};


  


</script>

<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="flex flex-column align-items-center justify-content-center">
      <img src="@/assets/branding/logo-row.svg" alt="Tan Global" class="mb-2 w-16rem flex-shrink-0" />
      <div
        style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
          <div>
            <form @submit.prevent="registerUser">
              <label for="fullname" class="block text-900 text-xl font-medium mb-2">Full Name</label>
              <InputText id="fullname" type="text" placeholder="Full name" class="w-full md:w-30rem mb-5"
                style="padding: 1rem" v-model="fullname" />

              <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
              <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5"
                style="padding: 1rem" v-model="email" />

              <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
              <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3"
                inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

              <div class="py-4">
                <label for="password1" class="block text-900 font-medium text-xl mb-2">What are you?</label>
              <div class="flex flex-wrap gap-3">
                <div class="flex align-items-center">
                  <RadioButton v-model="usertype" inputId="individual" name="individual" value="individual" />
                  <label for="individual" class="ml-2">An Individual</label>
                </div>
                <div class="flex align-items-center">
                  <RadioButton v-model="usertype" inputId="business" name="business" value="business" />
                  <label for="business" class="ml-2">Business</label>
                </div>
              </div>
              </div>

              <Button label="Create Account" class="w-full p-3 text-xl" type="submit"></Button>
            </form>
            <div class="py-4 flex">
              <div class="">I have an account?</div>
              <router-link :to="{ name: 'login' }" class="font-medium no-underline ml-2 text-right cursor-pointer"
                style="color: var(--primary-color)">Login</router-link>
            </div>
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
