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
              <option value="number_shipment">Shipment Number</option>
              <option value="country_code">Country Code</option>
              <option value="shipment_weight">Weight</option>
              <option value="shipment_creation_date">Creation Date</option>
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
           <div class="flex items-end space-x-2">
             <button @click="() => searchShipments()" class="btn-primary flex-1">
               {{ $t('common.search') }}
             </button>
             <button 
               v-if="searchQuery.trim()" 
               @click="() => clearSearch()" 
               class="btn-secondary px-4"
               title="Clear search and show all shipments"
             >
               ✕
             </button>
           </div>
        </div>
      </div>

      <!-- Shipments Table -->
      <div class="card">
        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="loading-spinner"></div>
        </div>
        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-500 font-english">❌ {{ error }}</p>
          <button @click="() => { error = ''; loadShipments() }" class="btn-primary mt-4">
            Try Again
          </button>
        </div>
        <div v-else-if="shipments.length === 0" class="text-center py-12">
          <p class="text-gray-500 font-english">{{ $t('shipments.noResults') }}</p>
        </div>
         <div v-else>
           <div class="mb-4 text-sm text-gray-600 font-english">
             <p>📊 Showing all shipment columns. Scroll horizontally to view all data.</p>
             <p v-if="searchQuery.trim()" class="text-primary-600 font-medium">
               🔍 Search Results: {{ pagination?.total || 0 }} results found for "{{ searchQuery }}" in {{ filterColumn }}
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
                <tr v-for="shipment in shipments" :key="shipment.id" class="hover:bg-gray-50">
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
           <div v-if="pagination" class="flex items-center justify-between mt-6">
             <div class="text-sm text-gray-700 font-english">
               <span v-if="isSearching">
                 Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to 
                 {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of 
                 {{ pagination.total }} search results
               </span>
               <span v-else>
                 Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to 
                 {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of 
                 {{ pagination.total }} shipments
               </span>
             </div>
             <div class="flex items-center space-x-4">
               <span class="text-sm text-gray-600 font-english">
                 Page {{ pagination.page }} of {{ pagination.total_pages }}
               </span>
               <div class="flex space-x-2">
                 <button
                   @click="() => loadPage(pagination.page - 1)"
                   :disabled="!pagination.has_prev"
                   class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {{ $t('common.previous') }}
                 </button>
                 <button
                   @click="() => loadPage(pagination.page + 1)"
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
const isSearching = ref(false)
const error = ref('')

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

const loadShipments = async (page = 1) => {
  try {
    loading.value = true
    error.value = ''
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
  } catch (err) {
    console.error('Error loading shipments:', err)
    error.value = err.message || 'Error loading shipments'
  } finally {
    loading.value = false
  }
}

const searchShipments = async (page = 1) => {
  console.log('🔍 searchShipments called with page:', page, 'type:', typeof page)
  
  if (!searchQuery.value.trim()) {
    console.log('❌ No search query, loading all shipments')
    isSearching.value = false
    loadShipments()
    return
  }
  
  try {
    loading.value = true
    error.value = ''
    isSearching.value = true
    
    // Ensure page is a number
    const pageNumber = parseInt(page)
    if (isNaN(pageNumber) || pageNumber < 1) {
      console.error('❌ Invalid page number in search:', page)
      error.value = 'Invalid page number'
      return
    }
    
    const params = {
      column: filterColumn.value,
      value: searchQuery.value,
      page: pageNumber,
      limit: 20
    }
    
    if (dateFilter.value) {
      params.date_filter = dateFilter.value
    }
    
    console.log('🔍 Searching with params:', params)
    console.log('🔍 API URL will be:', `/shipments/filter?${new URLSearchParams(params)}`)
    
    const response = await shippingAPI.filterShipments(params)
    console.log('✅ Search response:', response)
    shipments.value = response.data || []
    pagination.value = response.pagination || null
  } catch (err) {
    console.error('❌ Error searching shipments:', err)
    error.value = err.message || 'Error searching shipments'
  } finally {
    loading.value = false
  }
}

const loadPage = (page) => {
  console.log('loadPage called with:', page, 'type:', typeof page)
  
  // Ensure page is a number
  const pageNumber = parseInt(page)
  if (isNaN(pageNumber) || pageNumber < 1) {
    console.error('Invalid page number:', page)
    return
  }
  
  if (searchQuery.value.trim()) {
    // If searching, reload search results with pagination
    searchShipments(pageNumber)
  } else {
    // If not searching, load normal paginated results
    loadShipments(pageNumber)
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  isSearching.value = false
  loadShipments()
}

onMounted(() => {
  loadShipments()
})
</script>
