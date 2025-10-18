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
          <button @click="() => clearForm()" class="btn-secondary">
            {{ $t('search.clear') }}
          </button>
          <button @click="() => performSearch()" class="btn-primary">
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
        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-500 font-english">❌ {{ error }}</p>
          <button @click="() => { error = ''; performSearch() }" class="btn-primary mt-4">
            Try Again
          </button>
        </div>
        <div v-else-if="results.length === 0" class="text-center py-12">
          <p class="text-gray-500 font-english">{{ $t('search.noResults') }}</p>
        </div>
        <div v-else>
          <div class="mb-4 text-sm text-gray-600 font-english">
            <p>📊 Showing all shipment columns. Scroll horizontally to view all data.</p>
            <p v-if="pagination" class="text-primary-600 font-medium">
              🔍 Search Results: {{ pagination.total }} results found
            </p>
          </div>
          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="min-w-full divide-y divide-gray-200" style="min-width: 2000px;">
              <thead class="bg-gray-50">
                <tr>
                  <th class="table-header">ID</th>
                  <th class="table-header">Shipment Number</th>
                  <th class="table-header">Country Code</th>
                  <th class="table-header">Shipper Name</th>
                  <th class="table-header">Shipper City</th>
                  <th class="table-header">Shipper Phone</th>
                  <th class="table-header">Shipper Address</th>
                  <th class="table-header">Consignee Name</th>
                  <th class="table-header">Consignee City</th>
                  <th class="table-header">Consignee Phone</th>
                  <th class="table-header">Consignee Address</th>
                  <th class="table-header">Reference Number</th>
                  <th class="table-header">Creation Date</th>
                  <th class="table-header">COD</th>
                  <th class="table-header">Weight</th>
                  <th class="table-header">Boxes</th>
                  <th class="table-header">Description</th>
                  <th class="table-header">PDF Filename</th>
                  <th class="table-header">Processing Date</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="shipment in results" :key="shipment.id" class="hover:bg-gray-50">
                  <td class="table-cell font-medium text-primary-600">{{ shipment.id || 'N/A' }}</td>
                  <td class="table-cell">{{ shipment.number_shipment || 'N/A' }}</td>
                  <td class="table-cell">{{ shipment.country_code || 'N/A' }}</td>
                  <td class="table-cell">{{ shipment.shipper_name || 'N/A' }}</td>
                  <td class="table-cell">{{ shipment.shipper_city || 'N/A' }}</td>
                  <td class="table-cell">{{ shipment.shipper_phone || 'N/A' }}</td>
                  <td class="table-cell">{{ shipment.shipper_address || 'N/A' }}</td>
                  <td class="table-cell">{{ shipment.consignee_name || 'N/A' }}</td>
                  <td class="table-cell">{{ shipment.consignee_city || 'N/A' }}</td>
                  <td class="table-cell">{{ shipment.consignee_phone || 'N/A' }}</td>
                  <td class="table-cell">{{ shipment.consignee_address || 'N/A' }}</td>
                  <td class="table-cell">{{ shipment.shipment_reference_number || 'N/A' }}</td>
                  <td class="table-cell">{{ formatDate(shipment.shipment_creation_date) }}</td>
                  <td class="table-cell">{{ shipment.cod || 'N/A' }}</td>
                  <td class="table-cell">{{ shipment.shipment_weight || 'N/A' }}</td>
                  <td class="table-cell">{{ shipment.number_of_shipment_boxes || 'N/A' }}</td>
                  <td class="table-cell">{{ shipment.shipment_description || 'N/A' }}</td>
                  <td class="table-cell">{{ shipment.pdf_filename || 'N/A' }}</td>
                  <td class="table-cell">{{ formatDate(shipment.processing_date) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="pagination" class="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-lg">
            <div class="text-sm text-gray-700 font-english">
              Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to 
              {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of 
              {{ pagination.total }} search results
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600 font-english">
                Page {{ pagination.page }} of {{ pagination.total_pages }}
              </span>
              
              <!-- Direct page navigation -->
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-600 font-english">Go to:</span>
                <input
                  v-model.number="pageInput"
                  type="number"
                  :min="1"
                  :max="pagination.total_pages"
                  class="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  @keyup.enter="goToPage"
                />
                <button
                  @click="goToPage"
                  class="btn-secondary px-3 py-1 text-sm"
                >
                  Go
                </button>
              </div>
              
              <div class="flex space-x-2">
                <button
                  @click="() => loadPage(1)"
                  :disabled="!pagination.has_prev"
                  class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 text-sm"
                  title="First Page"
                >
                  ⏮️ First
                </button>
                <button
                  @click="() => loadPage(pagination.page - 1)"
                  :disabled="!pagination.has_prev"
                  class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
                >
                  ← {{ $t('common.previous') }}
                </button>
                <button
                  @click="() => loadPage(pagination.page + 1)"
                  :disabled="!pagination.has_next"
                  class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
                >
                  {{ $t('common.next') }} →
                </button>
                <button
                  @click="() => loadPage(pagination.total_pages)"
                  :disabled="!pagination.has_next"
                  class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 text-sm"
                  title="Last Page"
                >
                  Last ⏭️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { shippingAPI } from '../services/api'
import { format } from 'date-fns'

const loading = ref(false)
const searchPerformed = ref(false)
const results = ref([])
const pagination = ref(null)
const error = ref('')
const pageInput = ref(1)

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
    // Handle different date formats
    if (typeof dateString === 'string' && dateString.includes('-')) {
      // Handle "DD-MMM-YY" format
      if (dateString.match(/^\d{2}-[A-Za-z]{3}-\d{2}$/)) {
        const [day, month, year] = dateString.split('-')
        const monthMap = {
          'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
          'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
          'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        }
        const fullYear = '20' + year
        const monthNum = monthMap[month] || '01'
        const isoDate = `${fullYear}-${monthNum}-${day}`
        return format(new Date(isoDate), 'MMM dd, yyyy')
      }
    }
    // Handle standard date formats
    return format(new Date(dateString), 'MMM dd, yyyy')
  } catch {
    return dateString || 'N/A'
  }
}

const performSearch = async (page = 1) => {
  try {
    loading.value = true
    error.value = ''
    searchPerformed.value = true
    
    const params = {
      page: page,
      limit: 20
    }
    
    if (searchForm.value.fromCity) params.from_city = searchForm.value.fromCity
    if (searchForm.value.toCity) params.to_city = searchForm.value.toCity
    if (searchForm.value.shipperName) params.shipper_name = searchForm.value.shipperName
    if (searchForm.value.consigneeName) params.consignee_name = searchForm.value.consigneeName
    if (searchForm.value.minWeight) params.min_weight = searchForm.value.minWeight
    if (searchForm.value.dateFilter) params.date_filter = searchForm.value.dateFilter
    
    console.log('🔍 Advanced search with params:', params)
    const response = await shippingAPI.advancedSearch(params)
    console.log('✅ Advanced search response:', response)
    
    results.value = response.data || []
    pagination.value = response.pagination || null
    
    // Update page input to match current page
    if (pagination.value) {
      pageInput.value = pagination.value.page
    }
  } catch (err) {
    console.error('❌ Error performing search:', err)
    error.value = err.message || 'Error performing search'
  } finally {
    loading.value = false
  }
}

const loadPage = (page) => {
  console.log('🔍 loadPage called with:', page, 'type:', typeof page)
  
  // Ensure page is a number
  const pageNumber = parseInt(page)
  if (isNaN(pageNumber) || pageNumber < 1) {
    console.error('❌ Invalid page number:', page)
    return
  }
  
  performSearch(pageNumber)
}

const goToPage = () => {
  if (pageInput.value && pageInput.value >= 1 && pageInput.value <= pagination.value?.total_pages) {
    loadPage(pageInput.value)
  }
}

// Watch pagination changes to update pageInput
watch(pagination, (newPagination) => {
  if (newPagination) {
    pageInput.value = newPagination.page
  }
}, { deep: true })

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
  pagination.value = null
  searchPerformed.value = false
  error.value = ''
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
      link.href = `http://136.243.133.165${response.download_url}`
      link.download = response.filename
      link.click()
    }
  } catch (error) {
    console.error('Error exporting results:', error)
  }
}
</script>
