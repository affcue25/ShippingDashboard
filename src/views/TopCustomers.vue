<template>
  <div class="min-h-screen bg-gray-50">
    <div class="px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 font-english">
              Top Customers
            </h1>
            <p class="mt-2 text-gray-600 font-english">
              View and analyze your top customers by shipment volume
            </p>
          </div>
          <router-link to="/" class="btn-secondary">
            ← Back to Dashboard
          </router-link>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-6">
        <div class="flex flex-wrap items-center gap-4">
          <!-- Date Range Filter -->
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700 font-english">Date Range:</label>
            <input
              v-model="dateFrom"
              type="date"
              class="input-field"
              placeholder="From Date"
            />
            <span class="text-gray-500">to</span>
            <input
              v-model="dateTo"
              type="date"
              class="input-field"
              placeholder="To Date"
            />
            <button @click="applyDateFilter" class="btn-primary">
              Apply
            </button>
            <button @click="clearDateFilter" class="btn-secondary">
              Clear
            </button>
          </div>

          <!-- Page Size Selector -->
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700 font-english">Show:</label>
            <select v-model="pageSize" @change="loadTopCustomers" class="input-field">
              <option value="10">10 customers</option>
              <option value="15">15 customers</option>
              <option value="20">20 customers</option>
              <option value="25">25 customers</option>
              <option value="30">30 customers</option>
              <option value="40">40 customers</option>
              <option value="50">50 customers</option>
            </select>
          </div>

          <!-- Active Filter Display -->
          <div v-if="activeDateFilter" class="flex items-center space-x-2">
            <span class="text-sm text-gray-600 font-english">Active filter:</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {{ activeDateFilter }}
            </span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center h-64">
        <div class="loading-spinner"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="card">
        <div class="text-center py-8">
          <p class="text-red-600 font-english">{{ error }}</p>
          <button @click="loadTopCustomers" class="btn-primary mt-4">
            Try Again
          </button>
        </div>
      </div>

      <!-- Results -->
      <div v-else-if="customers.length > 0" class="card">
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-900 font-english">
            Top {{ customers.length }} Customers
            <span v-if="totalCustomers" class="text-sm font-normal text-gray-600">
              ({{ totalCustomers }} total customers)
            </span>
          </h3>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="table-header">#</th>
                <th class="table-header w-48 whitespace-normal break-words">Shipper Name</th>
                <th class="table-header">Shipments</th>
                <th class="table-header">Unique Consignees</th>
                <th class="table-header">Shipper Phone</th>
                <th class="table-header">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(customer, index) in customers" :key="customer.shipper_name" class="hover:bg-gray-50">
                <td class="table-cell font-medium text-gray-500">
                  {{ (currentPage - 1) * pageSize + index + 1 }}
                </td>
                <td class="table-cell font-medium text-gray-900 w-48 whitespace-normal break-words align-top">
                  {{ customer.shipper_name || 'N/A' }}
                </td>
                <td class="table-cell">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {{ customer.shipment_count }}
                  </span>
                </td>
                <td class="table-cell">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                    {{ customer.unique_consignees }}
                  </span>
                </td>
                <td class="table-cell">
                  {{ customer.shipper_phone || 'N/A' }}
                </td>
                <td class="table-cell">
                  <button 
                    @click="viewCustomerShipments(customer.shipper_name)"
                    class="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View Shipments
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-lg">
          <div class="text-sm text-gray-700 font-english">
            Showing {{ (currentPage - 1) * pageSize + 1 }} to 
            {{ Math.min(currentPage * pageSize, totalCustomers || customers.length) }} of 
            {{ totalCustomers || customers.length }} customers
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600 font-english">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            
            <!-- Direct page navigation -->
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600 font-english">Go to:</span>
              <input
                v-model.number="pageInput"
                type="number"
                :min="1"
                :max="totalPages"
                class="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                @keyup.enter="goToPage"
              />
              <button @click="goToPage" class="btn-secondary text-sm px-3 py-1">
                Go
              </button>
            </div>
            
            <!-- Navigation buttons -->
            <div class="flex items-center space-x-2">
              <button 
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage <= 1"
                class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button 
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage >= totalPages"
                class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-else class="card">
        <div class="text-center py-12">
          <p class="text-gray-500 font-english">No customers found for the selected criteria.</p>
          <button @click="clearDateFilter" class="btn-primary mt-4">
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { shippingAPI } from '../services/api'

const router = useRouter()

// State
const loading = ref(false)
const error = ref('')
const customers = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const pageInput = ref(1)
const dateFrom = ref('')
const dateTo = ref('')
const totalCustomers = ref(0)

// Computed
const totalPages = computed(() => {
  return Math.ceil(totalCustomers.value / pageSize.value)
})

const activeDateFilter = computed(() => {
  if (dateFrom.value && dateTo.value) {
    return `${dateFrom.value} to ${dateTo.value}`
  }
  return null
})

// Methods
const loadTopCustomers = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const params = {
      limit: pageSize.value
    }
    
    // Add date range if specified
    if (dateFrom.value && dateTo.value) {
      params.start_date = dateFrom.value
      params.end_date = dateTo.value
    }
    
    console.log('🔍 Loading top customers with params:', params)
    const response = await shippingAPI.getTopCustomers(params)
    console.log('✅ Top customers response:', response)
    
    customers.value = response.data || []
    
    // For now, we'll estimate total customers (this could be improved with a separate count endpoint)
    totalCustomers.value = customers.value.length
    
  } catch (err) {
    console.error('❌ Error loading top customers:', err)
    error.value = err.message || 'Error loading top customers'
  } finally {
    loading.value = false
  }
}

const applyDateFilter = () => {
  if (dateFrom.value && dateTo.value) {
    if (new Date(dateFrom.value) > new Date(dateTo.value)) {
      error.value = 'From date must be earlier than or equal to To date.'
      return
    }
  }
  currentPage.value = 1
  pageInput.value = 1
  loadTopCustomers()
}

const clearDateFilter = () => {
  dateFrom.value = ''
  dateTo.value = ''
  currentPage.value = 1
  pageInput.value = 1
  loadTopCustomers()
}

const goToPage = (page) => {
  if (page && page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    pageInput.value = page
    loadTopCustomers()
  } else if (pageInput.value >= 1 && pageInput.value <= totalPages.value) {
    currentPage.value = pageInput.value
    loadTopCustomers()
  }
}

const viewCustomerShipments = (shipperName) => {
  // Navigate to search page with shipper name pre-filled
  router.push({
    path: '/search',
    query: { shipper_name: shipperName }
  })
}

// Load data on mount
onMounted(() => {
  loadTopCustomers()
})
</script>
