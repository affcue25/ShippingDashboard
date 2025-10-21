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

    <!-- Date Filters + Stats Cards -->
    <div class="px-4 sm:px-6 lg:px-8 py-8">
      <!-- Date Filter Controls -->
      <div class="card mb-6">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between space-y-4 md:space-y-0">
          <div class="flex items-center space-x-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2 font-english">Period</label>
              <select v-model="datePreset" class="input-field w-48">
                <option value="today">Today</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
                <option value="total">Total</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div v-if="datePreset === 'custom'" class="flex items-end space-x-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 font-english">From</label>
                <input v-model="dateFrom" type="date" class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 font-english">To</label>
                <input v-model="dateTo" type="date" class="input-field" />
              </div>
              <button @click="applyDateFilter" class="btn-primary" :disabled="!canApplyCustom">
                Apply
              </button>
            </div>
          </div>
          <div class="text-sm text-gray-600 font-english" v-if="activeFilterLabel">
            Showing data for: <span class="font-medium text-gray-900">{{ activeFilterLabel }}</span>
          </div>
        </div>
      </div>

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
import { ref, onMounted, computed, watch } from 'vue'
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

// Date filter state
const datePreset = ref('today') // today | week | month | year | total | custom
const dateFrom = ref('')
const dateTo = ref('')
const canApplyCustom = computed(() => dateFrom.value && dateTo.value)
const activeFilterLabel = computed(() => {
  if (datePreset.value === 'custom' && canApplyCustom.value) {
    return `${dateFrom.value} → ${dateTo.value}`
  }
  const labels = { today: 'Today', week: 'This Week', month: 'This Month', year: 'This Year', total: 'All Time' }
  return labels[datePreset.value] || ''
})

const buildDateParams = () => {
  if (datePreset.value === 'custom' && canApplyCustom.value) {
    return { start_date: dateFrom.value, end_date: dateTo.value }
  }
  if (datePreset.value && datePreset.value !== 'total') {
    return { date_filter: datePreset.value }
  }
  return {}
}

const loadDashboardData = async () => {
  try {
    loading.value = true
    const dateParams = buildDateParams()
    
    // Load all dashboard data in parallel
    const [
      totalShipmentsRes,
      averageWeightRes,
      topCitiesRes,
      recentShipmentsRes,
      topCustomersRes
    ] = await Promise.all([
      shippingAPI.getTotalShipments({ ...dateParams }),
      shippingAPI.getAverageWeight({ ...dateParams }),
      shippingAPI.getTopCities({ limit: 5, ...dateParams }),
      shippingAPI.getRecentShipments({ limit: 5, ...dateParams }),
      shippingAPI.getTopCustomers({ limit: 5, ...dateParams })
    ])

    // Update stats
    stats.value = {
      todayShipments: totalShipmentsRes.data?.total || 0,
      totalShipments: totalShipmentsRes.data?.total || 0,
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

const applyDateFilter = () => {
  if (datePreset.value === 'custom' && !canApplyCustom.value) return
  loadDashboardData()
}

// Auto-reload when switching presets (non-custom)
watch(datePreset, (val) => {
  if (val !== 'custom') {
    loadDashboardData()
  }
})

onMounted(() => {
  loadDashboardData()
})
</script>
