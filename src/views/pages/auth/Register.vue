<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="flex flex-column align-items-center justify-content-center">
      <img src="@/assets/branding/logo-row.svg" alt="Tan Global" class="mb-2 w-16rem flex-shrink-0" />
      <div
        style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
          <form @submit.prevent="registerUser">
            <label for="fullname" class="block text-900 text-xl font-medium mb-2">Full Name</label>
            <input id="fullname" type="text" placeholder="Full name"
              class="w-full md:w-30rem mb-5 bg-green-50 border border-green-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
              style="padding: 1rem" v-model="fullname" />

            <label for="email" class="block text-900 text-xl font-medium mb-2">Email</label>
            <input id="email" type="email" placeholder="Email address"
              class="w-full md:w-30rem mb-5 bg-green-50 border border-green-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
              style="padding: 1rem" v-model="email" />

            <label for="password" class="block text-900 font-medium text-xl mb-2 mt-5">Password</label>
            <input id="password" type="password" placeholder="Password"
              class="w-full md:w-30rem mb-5 bg-green-50 border border-green-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
              style="padding: 1rem" v-model="password" />

            <label for="phone_number" class="block text-900 text-xl font-medium mb-2">Phone Number</label>
            <input id="phone_number" type="text" placeholder="Phone number"
              class="w-full md:w-30rem mb-5 bg-green-50 border border-green-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
              style="padding: 1rem" v-model="phoneNumber" />

            <label for="address" class="block text-900 text-xl font-medium mb-2">Address</label>
            <input id="address" type="text" placeholder="Address"
              class="w-full md:w-30rem mb-5 bg-green-50 border border-green-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
              style="padding: 1rem" v-model="address" />

            <label class="block text-900 font-medium text-xl mb-2">Are you an Individual or Business?</label>
            <div class="flex flex-wrap gap-3 mb-5">
              <div class="flex items-center">
                <input type="radio" id="individual" name="user" value="individual" v-model="user" />
                <label for="individual" class="ml-2">Individual</label>
              </div>
              <div class="flex items-center">
                <input type="radio" id="business" name="user" value="business" v-model="user" />
                <label for="business" class="ml-2">Business</label>
              </div>
            </div>

            <label for="user_type" class="block text-900 text-xl font-medium mb-2">Select an option</label>
            <select id="user_type" v-model="typeofuser"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value="NAU" disabled selected>What type of user are you?</option>
              <option value="FOU">Fleet / Car Owner</option>
              <option value="COU">Cargo Owner User</option>
            </select>

            <!-- Display error message if there's an error -->
            <div v-if="error" class="text-red-600 text-center mb-4">
              {{ error }}
            </div>

            <button type="submit" class="w-full p-3 text-xl bg-primary text-white rounded-lg mt-4">
              Create Account
            </button>
          </form>

          <div class="py-4 flex justify-center">
            <span class="mr-2">Already have an account?</span>
            <router-link :to="{ name: 'login' }" class="font-medium text-primary">Login</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import apiService from '@/services/apiService';

const router = useRouter();
const fullname = ref('');
const email = ref('');
const phoneNumber = ref('');
const address = ref('');
const password = ref('');
const user = ref('individual'); // Default to individual
const typeofuser = ref('NAU');

const authStore = useAuthStore();
const error = ref(null); // Reactive reference for error messages

const registerUser = async () => {
  error.value = null;
  try {
    const response = await apiService.post('auth/users/', {
      full_name: fullname.value,
      email: email.value,
      phone_number: phoneNumber.value,
      address: address.value,
      password: password.value,
      is_individual: user.value === 'individual', // Convert to boolean
      is_company: user.value === 'business', // Convert to boolean
      user_type: typeofuser.value
    });
    console.log('Registration successful:', response.data);
    router.push({ name: 'login' }); // Redirect to login page after successful registration
  } catch (err) {
    console.error('Error registering user:', err);
    // Set error message for display
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message;
    } else {
      error.value = 'Registration failed. Please try again later.';
    }
  }
};
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 0 auto;
}

.error {
  color: red;
}

.success {
  color: green;
}
</style>
