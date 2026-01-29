import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'datatable',
      component: () => import('../views/datatable.vue')
    },
    {
      path: '/card',
      name: 'datatable-card',
      component: () => import('../views/datatableCard.vue')
    }
  ],
})

export default router
