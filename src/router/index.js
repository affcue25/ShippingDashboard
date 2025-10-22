import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Shipments from '../views/Shipments.vue'
import Search from '../views/Search.vue'
import Analytics from '../views/Analytics.vue'
import Reports from '../views/Reports.vue'
import TopCustomers from '../views/TopCustomers.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'Dashboard'
    }
  },
  {
    path: '/shipments',
    name: 'Shipments',
    component: Shipments,
    meta: {
      title: 'Shipments'
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    meta: {
      title: 'Advanced Search'
    }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: Analytics,
    meta: {
      title: 'Analytics'
    }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: {
      title: 'Reports'
    }
  },
  {
    path: '/top-customers',
    name: 'TopCustomers',
    component: TopCustomers,
    meta: {
      title: 'Top Customers'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Update page title based on route
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Smart Shipping Dashboard`
  next()
})

export default router
