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

      <!-- My Saved Searches -->
      <div v-if="savedSearches.length > 0" class="card mb-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 font-english flex items-center">
            ⭐ My Saved Searches
          </h3>
          <button @click="showSavedSearches = !showSavedSearches" class="btn-secondary text-sm">
            {{ showSavedSearches ? 'Hide' : 'Show' }}
          </button>
        </div>
        
        <div v-if="showSavedSearches" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="search in savedSearches" :key="search.id" class="border border-gray-200 rounded-lg p-4 bg-white">
            <h4 class="font-medium text-gray-900 mb-2">{{ search.title }}</h4>
            <p v-if="search.description" class="text-sm text-gray-600 mb-2">{{ search.description }}</p>
            <p class="text-xs text-gray-500 mb-3">
              Last used: {{ formatDate(search.last_used_at) }} • Used {{ search.usage_count }} times
            </p>
            <div class="flex space-x-2">
              <button @click="applySavedSearch(search)" class="btn-primary text-xs px-3 py-1">
                Apply
              </button>
              <button @click="editSavedSearch(search)" class="btn-secondary text-xs px-3 py-1">
                Edit
              </button>
              <button @click="deleteSavedSearch(search.id)" class="btn-danger text-xs px-3 py-1">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Form -->
      <div class="card mb-6">
        <div v-if="showFilters">
        <!-- Section 1: Shipment Information -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              📦 Shipment Information
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
                  Reference Number
                </label>
                <input
                  v-model="searchForm.referenceNumber"
                  type="text"
                  class="input-field"
                  placeholder="Enter reference number"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
                  Shipment Description
                </label>
                <input
                  v-model="searchForm.description"
                  type="text"
                  class="input-field"
                  placeholder="Enter description"
                />
              </div>
            </div>
          </div>

          <!-- Section 2: Dates -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              📅 Dates
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
                  Creation Date From
                </label>
                <input
                  v-model="searchForm.creationDateFrom"
                  type="date"
                  class="input-field"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
                  Creation Date To
                </label>
                <input
                  v-model="searchForm.creationDateTo"
                  type="date"
                  class="input-field"
                />
              </div>
            </div>
          </div>

          <!-- Section 3: Weight and Payment -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              ⚖️ Weight and Payment
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
                  Minimum Weight (kg)
                </label>
                <input
                  v-model="searchForm.minWeight"
                  type="number"
                  step="0.1"
                  class="input-field"
                  placeholder="Enter minimum weight"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
                  Maximum Weight (kg)
                </label>
                <input
                  v-model="searchForm.maxWeight"
                  type="number"
                  step="0.1"
                  class="input-field"
                  placeholder="Enter maximum weight"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
                  Cash on Delivery (COD)
                </label>
                <select v-model="searchForm.cod" class="input-field">
                  <option value="">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Section 4: Shipper Data -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              👤 Shipper Data
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
                  Shipper Name
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
                  Shipper City
                </label>
                <input
                  v-model="searchForm.shipperCity"
                  type="text"
                  class="input-field"
                  placeholder="Enter shipper city"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
                  Shipper Phone
                </label>
                <input
                  v-model="searchForm.shipperPhone"
                  type="text"
                  class="input-field"
                  placeholder="Enter phone number (partial search)"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
                  Shipper Address
                </label>
                <input
                  v-model="searchForm.shipperAddress"
                  type="text"
                  class="input-field"
                  placeholder="Enter shipper address"
                />
              </div>
            </div>
          </div>

          <!-- Section 5: Consignee Data -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              👥 Consignee Data
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
                  Consignee Name
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
                  Consignee City
                </label>
                <input
                  v-model="searchForm.consigneeCity"
                  type="text"
                  class="input-field"
                  placeholder="Enter consignee city"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
                  Consignee Phone
                </label>
                <input
                  v-model="searchForm.consigneePhone"
                  type="text"
                  class="input-field"
                  placeholder="Enter phone number (partial search)"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
                  Consignee Address
                </label>
                <input
                  v-model="searchForm.consigneeAddress"
                  type="text"
                  class="input-field"
                  placeholder="Enter consignee address"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-4 mt-6">
          <button @click="showFilters = !showFilters" class="btn-secondary text-sm">
                {{ showFilters ? 'Hide' : 'Show' }} Filters
          </button>
          <button v-if="showFilters" @click="() => clearForm()" class="btn-secondary">
            {{ $t('search.clear') }}
          </button>
          <button v-if="showFilters" @click="() => saveSearch()" class="btn-warning">
            ⭐ Save Search
          </button>
          <button v-if="showFilters" @click="() => performSearch()" class="btn-primary">
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
          <div class="flex items-center space-x-2">
            <div class="relative">
              <button @click="showColumnsMenu = !showColumnsMenu" class="btn-secondary">
                Columns
              </button>
              <div v-if="showColumnsMenu" class="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded shadow-lg p-3 z-10">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium">Select Columns</span>
                  <button @click="showColumnsMenu = false" class="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                <div class="grid grid-cols-2 gap-2 max-h-64 overflow-auto">
                  <label v-for="col in allColumns" :key="col.key" class="flex items-center space-x-2 text-sm">
                    <input type="checkbox" v-model="selectedColumnKeys" :value="col.key" />
                    <span>{{ col.label }}</span>
                  </label>
                </div>
                <div class="flex justify-between mt-3">
                  <button @click="selectAllColumns" class="btn-secondary text-xs px-2 py-1">Select All</button>
                  <button @click="clearAllColumns" class="btn-secondary text-xs px-2 py-1">Clear</button>
                </div>
                <div class="mt-2">
                  <button @click="resetToDefaultColumns" class="btn-secondary text-xs px-2 py-1 w-full">Reset to Default</button>
                </div>
              </div>
            </div>
            <button v-if="results.length > 0" :disabled="visibleColumns.length === 0" @click="exportResults" class="btn-success disabled:opacity-50 disabled:cursor-not-allowed">
              {{ $t('common.export') }}
            </button>
          </div>
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
            <p>📊 Showing {{ visibleColumns.length }} selected columns. Scroll horizontally to view all data.</p>
            <p v-if="pagination" class="text-primary-600 font-medium">
              🔍 Search Results: {{ pagination.total }} results found
            </p>
          </div>
          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="min-w-full divide-y divide-gray-200" style="min-width: 2000px;">
              <thead class="bg-gray-50">
                <tr>
                  <th 
                    v-for="col in visibleColumns" 
                    :key="col.key" 
                    :class="[
                      'table-header cursor-pointer hover:bg-gray-100 select-none transition-colors',
                      sortColumn.value === col.key ? 'bg-primary-50 text-primary-700' : ''
                    ]"
                    @click="handleSort(col.key)"
                  >
                    <div class="flex items-center justify-between">
                      <span class="font-medium">{{ col.label }}</span>
                      <span class="ml-2 text-sm font-bold">{{ getSortIcon(col.key) }}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="shipment in results" :key="shipment.id" class="hover:bg-gray-50">
                  <td v-for="col in visibleColumns" :key="col.key" :class="['table-cell', col.key === 'id' ? 'font-medium text-primary-600' : '']">
                    {{ col.formatter ? col.formatter(shipment[col.key]) : (shipment[col.key] || 'N/A') }}
                  </td>
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

    <!-- Save Search Modal -->
    <div v-if="showSaveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Save Search</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Search Title *</label>
            <input
              v-model="saveSearchForm.title"
              type="text"
              class="input-field"
              placeholder="Enter search title"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
            <textarea
              v-model="saveSearchForm.description"
              class="input-field"
              rows="3"
              placeholder="Enter description"
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button @click="showSaveModal = false" class="btn-secondary">Cancel</button>
          <button @click="confirmSaveSearch" class="btn-primary">Save</button>
        </div>
      </div>
    </div>

    <!-- Edit Search Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Edit Search</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Search Title *</label>
            <input
              v-model="saveSearchForm.title"
              type="text"
              class="input-field"
              placeholder="Enter search title"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
            <textarea
              v-model="saveSearchForm.description"
              class="input-field"
              rows="3"
              placeholder="Enter description"
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button @click="showEditModal = false" class="btn-secondary">Cancel</button>
          <button @click="confirmEditSearch" class="btn-primary">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { shippingAPI } from '../services/api'
