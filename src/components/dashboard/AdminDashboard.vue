<!-- AdminDashboard.vue -->
<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div class="col-span-1">
        <div class="card mb-0 bg-yellow-300">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-900 font-bold mb-3">Registered Users</span>
              <div class="text-900 font-bold text-4xl">{{ totalUsers }}</div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-yellow-400 border-round"
              style="width: 2.5rem; height: 2.5rem"
            >
              <i class="pi pi-shopping-cart text-black text-xl"></i>
            </div>
          </div>
        </div>
      </div>
  
      <div class="col-span-1">
        <div class="card mb-0 bg-green-300">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-900 font-bold mb-3">Companies Registered</span>
              <div class="text-900 font-bold text-4xl">{{ totalCompany }}</div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-green-500 border-round"
              style="width: 2.5rem; height: 2.5rem"
            >
              <i class="pi pi-map-marker text-black-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
  
      <div class="col-span-1">
        <div class="card mb-0 bg-cyan-100">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-900 font-bold mb-3">Registered Fleets</span>
              <div class="text-900 font-bold text-4xl">{{ totalFleet }}</div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-cyan-300 border-round"
              style="width: 2.5rem; height: 2.5rem"
            >
              <i class="pi pi-car text-black text-xl"></i>
            </div>
          </div>
        </div>
      </div>
  
      <div class="col-span-1">
        <div class="card mb-0 bg-gray-300">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-900 font-bold mb-3">Updates</span>
              <div class="text-900 font-bold text-4xl">{{ totalUpdates }}</div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-gray-500 border-round"
              style="width: 2.5rem; height: 2.5rem"
            >
              <i class="pi pi-comment text-gray-100 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
  
      <div class="col-12 xl:col-6">
        <div class="card">
          <h5>Subscribers and Paying Users</h5>
        </div>
      </div>
      <div class="col-12 xl:col-6">
        <div class="card">
          <h5>Active Users per day</h5>
        </div>
      </div>
    </div>
  
    <div class="grid">
      <!-- Add your additional content here -->
    </div>
  </template>
  
  <script setup>
  import { defineProps, computed, onMounted, ref } from 'vue';
  
  // Correctly define props with the correct spelling
  const props = defineProps({
    userData: {
      type: Array,
      default: () => [], // Default to an empty array if not provided
    },
    companyData: {
      type: Array,
      default: () => [], // Default to an empty array if not provided
    },
    fleetData: {
      type: Array,
      default: () => [], // Default to an empty array if not provided
    },
    updateData: {
      type: Array,
      default: () => [], // Default to an empty array if not provided
    },
    cargoData: {
      type: Array,
      default: () => [], // Default to an empty array if not provided
    },
  });
  
  const chartData = ref();
  const chartOptions = ref();
  const loginCounts = {}; // Initialize loginCounts object
  
  onMounted(() => {
    // Loop through userData to count logins by date
    props.userData.forEach((user) => {
      if (user.last_login) {
        const loginDate = new Date(user.last_login).toISOString().split('T')[0]; // Extract YYYY-MM-DD
        if (loginCounts[loginDate]) {
          loginCounts[loginDate]++;
        } else {
          loginCounts[loginDate] = 1;
        }
      }
    });
  
    // Convert loginCounts object into an array of { date, count } for Chart.js
    const loginData = Object.entries(loginCounts).map(([date, count]) => ({
      date,
      count,
    }));
  
    // Sort by date if necessary (data might already be sorted depending on input)
    loginData.sort((a, b) => new Date(a.date) - new Date(b.date));
  
    chartData.value = {
      labels: loginData.map((entry) => entry.date),
      datasets: [
        {
          label: 'Logins per Day',
          data: loginData.map((entry) => entry.count),
          fill: false,
          borderColor: '#4CAF50', // Example color
          tension: 0.4,
        },
      ],
    };
  
    chartOptions.value = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#333', // Example color
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#666', // Example color
          },
          grid: {
            color: '#ddd', // Example color
          },
        },
        y: {
          ticks: {
            color: '#666', // Example color
          },
          grid: {
            color: '#ddd', // Example color
          },
        },
      },
    };
  });
  
  // Calculated properties for total counts with fallback to ensure arrays are defined
  const totalUsers = computed(() => props.userData?.length || 0);
  const totalCompany = computed(() => props.companyData?.length || 0);
  const totalFleet = computed(() => props.fleetData?.length || 0);
  const totalUpdates = computed(() => props.updateData?.length || 0);
  </script>
  