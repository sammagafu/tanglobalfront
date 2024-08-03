import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/pages/dashboard/Dashboard.vue'),
                    meta: {
                        requiresAuth: true // Add meta field for authentication guard
                      }
                },
                
            ]
        },
        {
            path:'/cargo',
            name:'cargo-index',
            component: AppLayout,
            meta: {
                requiresAuth: true // Add meta field for authentication guard
              },
            children :[
                {
                    path: '',
                    name: 'cargo-home',
                    component: () => import('@/views/pages/cargo/CreateCargo.vue')
                },
                {
                    path: ':uuid',
                    name: 'cargo-details',
                    component: () => import('@/views/pages/cargo/CargoDetails.vue')
                },
                {
                    path: 'create',
                    name: 'cargo-category',
                    component: () => import('@/views/pages/cargo/CargoCategoryManagement.vue')
                },
            ]
        },
        {
            path:'/fleet',
            name:'fleet-index',
            component: AppLayout,
            meta: {
                requiresAuth: true // Add meta field for authentication guard
              },
            children :[
                {
                    path: '',
                    name: 'fleet-home',
                    component: () => import('@/views/pages/fleet/CreateFleet.vue')
                },
                {
                    path: 'create',
                    name: 'fleet-create',
                    component: () => import('@/views/pages/fleet/FleetManage.vue')
                },
                {
                    path: ':fleetnumber',
                    name: 'fleet-detail',
                    component: () => import('@/views/pages/fleet/FleetDetailView.vue')
                },
            ]
        },
        {
            path:'/users',
            name:'users-index',
            component: AppLayout,
            meta: {
                requiresAuth: true // Add meta field for authentication guard
              },
            children :[
                {
                    path: '',
                    name: 'users-home',
                    // src/views/pages/cargo/CargoCategoryManagement.vue
                    component: () => import('@/views/pages/users/ManageUsers.vue')
                },
            ]
        },
        {
            path:'/company',
            name:'company-index',
            component: AppLayout,
            meta: {
                requiresAuth: true // Add meta field for authentication guard
              },
            children :[
                {
                    path: '',
                    name: 'company-home',
                    // src/views/pages/cargo/CargoCategoryManagement.vue
                    component: () => import('@/views/pages/company/CompanyList.vue'),
                    
                },
            ]
        },
        {
            path:'/profile',
            name:'my-profile',
            component: AppLayout,
            meta: {
                requiresAuth: true // Add meta field for authentication guard
              },
            children :[
                {
                    path: '',
                    name: 'profile',
                    // src/views/pages/cargo/CargoCategoryManagement.vue
                    component: () => import('@/views/pages/auth/UpdateUserDetails.vue'),
                    meta: {
                        requiresAuth: true // Add meta field for authentication guard
                      },
                },
            ]
        },
        {
            path:'/updates/',
            name:'updates',
            component: AppLayout,
            meta: {
                requiresAuth: true // Add meta field for authentication guard
              },
            children :[
                {
                    path: 'manage',
                    name: 'update-manage',
                    component: () => import('@/views/pages/updates/CreateUpdate.vue'),
                    meta: {
                        requiresAuth: true // Add meta field for authentication guard
                      },
                },
                {
                    path: 'type',
                    name: 'update-type',
                    component: () => import('@/views/pages/updates/CreateUpdateCategory.vue'),
                    meta: {
                        requiresAuth: true // Add meta field for authentication guard
                      },
                },
                {
                    path: 'mine',
                    name: 'my-updates',
                    component: () => import('@/views/pages/updates/MyUpdates.vue'),
                    meta: {
                        requiresAuth: true // Add meta field for authentication guard
                      },
                },
                {
                    path: ':slug',
                    name: 'update-details',
                    component: () => import('@/views/pages/updates/UpdateDetails.vue'),
                    meta: {
                        requiresAuth: true // Add meta field for authentication guard
                      },
                },
            ]
        },
        {
            path: '',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/auth/register',
            name: 'register',
            component: () => import('@/views/pages/auth/Register.vue')
        },
        {
            path: '/auth/forgot-password/',
            name: 'forgotpassword',
            component: () => import('@/views/pages/auth/ForgotPassword.vue')
        },
    ]
});

// Auth guard
router.beforeEach((to, from, next) => {
    const isAuthenticated = useAuthStore().isAuthenticated;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
    if (requiresAuth && !isAuthenticated) {
      next({ name: 'login' }); // Redirect to login if route requires authentication and user is not authenticated
    } else {
      next(); // Continue to the requested route
    }
  });
  

export default router;
