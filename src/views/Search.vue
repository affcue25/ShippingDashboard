<template>
  <div class="min-h-screen bg-gray-50">
    <div class="px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 font-english">
          {{ $t('search.title') }}
        </h1>
        <p class="mt-2 text-gray-600 font-english">
          Advanced search with multiple filters
        </p>
      </div>

      <!-- Search Form -->
      <div class="card mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
              {{ $t('search.fromCity') }}
            </label>
            <input
              v-model="searchForm.fromCity"
              type="text"
              class="input-field"
              placeholder="Enter source city"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
              {{ $t('search.toCity') }}
            </label>
            <input
              v-model="searchForm.toCity"
              type="text"
              class="input-field"
              placeholder="Enter destination city"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
              {{ $t('search.shipperName') }}
            </label>
            <input
              v-model="searchForm.shipperName"
              type="text"
              class="input-field"
              placeholder="Enter shipper name"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
              {{ $t('search.consigneeName') }}
            </label>
            <input
              v-model="searchForm.consigneeName"
              type="text"
              class="input-field"
              placeholder="Enter consignee name"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
              {{ $t('search.minWeight') }}
            </label>
            <input
              v-model="searchForm.minWeight"
              type="number"
              class="input-field"
              placeholder="Minimum weight"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
              {{ $t('search.dateFilter') }}
            </label>
            <select v-model="searchForm.dateFilter" class="input-field">
              <option value="">{{ $t('common.total') }}</option>
              <option value="today">{{ $t('common.today') }}</option>
              <option value="week">{{ $t('common.week') }}</option>
              <option value="month">{{ $t('common.month') }}</option>
              <option value="year">{{ $t('common.year') }}</option>
            </select>
          </div>
        </div>
        
        <div class="flex justify-end space-x-4 mt-6">
          <button @click="clearForm" class="btn-secondary">
            {{ $t('search.clear') }}
          </button>
          <button @click="performSearch" class="btn-primary">
            {{ $t('search.search') }}
          </button>
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="searchPerformed" class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 font-english">
            {{ $t('search.results') }} ({{ results.length }})
          </h3>
          <button v-if="results.length > 0" @click="exportResults" class="btn-success">
            {{ $t('common.export') }}
          </button>
        </div>

        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="loading-spinner"></div>
        </div>
        <div v-else-if="results.length === 0" class="text-center py-12">
          <p class="text-gray-500 font-english">{{ $t('search.noResults') }}</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="table-header">Shipment #</th>
                <th class="table-header">Shipper</th>
                <th class="table-header">Consignee</th>
                <th class="table-header">From</th>
                <th class="table-header">To</th>
                <th class="table-header">Weight</th>
                <th class="table-header">Date</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="shipment in results" :key="shipment.id" class="hover:bg-gray-50">
                <td class="table-cell font-medium text-primary-600">
                  {{ shipment.number_shipment || 'N/A' }}
                </td>
                <td class="table-cell">{{ shipment.shipper_name || 'N/A' }}</td>
                <td class="table-cell">{{ shipment.consignee_name || 'N/A' }}</td>
                <td class="table-cell">{{ shipment.shipper_city || 'N/A' }}</td>
                <td class="table-cell">{{ shipment.consignee_city || 'N/A' }}</td>
                <td class="table-cell">{{ shipment.shipment_weight || 'N/A' }}</td>
                <td class="table-cell">{{ formatDate(shipment.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { shippingAPI } from '../services/api'
import { format } from 'date-fns'

const loading = ref(false)
const searchPerformed = ref(false)
const results = ref([])

const searchForm = ref({
  fromCity: '',
  toCity: '',
  shipperName: '',
  consigneeName: '',
  minWeight: '',
  dateFilter: ''
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return format(new Date(dateString), 'MMM dd, yyyy')
  } catch {
    return 'N/A'
  }
}

const performSearch = async () => {
  try {
    loading.value = true
    searchPerformed.value = true
    
    const params = {}
    
    if (searchForm.value.fromCity) params.from_city = searchForm.value.fromCity
    if (searchForm.value.toCity) params.to_city = searchForm.value.toCity
    if (searchForm.value.shipperName) params.shipper_name = searchForm.value.shipperName
    if (searchForm.value.consigneeName) params.consignee_name = searchForm.value.consigneeName
    if (searchForm.value.minWeight) params.min_weight = searchForm.value.minWeight
    if (searchForm.value.dateFilter) params.date_filter = searchForm.value.dateFilter
    
    const response = await shippingAPI.advancedSearch(params)
    results.value = response.data || []
  } catch (error) {
    console.error('Error performing search:', error)
  } finally {
    loading.value = false
  }
}

const clearForm = () => {
  searchForm.value = {
    fromCity: '',
    toCity: '',
    shipperName: '',
    consigneeName: '',
    minWeight: '',
    dateFilter: ''
  }
  results.value = []
  searchPerformed.value = false
}

const exportResults = async () => {
  if (results.value.length === 0) return
  
  try {
    const response = await shippingAPI.exportData({
      format: 'csv',
      data: results.value
    })
    
    if (response.success) {
      // Create download link
      const link = document.createElement('a')
      link.href = `https://shippingapiflask.onrender.com${response.download_url}`
      link.download = response.filename
      link.click()
    }
  } catch (error) {
    console.error('Error exporting results:', error)
  }
}
</script>