import { format } from 'date-fns'

const loading = ref(false)
const searchPerformed = ref(false)
const results = ref([])
const pagination = ref(null)
const error = ref('')
const pageInput = ref(1)
const savedSearches = ref([])
const showSavedSearches = ref(true)
const showFilters = ref(true)
const showSaveModal = ref(false)
const showEditModal = ref(false)
const editingSearch = ref(null)

// Column selection state
const showColumnsMenu = ref(false)

// Sorting state
const sortColumn = ref('')
const sortDirection = ref('') // 'asc', 'desc', or ''

const allColumns = ref([
  { key: 'id', label: 'ID' },
  { key: 'number_shipment', label: 'Shipment Number' },
  { key: 'country_code', label: 'Country Code' },
  { key: 'shipper_name', label: 'Shipper Name' },
  { key: 'shipper_city', label: 'Shipper City' },
  { key: 'shipper_phone', label: 'Shipper Phone' },
  { key: 'shipper_address', label: 'Shipper Address' },
  { key: 'consignee_name', label: 'Consignee Name' },
  { key: 'consignee_city', label: 'Consignee City' },
  { key: 'consignee_phone', label: 'Consignee Phone' },
  { key: 'consignee_address', label: 'Consignee Address' },
  { key: 'shipment_reference_number', label: 'Reference Number' },
  { key: 'shipment_creation_date', label: 'Creation Date', formatter: (v) => formatDate(v) },
  { key: 'cod_cash_on_delivery', label: 'COD' },
  { key: 'shipment_weight', label: 'Weight' },
  { key: 'number_of_shipment_boxes', label: 'Boxes' },
  { key: 'shipment_description', label: 'Description' },
  { key: 'pdf_filename', label: 'PDF Filename' },
  { key: 'processing_date', label: 'Processing Date', formatter: (v) => formatDate(v) }
])
// Load saved column selection from localStorage, default to all columns
const getSavedColumnSelection = () => {
  try {
    const saved = localStorage.getItem('search-column-selection')
    if (saved) {
      const savedKeys = JSON.parse(saved)
      // Validate that all saved keys still exist in allColumns
      const validKeys = savedKeys.filter(key => allColumns.value.some(col => col.key === key))
      return validKeys.length > 0 ? validKeys : allColumns.value.map(c => c.key)
    }
  } catch (error) {
    console.warn('Error loading saved column selection:', error)
  }
  return allColumns.value.map(c => c.key)
}

