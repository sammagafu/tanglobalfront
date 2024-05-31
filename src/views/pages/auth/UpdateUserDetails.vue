<template>
  <div class="col-12">
    <div class="card">
      <h5>Upate User information</h5>
      <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-6">
          <label for="email1" class="">Email</label>
          <InputText id="email1" type="text" placeholder="Email address" class="mb-5" style="padding: 1rem"
            v-model="email" />
        </div>

        <div class="field col-12 md:col-6">
          <label for="fullname" class="">Full name</label>
          <InputText id="fullname" type="text" placeholder="Email address" class="mb-5" style="padding: 1rem"
            v-model="fullname" />
        </div>
        <Button label="Submit"></Button>
      </div>
    </div>
  </div>

  <!-- update to check if user is -->
  <div class="col-12">
    <div class="card">
      <h5>Company Details</h5>
      <div class="">
        <form class="p-fluid formgrid grid" @submit.prevent="updateUserData">
          <div class="field col-12">
            <label for="firstname2">Company name</label>
            <InputText id="firstname2" type="text" style="padding: 1rem" v-model="companyname" />
          </div>
          <div class="field col-12">
            <label for="state">Company type</label>
            <Dropdown id="state" v-model="dropdownItem" :options="dropdownItems" optionLabel="name"
              placeholder="Select One" style="padding: 1rem"></Dropdown>
          </div>
          <div class="field col-12 md:col-4">
            <label for="companytel">Company telephone no</label>
            <InputText id="companytel" type="text" style="padding: 1rem" v-model="companytel" />
          </div>
          <div class="field col-12 md:col-4">
            <label for="companyemail">Company email</label>
            <InputText id="companyemail" type="text" style="padding: 1rem" v-model="companyemail" />
          </div>
          <div class="field col-12 md:col-4">
            <label for="companyweb">Company website</label>
            <InputText id="companyweb" type="text" style="padding: 1rem" v-model="companyweb" />
          </div>
          <div class="field col-12">
            <label for="address">Company Address</label>
            <Textarea id="address" rows="4" v-model="companyadrress" />
          </div>
          <div class="field col-12 md:col-4">
            <label for="city">TIN Number</label>
            <InputText id="city" type="text" style="padding: 1rem" v-model="companytin" />
          </div>
          <div class="field col-12 md:col-4">
            <label for="city">VAT Number</label>
            <InputText id="city" type="text" style="padding: 1rem" v-model="companyvat" />
          </div>
          <div class="field col-12 md:col-4">
            <label for="city">Company Registration Number</label>
            <InputText id="city" type="text" style="padding: 1rem" v-model="companyreg" />
          </div>
          <div class="field col-12">
            <label for="city">Company Registration Number</label>
            <InputText id="city" type="text" style="padding: 1rem" v-model="companyreg" />
          </div>
          <Button label="Update Company Details" type="submit"></Button>
        </form>
      </div>
    </div>
  </div>
  <AppConfig simple />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiService from '@/services/apiService';

const email = ref('')
const fullname = ref('')
const companyname = ref('')
const companyType = ref('')
const companytel = ref('')
const companyemail = ref('')
const companyweb = ref('')
const companyadrress = ref('')
const companytin = ref('')
const companyvat = ref('')
const companyreg = ref('')
const companyLogo = ref('')
const companyId = ref('')
const receivedUser = ref('')



const getUserData = async () => {
  try {
    const response = await apiService.get('auth/users/me/');
    const userData = response.data;
    receivedUser.value = response.data;
    console.log(userData)
    email.value = userData.email;
    fullname.value = userData.full_name
    if (userData) {
      companyname.value = userData.company_details.companyName
      companyType.value = userData.company_details.company_type
      companytel.value = userData.company_details.comapnyTelephone
      companyemail.value = userData.company_details.comapnyEmail
      companyweb.value = userData.company_details.comapnyWebsite
      companyadrress.value = userData.company_details.companyAddress
      companytin.value = userData.company_details.tin
      companyvat.value = userData.company_details.vat
      companyreg.value = userData.company_details.companyreg
      companyLogo.value = userData.company_details.company
      companyId.value = userData.company_details.id
    }
    companyname.value = userData.company_details.companyName
      companyType.value = userData.company_details.company_type
      companytel.value = userData.company_details.comapnyTelephone
      companyemail.value = userData.company_details.comapnyEmail
      companyweb.value = userData.company_details.comapnyWebsite
      companyadrress.value = userData.company_details.companyAddress
      companytin.value = userData.company_details.tin
      companyvat.value = userData.company_details.vat
      companyreg.value = userData.company_details.companyreg
      companyLogo.value = userData.company_details.company
      companyId.value = userData.company_details.id


    // Do something with the user data, such as storing it in a Vuex store
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
  // router.push('/');
};

const updateUserData = async () => {
  try {
    const userData = {
      companyName: companyname.value,
      company_type: companyType.value,
      comapnyTelephone: companytel.value,
      comapnyEmail: companyemail.value,
      comapnyWebsite: companyweb.value,
      companyAddress: companyadrress.value,
      tin: companytin.value,
      vat: companyvat.value,
      companyreg: companyreg.value,
      company: companyLogo.value
    };

  const response = await apiService.put(`company/${companyId.value}`, userData);

    console.log(response);
  }
  catch (error) {

  }
};

onMounted(() => {
  getUserData();
});

</script>