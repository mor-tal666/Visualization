import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/data-analysis',
    name: 'DataAnalysis',
    component: () => import('../views/DataAnalysis.vue')
  },
  {
    path: '/resource-management',
    name: 'ResourceManagement',
    component: () => import('../views/ResourceManagement.vue')
  },
  {
    path: '/policy-support',
    name: 'PolicySupport',
    component: () => import('../views/PolicySupport.vue')
  },
  {
    path: '/community',
    name: 'Community',
    component: () => import('../views/Community.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(), // ← 改这里
  routes
})

export default router
