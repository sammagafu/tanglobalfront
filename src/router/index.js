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
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/pages/dashboard/Dashboard.vue'),
                    meta: {
                        requiresAuth: true // Add meta field for authentication guard
                      }
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/Input.vue')
                },
                {
                    path: '/uikit/floatlabel',
                    name: 'floatlabel',
                    component: () => import('@/views/uikit/FloatLabel.vue')
                },
                {
                    path: '/uikit/invalidstate',
                    name: 'invalidstate',
                    component: () => import('@/views/uikit/InvalidState.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/Button.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/Table.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/List.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/Tree.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/Panels.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/Overlay.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/Media.vue')
                },
                {
                    path: '/uikit/menu',
                    component: () => import('@/views/uikit/Menu.vue'),
                    children: [
                        {
                            path: '/uikit/menu',
                            component: () => import('@/views/uikit/menu/PersonalDemo.vue')
                        },
                        {
                            path: '/uikit/menu/seat',
                            component: () => import('@/views/uikit/menu/SeatDemo.vue')
                        },
                        {
                            path: '/uikit/menu/payment',
                            component: () => import('@/views/uikit/menu/PaymentDemo.vue')
                        },
                        {
                            path: '/uikit/menu/confirmation',
                            component: () => import('@/views/uikit/menu/ConfirmationDemo.vue')
                        }
                    ]
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/Messages.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/File.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/Chart.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/Misc.vue')
                },
                {
                    path: '/blocks',
                    name: 'blocks',
                    component: () => import('@/views/utilities/Blocks.vue')
                },
                {
                    path: '/utilities/icons',
                    name: 'icons',
                    component: () => import('@/views/utilities/Icons.vue')
                },
                {
                    path: '/pages/timeline',
                    name: 'timeline',
                    component: () => import('@/views/pages/Timeline.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/utilities/Documentation.vue')
                }
            ]
        },
        {
            path:'/cargo',
            name:'cargo-index',
            component: AppLayout,
            children :[
                {
                    path: '',
                    name: 'cargo-home',
                    component: () => import('@/views/pages/cargo/CreateCargo.vue')
                },
                {
                    path: 'create',
                    name: 'cargo-create',
                    component: () => import('@/views/pages/cargo/CargoCategoryManagement.vue')
                },
            ]
        },
        {
            path:'/fleet',
            name:'fleet-index',
            component: AppLayout,
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
            ]
        },
        {
            path:'/users',
            name:'users-index',
            component: AppLayout,
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
                    path: 'my-updates',
                    name: ':slug',
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
            path: '/landing',
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
