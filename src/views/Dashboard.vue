<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div class="px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <h1 class="text-3xl font-bold mb-4 font-english">
            {{ $t('dashboard.title') }}
          </h1>
          <p class="text-lg text-primary-100 max-w-3xl mx-auto font-english">
            {{ $t('dashboard.subtitle') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          :title="$t('dashboard.todayShipments')"
          :value="stats.todayShipments"
          icon="truck"
          color="primary"
          :loading="loading"
        />
        <StatCard
          :title="$t('dashboard.totalShipments')"
          :value="stats.totalShipments"
          icon="cube"
          color="success"
          :loading="loading"
        />
        <StatCard
          :title="$t('dashboard.averageWeight')"
          :value="`${stats.averageWeight} kg`"
          icon="scale"
          color="warning"
          :loading="loading"
        />
        <StatCard
          :title="$t('dashboard.topCities')"
          :value="stats.topCitiesCount"
          icon="location"
          color="danger"
          :loading="loading"
        />
      </div>

      <!-- Top Customers -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Top Cities Chart -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 font-english">
              {{ $t('dashboard.topCustomers') }}
            </h3>
            <router-link
              to="/analytics"
              class="text-primary-600 hover:text-primary-700 text-sm font-medium font-english"
            >
              {{ $t('dashboard.viewAll') }}
            </router-link>
          </div>
          <!-- <TopCitiesChart :data="topCitiesData" :loading="loading" /> -->
            <TopCustomersTable :data="topCustomers" :loading="loading" />
        </div>

        <!-- Recent Shipments -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 font-english">
              {{ $t('dashboard.recentShipments') }}
            </h3>
            <router-link
              to="/shipments"
              class="text-primary-600 hover:text-primary-700 text-sm font-medium font-english"
            >
              {{ $t('dashboard.viewAll') }}
            </router-link>
          </div>
          <RecentShipmentsTable :data="recentShipments" :loading="loading" />
        </div>
      </div>

      <!-- Top Cities Table -->
      <div class="card mb-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 font-english">
            {{ $t('dashboard.topCitiesTable') }}
          </h3>
          <router-link
            to="/analytics"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium font-english"
          >
            {{ $t('dashboard.viewAll') }}
          </router-link>
        </div>
        <TopCitiesTable :data="topCitiesData" :loading="loading" />
      </div>


      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard
          :title="$t('nav.search')"
          :description="$t('search.title')"
          icon="search"
          color="primary"
          to="/search"
        />
        <QuickActionCard
          :title="$t('nav.analytics')"
          :description="$t('analytics.title')"
          icon="chart"
          color="success"
          to="/analytics"
        />
        <QuickActionCard
          :title="$t('nav.reports')"
          :description="$t('reports.title')"
          icon="document"
          color="warning"
          to="/reports"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { shippingAPI } from '../services/api'
import StatCard from '../components/StatCard.vue'
import TopCitiesChart from '../components/TopCitiesChart.vue'
import TopCitiesTable from '../components/TopCitiesTable.vue'
import RecentShipmentsTable from '../components/RecentShipmentsTable.vue'
import TopCustomersTable from '../components/TopCustomersTable.vue'
import QuickActionCard from '../components/QuickActionCard.vue'

const loading = ref(true)
const stats = ref({
  todayShipments: 0,
  totalShipments: 0,
  averageWeight: 0,
  topCitiesCount: 0
})

const topCitiesData = ref([])
const recentShipments = ref([])
const topCustomers = ref([])

const loadDashboardData = async () => {
  try {
    loading.value = true
    
    // Load all dashboard data in parallel
    const [
      totalShipmentsRes,
      averageWeightRes,
      topCitiesRes,
      recentShipmentsRes,
      topCustomersRes
    ] = await Promise.all([
      shippingAPI.getTotalShipments({ date_filter: 'today' }),
      shippingAPI.getAverageWeight({ date_filter: 'today' }),
      shippingAPI.getTopCities({ limit: 5 }),
      shippingAPI.getRecentShipments({ limit: 5 }),
      shippingAPI.getTopCustomers({ limit: 5 })
    ])

    // Update stats
    stats.value = {
      todayShipments: totalShipmentsRes.data?.total || 0,
      totalShipments: (await shippingAPI.getTotalShipments()).data?.total || 0,
      averageWeight: Math.round(averageWeightRes.data?.average_weight || 0),
      topCitiesCount: topCitiesRes.data?.length || 0
    }

    // Update data
    topCitiesData.value = topCitiesRes.data || []
    recentShipments.value = recentShipmentsRes.data || []
    topCustomers.value = topCustomersRes.data || []

  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>
