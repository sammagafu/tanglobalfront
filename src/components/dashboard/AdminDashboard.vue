<template>
    
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0 bg-yellow-300">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-900 font-bold mb-3">Registered Users</span>
                        <div class="text-900 font-bold text-4xl">{{ totalUsers }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-yellow-400 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-black text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-12 lg:col-6 xl:col-3">
                <div class="card mb-0 bg-green-300">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-900 font-bold mb-3">Companies Registed</span>
                            <div class="text-900 font-bold text-4xl">{{totalCompany}}</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-green-500 border-round" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-map-marker text-black-500 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 lg:col-6 xl:col-3">
                <div class="card mb-0 bg-cyan-100">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-900 font-bold mb-3">Registered Fleets</span>
                            <div class="text-900 font-bold text-4xl">{{totalFleet}}</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-cyan-300 border-round" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-car text-black text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 lg:col-6 xl:col-3">
                <div class="card mb-0 bg-gray-300">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-900 font-bold mb-3">Updates</span>
                            <div class="text-900 font-bold text-4xl">{{totalUpdates}}</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-gray-500 border-round" style="width: 2.5rem; height: 2.5rem">
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
        
            <!-- <div class="col-12 xl:col-6">
                
            </div> -->
    </div>

</template>

<script setup>
import { defineProps, computed,onMounted,ref } from 'vue';

const props = defineProps({
  userData: {
    type: Array,
    required: true
  },
  comapnyData: {
    type: Array,
    required: true
  },
  fleetData: {
    type: Array,
    required: true
  },
  updateData: {
    type: Array,
    required: true
  },
  cargoData: {
    type: Array,
    required: true
  },
});

const chartData = ref();
const chartOptions = ref();


onMounted(async () => {
    userData.forEach(user => {
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
        const loginData = Object.entries(loginCounts).map(([date, count]) => ({ date, count }));

        // Sort by date if necessary (data might already be sorted depending on input)
        loginData.sort((a, b) => new Date(a.date) - new Date(b.date));

        chartData.value = {
            labels: loginData.map(entry => entry.date),
            datasets: [
                {
                    label: 'Logins per Day',
                    data: loginData.map(entry => entry.count),
                    fill: false,
                    borderColor: '#4CAF50', // Example color
                    tension: 0.4
                }
            ]
        };

        chartOptions.value = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#333' // Example color
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#666' // Example color
                    },
                    grid: {
                        color: '#ddd' // Example color
                    }
                },
                y: {
                    ticks: {
                        color: '#666' // Example color
                    },
                    grid: {
                        color: '#ddd' // Example color
                    }
                }
            }
        };
});


// Calculate total users
const totalUsers = computed(() =>  props.userData.length);
const totalCompany = computed(() =>  props.comapnyData.length);
const totalFleet = computed(() =>  props.fleetData.length);
const totalUpdates = computed(() =>  props.updateData.length);
</script>