const selectedColumnKeys = ref(getSavedColumnSelection())
const visibleColumns = computed(() => allColumns.value.filter(c => selectedColumnKeys.value.includes(c.key)))

// Save column selection to localStorage
const saveColumnSelection = () => {
  try {
    localStorage.setItem('search-column-selection', JSON.stringify(selectedColumnKeys.value))
  } catch (error) {
    console.warn('Error saving column selection:', error)
  }
}

// Watch for changes in selectedColumnKeys and save to localStorage
watch(selectedColumnKeys, () => {
  saveColumnSelection()
}, { deep: true })

const selectAllColumns = () => {
  selectedColumnKeys.value = allColumns.value.map(c => c.key)
}
const clearAllColumns = () => {
  selectedColumnKeys.value = []
}
const resetToDefaultColumns = () => {
  // Reset to all columns and clear localStorage
  selectedColumnKeys.value = allColumns.value.map(c => c.key)
  try {
    localStorage.removeItem('search-column-selection')
  } catch (error) {
    console.warn('Error clearing saved column selection:', error)
  }
}

// Sorting functions
const handleSort = (columnKey) => {
  if (sortColumn.value === columnKey) {
    // Cycle through: asc -> desc -> default
    if (sortDirection.value === 'asc') {
      sortDirection.value = 'desc'
    } else if (sortDirection.value === 'desc') {
      sortDirection.value = ''
      sortColumn.value = ''
    } else {
      sortDirection.value = 'asc'
    }
  } else {
    // New column, start with ascending
    sortColumn.value = columnKey
    sortDirection.value = 'asc'
  }
  
  // Apply sorting to results
  sortResults()
}

const sortResults = () => {
  if (!sortColumn.value || !sortDirection.value) {
    return // No sorting applied
  }
  
  results.value.sort((a, b) => {
    let aVal = a[sortColumn.value]
    let bVal = b[sortColumn.value]
    
    // Handle null/undefined values
    if (aVal === null || aVal === undefined || aVal === '') aVal = ''
    if (bVal === null || bVal === undefined || bVal === '') bVal = ''
    
    // Handle numeric values
    const aNum = parseFloat(aVal)
    const bNum = parseFloat(bVal)
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return sortDirection.value === 'asc' ? aNum - bNum : bNum - aNum
    }
    
    // Handle date values (for creation_date and processing_date)
    if (sortColumn.value === 'shipment_creation_date' || sortColumn.value === 'processing_date') {
      const aDate = new Date(aVal)
      const bDate = new Date(bVal)
      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        return sortDirection.value === 'asc' ? aDate - bDate : bDate - aDate
      }
    }
    
    // Handle string values
    const aStr = String(aVal).toLowerCase()
    const bStr = String(bVal).toLowerCase()
    
    if (sortDirection.value === 'asc') {
      return aStr.localeCompare(bStr)
    } else {
      return bStr.localeCompare(aStr)
    }
  })
}

