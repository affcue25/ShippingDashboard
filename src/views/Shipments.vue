<template>
  <div class="min-h-screen bg-gray-50">
    <div class="px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 font-english">
          {{ $t('shipments.title') }}
        </h1>
        <p class="mt-2 text-gray-600 font-english">
          View and manage all your shipments
        </p>
      </div>

      <!-- Search and Filters -->
      <div class="card mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
              {{ $t('shipments.searchPlaceholder') }}
            </label>
            <input
              v-model="searchQuery"
              type="text"
              class="input-field"
              :placeholder="$t('shipments.searchPlaceholder')"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
              {{ $t('shipments.filterBy') }}
            </label>
            <select v-model="filterColumn" class="input-field">
              <option value="shipper_name">{{ $t('shipments.columns.shipperName') }}</option>
              <option value="consignee_name">{{ $t('shipments.columns.consigneeName') }}</option>
              <option value="shipper_city">{{ $t('shipments.columns.fromCity') }}</option>
              <option value="consignee_city">{{ $t('shipments.columns.toCity') }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
              {{ $t('shipments.dateFilter') }}
            </label>
            <select v-model="dateFilter" class="input-field">
              <option value="">{{ $t('common.total') }}</option>
              <option value="today">{{ $t('common.today') }}</option>
              <option value="week">{{ $t('common.week') }}</option>
              <option value="month">{{ $t('common.month') }}</option>
              <option value="year">{{ $t('common.year') }}</option>
            </select>
          </div>
          <div class="flex items-end">
            <button @click="searchShipments" class="btn-primary w-full">
              {{ $t('common.search') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Shipments Table -->
      <div class="card">
        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="loading-spinner"></div>
        </div>
        <div v-else-if="shipments.length === 0" class="text-center py-12">
          <p class="text-gray-500 font-english">{{ $t('shipments.noResults') }}</p>
        </div>
        <div v-else>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="table-header">{{ $t('shipments.columns.shipmentNumber') }}</th>
                  <th class="table-header">{{ $t('shipments.columns.shipperName') }}</th>
                  <th class="table-header">{{ $t('shipments.columns.consigneeName') }}</th>
                  <th class="table-header">{{ $t('shipments.columns.fromCity') }}</th>
                  <th class="table-header">{{ $t('shipments.columns.toCity') }}</th>
                  <th class="table-header">{{ $t('shipments.columns.weight') }}</th>
                  <th class="table-header">{{ $t('shipments.columns.date') }}</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="shipment in shipments" :key="shipment.id" class="hover:bg-gray-50">
                  <td class="table-cell font-medium text-primary-600">
                    {{ shipment.number_shipment || 'N/A' }}
                  </td>
                  <td class="table-cell">{{ shipment.shipper_name || 'N/A' }}</td>
                  <td class="table-cell">{{ shipment.consignee_name || 'N/A' }}</td>
                  <td class="table-cell">{{ shipment.shipper_city || 'N/A' }}</td>
                  <td class="table-cell">{{ shipment.consignee_city || 'N/A' }}</td>
                  <td class="table-cell">{{ shipment.shipment_weight || 'N/A' }}</td>
                  <td class="table-cell">{{ formatDate(shipment.shipment_creation_date) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="pagination" class="flex items-center justify-between mt-6">
            <div class="text-sm text-gray-700 font-english">
              Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to 
              {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of 
              {{ pagination.total }} results
            </div>
            <div class="flex space-x-2">
              <button
                @click="loadPage(pagination.page - 1)"
                :disabled="!pagination.has_prev"
                class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ $t('common.previous') }}
              </button>
              <button
                @click="loadPage(pagination.page + 1)"
                :disabled="!pagination.has_next"
                class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ $t('common.next') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { shippingAPI } from '../services/api'
import { format } from 'date-fns'

const loading = ref(false)
const shipments = ref([])
const pagination = ref(null)
const searchQuery = ref('')
const filterColumn = ref('shipper_name')
const dateFilter = ref('')

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return format(new Date(dateString), 'MMM dd, yyyy')
  } catch {
    return 'N/A'
  }
}

const loadShipments = async (page = 1) => {
  try {
    loading.value = true
    const params = {
      page,
      limit: 20
    }
    
    if (dateFilter.value) {
      params.date_filter = dateFilter.value
    }
    
    const response = await shippingAPI.getShipments(params)
    shipments.value = response.data || []
    pagination.value = response.pagination || null
  } catch (error) {
    console.error('Error loading shipments:', error)
  } finally {
    loading.value = false
  }
}

const searchShipments = async () => {
  if (!searchQuery.value.trim()) {
    loadShipments()
    return
  }
  
  try {
    loading.value = true
    const params = {
      column: filterColumn.value,
      value: searchQuery.value
    }
    
    if (dateFilter.value) {
      params.date_filter = dateFilter.value
    }
    
    const response = await shippingAPI.filterShipments(params)
    shipments.value = response.data || []
    pagination.value = null // No pagination for filtered results
  } catch (error) {
    console.error('Error searching shipments:', error)
  } finally {
    loading.value = false
  }
}

const loadPage = (page) => {
  if (searchQuery.value.trim()) {
    // If searching, reload search results
    searchShipments()
  } else {
    // If not searching, load normal paginated results
    loadShipments(page)
  }
}

onMounted(() => {
  loadShipments()
})
</script>