const getSortIcon = (columnKey) => {
  if (sortColumn.value !== columnKey) {
    return '↕️' // Default sort icon
  }
  
  switch (sortDirection.value) {
    case 'asc':
      return '↑' // Ascending
    case 'desc':
      return '↓' // Descending
    default:
      return '↕️' // Default
  }
}

const searchForm = ref({
  // Shipment Information
  referenceNumber: '',
  description: '',
  
  // Dates
  creationDateFrom: '',
  creationDateTo: '',
  
  // Weight and Payment
  minWeight: '',
  maxWeight: '',
  cod: '',
  
  // Shipper Data
  shipperName: '',
  shipperCity: '',
  shipperPhone: '',
  shipperAddress: '',
  
  // Consignee Data
  consigneeName: '',
  consigneeCity: '',
  consigneePhone: '',
  consigneeAddress: ''
})

const saveSearchForm = ref({
  title: '',
  description: ''
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
        return format(new Date(isoDate), 'dd-MM-yyyy')
      }
    }
    // Handle standard date formats
    return format(new Date(dateString), 'dd-MM-yyyy')
  } catch {
    return dateString || 'N/A'
  }
}

const validateSearchForm = () => {
  // Check if at least one field is filled
  const hasAnyValue = Object.values(searchForm.value).some(value => 
    value !== null && value !== undefined && value !== ''
  )
  
  if (!hasAnyValue) {
    error.value = 'Please fill at least one search field before searching.'
    return false
  }
  
  // Validate date ranges
  if (searchForm.value.creationDateFrom && searchForm.value.creationDateTo) {
    if (new Date(searchForm.value.creationDateFrom) > new Date(searchForm.value.creationDateTo)) {
      error.value = 'Creation Date From must be earlier than or equal to Creation Date To.'
      return false
    }
  }
  
  
  // Validate weight range
  if (searchForm.value.minWeight && searchForm.value.maxWeight) {
    if (parseFloat(searchForm.value.minWeight) > parseFloat(searchForm.value.maxWeight)) {
      error.value = 'Minimum weight must be less than or equal to maximum weight.'
      return false
    }
  }
  
  return true
}

const performSearch = async (page = 1) => {
  if (!validateSearchForm()) {
    return
  }
  
  try {
    loading.value = true
    error.value = ''
    searchPerformed.value = true
    
    const params = {
      page: page,
      limit: 20
    }
    
    // Shipment Information
    if (searchForm.value.referenceNumber) params.reference_number = searchForm.value.referenceNumber
    if (searchForm.value.description) params.description = searchForm.value.description
    
    // Dates
    if (searchForm.value.creationDateFrom) params.creation_date_from = searchForm.value.creationDateFrom
    if (searchForm.value.creationDateTo) params.creation_date_to = searchForm.value.creationDateTo
    
    // Weight and Payment
    if (searchForm.value.minWeight !== '' && searchForm.value.minWeight !== null && searchForm.value.minWeight !== undefined) {
      params.min_weight = searchForm.value.minWeight
    }
    if (searchForm.value.maxWeight !== '' && searchForm.value.maxWeight !== null && searchForm.value.maxWeight !== undefined) {
      params.max_weight = searchForm.value.maxWeight
    }
    if (searchForm.value.cod) {
      params.cod = searchForm.value.cod
    }
    
    // Shipper Data
    if (searchForm.value.shipperName) params.shipper_name = searchForm.value.shipperName
    if (searchForm.value.shipperCity) params.shipper_city = searchForm.value.shipperCity
    if (searchForm.value.shipperPhone) params.shipper_phone = searchForm.value.shipperPhone
    if (searchForm.value.shipperAddress) params.shipper_address = searchForm.value.shipperAddress
    
    // Consignee Data
    if (searchForm.value.consigneeName) params.consignee_name = searchForm.value.consigneeName
    if (searchForm.value.consigneeCity) params.consignee_city = searchForm.value.consigneeCity
    if (searchForm.value.consigneePhone) params.consignee_phone = searchForm.value.consigneePhone
    if (searchForm.value.consigneeAddress) params.consignee_address = searchForm.value.consigneeAddress
    
    console.log('🔍 Advanced search with params:', params)
    const response = await shippingAPI.advancedSearch(params)
    console.log('✅ Advanced search response:', response)
    
    results.value = response.data || []
    pagination.value = response.pagination || null
    showFilters.value = false
    
    // Reset sorting when new results are loaded
    sortColumn.value = ''
    sortDirection.value = ''
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
    // Shipment Information
    referenceNumber: '',
    description: '',
    
    // Dates
    creationDateFrom: '',
    creationDateTo: '',
    
    // Weight and Payment
    minWeight: '',
    maxWeight: '',
    cod: '',
    
    // Shipper Data
    shipperName: '',
    shipperCity: '',
    shipperPhone: '',
    shipperAddress: '',
    
    // Consignee Data
    consigneeName: '',
    consigneeCity: '',
    consigneePhone: '',
    consigneeAddress: ''
  }
  results.value = []
  pagination.value = null
  searchPerformed.value = false
  error.value = ''
}

// Saved Searches Functions
const loadSavedSearches = async () => {
  try {
    const response = await shippingAPI.getSavedSearches()
    savedSearches.value = response.data || []
  } catch (err) {
    console.error('Error loading saved searches:', err)
  }
}

const saveSearch = () => {
  if (!validateSearchForm()) {
    return
  }
  showSaveModal.value = true
}

const confirmSaveSearch = async () => {
  try {
    const searchData = {
      title: saveSearchForm.value.title,
      description: saveSearchForm.value.description,
      filters: { ...searchForm.value }
    }
    
    const response = await shippingAPI.saveSearch(searchData)
    if (response.success) {
      showSaveModal.value = false
      saveSearchForm.value = { title: '', description: '' }
      await loadSavedSearches()
      // Show success message
    }
  } catch (err) {
    console.error('Error saving search:', err)
    error.value = err.message || 'Error saving search'
  }
}

const applySavedSearch = async (search) => {
  try {
    // Fill form with saved filters
    searchForm.value = { ...search.filters }
    
    // Update usage count
    await shippingAPI.updateSearchUsage(search.id)
    
    // Perform search automatically
    await performSearch()
    
    // Reload saved searches to update usage count
    await loadSavedSearches()
  } catch (err) {
    console.error('Error applying saved search:', err)
    error.value = err.message || 'Error applying saved search'
  }
}

const editSavedSearch = (search) => {
  editingSearch.value = search
  searchForm.value = { ...search.filters }
  saveSearchForm.value = {
    title: search.title,
    description: search.description || ''
  }
  showEditModal.value = true
}

const confirmEditSearch = async () => {
  try {
    const searchData = {
      title: saveSearchForm.value.title,
      description: saveSearchForm.value.description,
      filters: { ...searchForm.value }
    }
    
    const response = await shippingAPI.updateSavedSearch(editingSearch.value.id, searchData)
    if (response.success) {
      showEditModal.value = false
      editingSearch.value = null
      saveSearchForm.value = { title: '', description: '' }
      await loadSavedSearches()
    }
  } catch (err) {
    console.error('Error updating saved search:', err)
    error.value = err.message || 'Error updating saved search'
  }
}

const deleteSavedSearch = async (searchId) => {
  if (confirm('Are you sure you want to delete this saved search?')) {
    try {
      const response = await shippingAPI.deleteSavedSearch(searchId)
      if (response.success) {
        await loadSavedSearches()
      }
    } catch (err) {
      console.error('Error deleting saved search:', err)
      error.value = err.message || 'Error deleting saved search'
    }
  }
}

const exportResults = async () => {
  if (results.value.length === 0) return
  
  try {
    // Build export rows with only selected columns, preserving order
    const columns = visibleColumns.value
    const dataToExport = results.value.map(row => {
      const obj = {}
      columns.forEach(col => {
        obj[col.key] = row[col.key] ?? ''
      })
      return obj
    })
    const response = await shippingAPI.exportData({ format: 'csv', data: dataToExport })
    
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

// Load saved searches on component mount
onMounted(() => {
  loadSavedSearches()
})
</script>
