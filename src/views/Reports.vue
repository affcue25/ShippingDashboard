<template>
  <div class="min-h-screen bg-gray-50">
    <div class="px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 font-english">
          {{ $t('reports.title') }}
        </h1>
        <p class="mt-2 text-gray-600 font-english">
          Create, manage, and run custom reports
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4">
        <button 
          @click="showCreateModal = true"
          class="btn-primary flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Create New Report
        </button>
        <button 
          @click="loadTemplates"
          class="btn-secondary flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          Browse Templates
        </button>
        <button 
          @click="loadReports"
          class="btn-secondary flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Refresh
        </button>
      </div>

      <!-- Reports Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div 
          v-for="report in reports" 
          :key="report.id"
          class="card hover:shadow-lg transition-shadow cursor-pointer"
          @click="viewReport(report)"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 font-english">
                {{ report.report_name || report.title }}
              </h3>
              <p class="text-sm text-gray-600 font-english mt-1">
                {{ report.description || 'No description' }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <span 
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  report.report_type === 'summary' ? 'bg-blue-100 text-blue-800' :
                  report.report_type === 'analytics' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                ]"
              >
                {{ report.report_type }}
              </span>
              <div class="relative">
                <button 
                  @click.stop="showReportMenu(report)"
                  class="p-1 text-gray-400 hover:text-gray-600"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                  </svg>
                </button>
                <div 
                  v-if="activeReportMenu === report.id"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border"
                >
                  <div class="py-1">
                    <button 
                      @click="runReport(report)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Run Report
                    </button>
                    <button 
                      @click="editReport(report)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button 
                      @click="duplicateReport(report)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Duplicate
                    </button>
                    <button 
                      @click="deleteReport(report)"
                      class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex items-center justify-between text-sm text-gray-500">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                {{ report.execution_count || report.run_count || 0 }} runs
              </span>
              <span v-if="report.last_executed || report.last_run_at" class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ formatDate(report.last_executed || report.last_run_at) }}
              </span>
            </div>
            <span class="text-xs">
              {{ formatDate(report.created_at) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="reports.length === 0 && !loading" class="card text-center py-16">
        <div class="mx-auto w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6">
          <svg class="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2 font-english">
          No Reports Yet
        </h3>
        <p class="text-gray-600 font-english mb-6">
          Create your first custom report to get started with data analysis.
        </p>
        <button 
          @click="showCreateModal = true"
          class="btn-primary"
        >
          Create Your First Report
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="card text-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-gray-600 font-english">Loading reports...</p>
      </div>
    </div>

    <!-- Create/Edit Report Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 font-english">
              {{ showEditModal ? 'Edit Report' : 'Create New Report' }}
            </h3>
            <button 
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveReport" class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
                  Report Name *
                </label>
                <input 
                  v-model="reportForm.report_name"
                  type="text" 
                  required
                  class="input-field"
                  placeholder="Enter report name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
                  Report Type
                </label>
                <select v-model="reportForm.report_type" class="input-field">
                  <option value="custom">Custom</option>
                  <option value="summary">Summary</option>
                  <option value="analytics">Analytics</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
                Description
              </label>
              <textarea 
                v-model="reportForm.description"
                class="input-field"
                rows="3"
                placeholder="Enter report description"
              ></textarea>
            </div>

            <!-- Filters -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
                Filters
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-600 mb-1 font-english">Date Filter</label>
                  <select v-model="reportForm.filters.date_filter" class="input-field">
                    <option value="">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
                    <div>
                      <label class="block text-sm text-gray-600 mb-1 font-english">Shipper Name</label>
                      <input 
                        v-model="reportForm.filters.shipper_name"
                        type="text" 
                        class="input-field"
                        placeholder="Filter by shipper name"
                      />
                    </div>
                    <div>
                      <label class="block text-sm text-gray-600 mb-1 font-english">Consignee Name</label>
                      <input 
                        v-model="reportForm.filters.consignee_name"
                        type="text" 
                        class="input-field"
                        placeholder="Filter by consignee name"
                      />
                    </div>
                    <div>
                      <label class="block text-sm text-gray-600 mb-1 font-english">Shipper City</label>
                      <input 
                        v-model="reportForm.filters.shipper_city"
                        type="text" 
                        class="input-field"
                        placeholder="Filter by shipper city"
                      />
                    </div>
                    <div>
                      <label class="block text-sm text-gray-600 mb-1 font-english">Consignee City</label>
                      <input 
                        v-model="reportForm.filters.consignee_city"
                        type="text" 
                        class="input-field"
                        placeholder="Filter by consignee city"
                      />
                    </div>
              </div>
            </div>

            <!-- Columns -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
                Select Columns to Display
              </label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                <label 
                  v-for="column in availableColumns" 
                  :key="column.key"
                  class="flex items-center space-x-2 text-sm"
                >
                  <input 
                    type="checkbox" 
                    :value="column.key"
                    v-model="reportForm.columns"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="font-english">{{ column.label }}</span>
                </label>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-4 border-t">
              <button 
                type="button"
                @click="closeModal"
                class="btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit"
                :disabled="loading"
                class="btn-primary"
              >
                {{ loading ? 'Saving...' : (showEditModal ? 'Update Report' : 'Create Report') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Report Results Modal -->
    <div v-if="showResultsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 font-english">
              {{ currentReport?.report_name || currentReport?.title }} - Results
        </h3>
            <div class="flex items-center gap-2">
              <div class="relative">
                <button 
                  @click="showExportMenu = !showExportMenu"
                  :disabled="exporting"
                  class="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="!exporting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <div v-else class="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  {{ exporting ? 'Exporting...' : 'Export' }}
                  <svg v-if="!exporting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div 
                  v-if="showExportMenu"
                  class="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border"
                >
                  <div class="py-1">
                    <button 
                      @click="exportResults('csv')"
                      :disabled="exporting"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Export CSV
                    </button>
                    <button 
                      @click="exportResults('pdf')"
                      :disabled="exporting"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Export PDF
                    </button>
                  </div>
                </div>
              </div>
              <button 
                @click="showResultsModal = false"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Results Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th 
                    v-for="column in visibleColumns" 
                    :key="column.key"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-english"
                  >
                    {{ column.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(row, index) in reportResults" :key="index">
                  <td 
                    v-for="column in visibleColumns" 
                    :key="column.key"
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {{ formatCellValue(row[column.key], column.key) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Results Summary -->
          <div class="mt-4 p-4 bg-gray-50 rounded-md">
            <p class="text-sm text-gray-600 font-english">
              Showing {{ reportResults.length }} results
              <span v-if="reportResults.length >= 1000" class="text-yellow-600">
                (Limited to 1000 records)
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Templates Modal -->
    <div v-if="showTemplatesModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 font-english">
              Report Templates
            </h3>
            <button 
              @click="showTemplatesModal = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="template in templates" 
              :key="template.id"
              class="card hover:shadow-lg transition-shadow cursor-pointer"
              @click="useTemplate(template)"
            >
              <div class="flex items-start justify-between mb-2">
                <h4 class="text-lg font-semibold text-gray-900 font-english flex-1">
                  {{ template.report_name || template.title }}
                </h4>
                <div class="flex items-center gap-2">
                  <!-- Parameter indicator -->
                  <div 
                    v-if="template.parameters?.required_params && Object.keys(template.parameters.required_params).length > 0"
                    class="flex items-center gap-1 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full"
                    title="This template requires parameters"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Parameters
                  </div>
                  <!-- Report type badge -->
                  <span 
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      (template.parameters?.report_type || template.report_type) === 'summary' ? 'bg-blue-100 text-blue-800' :
                      (template.parameters?.report_type || template.report_type) === 'analytics' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ template.parameters?.report_type || template.report_type }}
                  </span>
                </div>
              </div>
              
              <p class="text-sm text-gray-600 font-english mb-3">
                {{ template.description }}
              </p>
              
              <!-- Show required parameters if any -->
              <div 
                v-if="template.parameters?.required_params && Object.keys(template.parameters.required_params).length > 0"
                class="mb-3"
              >
                <p class="text-xs text-gray-500 font-english mb-1">Required Parameters:</p>
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="(defaultValue, paramName) in template.parameters.required_params"
                    :key="paramName"
                    class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {{ formatParameterLabel(paramName) }}
                  </span>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500 font-english">
                  {{ template.parameters?.columns?.length || 0 }} columns
                </div>
                <button 
                  @click.stop="useTemplate(template)"
                  class="btn-primary text-sm"
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Parameter Input Modal -->
    <div v-if="showParameterModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 font-english">
              Template Parameters
            </h3>
            <button 
              @click="showParameterModal = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="mb-4">
            <h4 class="text-md font-medium text-gray-900 font-english mb-2">
              {{ currentTemplate?.report_name }}
            </h4>
            <p class="text-sm text-gray-600 font-english">
              {{ currentTemplate?.description }}
            </p>
          </div>

          <form @submit.prevent="applyTemplateWithParameters" class="space-y-4">
            <div 
              v-for="(defaultValue, paramName) in (currentTemplate?.parameters?.required_params || {})" 
              :key="paramName"
            >
              <label class="block text-sm font-medium text-gray-700 mb-2 font-english">
                {{ formatParameterLabel(paramName) }} *
              </label>
              <input 
                v-model="templateParameters[paramName]"
                type="text" 
                required
                class="input-field"
                :placeholder="`Enter ${formatParameterLabel(paramName).toLowerCase()}`"
              />
              <p class="text-xs text-gray-500 mt-1 font-english">
                Default: {{ defaultValue }}
              </p>
            </div>

            <div class="flex justify-end space-x-3 pt-4 border-t">
              <button 
                type="button"
                @click="showParameterModal = false"
                class="btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="btn-primary"
              >
                Use Template
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { shippingAPI } from '../services/api'
import { format } from 'date-fns'

// Reactive data
const loading = ref(false)
const reports = ref([])
const templates = ref([])
const reportResults = ref([])
const currentReport = ref(null)

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showResultsModal = ref(false)
const showTemplatesModal = ref(false)
const showParameterModal = ref(false)
const showExportMenu = ref(false)
const activeReportMenu = ref(null)
const exporting = ref(false)
const currentTemplate = ref(null)
const templateParameters = ref({})

// Form data
const reportForm = ref({
  report_name: '',
  description: '',
  sql_query: '',
  report_type: 'custom',
  filters: {
    date_filter: '',
    shipper_name: '',
    shipper_city: '',
    consignee_name: '',
    consignee_city: '',
    min_weight: '',
    max_weight: ''
  },
  columns: [],
  chart_config: {},
  schedule_config: {},
  is_public: false
})

// Available columns for selection (matching actual database schema)
const availableColumns = ref([
  { key: 'id', label: 'ID' },
  { key: 'number_shipment', label: 'Shipment Number' },
  { key: 'country_code', label: 'Country Code' },
  { key: 'shipper_city', label: 'Shipper City' },
  { key: 'shipper_phone_number', label: 'Shipper Phone' },
  { key: 'shipper_name', label: 'Shipper Name' },
  { key: 'shipper_address', label: 'Shipper Address' },
  { key: 'consignee_city', label: 'Consignee City' },
  { key: 'consignee_phone_number', label: 'Consignee Phone' },
  { key: 'consignee_name', label: 'Consignee Name' },
  { key: 'consignee_address', label: 'Consignee Address' },
  { key: 'shipment_reference_number', label: 'Reference Number' },
  { key: 'shipment_creation_date', label: 'Creation Date' },
  { key: 'cod_cash_on_delivery', label: 'COD (Cash on Delivery)' },
  { key: 'shipment_weight', label: 'Weight' },
  { key: 'number_of_shipment_boxes', label: 'Number of Boxes' },
  { key: 'shipment_description', label: 'Description' },
  { key: 'created_at', label: 'Created At' }
])

// Computed properties
const visibleColumns = computed(() => {
  if (!currentReport.value?.columns) return []
  return availableColumns.value.filter(col => 
    currentReport.value.columns.includes(col.key)
  )
})

// Methods
const loadReports = async () => {
  try {
    loading.value = true
    const response = await shippingAPI.getCustomReports()
    reports.value = response.data || []
  } catch (error) {
    console.error('Error loading reports:', error)
  } finally {
    loading.value = false
  }
}

const loadTemplates = async () => {
  try {
    const response = await shippingAPI.getReportTemplates()
    templates.value = response.data || []
    showTemplatesModal.value = true
  } catch (error) {
    console.error('Error loading templates:', error)
  }
}

const saveReport = async () => {
  try {
    loading.value = true
    
    // Validate form
    if (!reportForm.value.report_name.trim()) {
      alert('Report name is required')
      return
    }
    
    if (reportForm.value.columns.length === 0) {
      alert('Please select at least one column to display')
      return
    }
    
    if (showEditModal.value) {
      await shippingAPI.updateCustomReport(currentReport.value.id, reportForm.value)
    } else {
      await shippingAPI.createCustomReport(reportForm.value)
    }
    
    await loadReports()
    closeModal()
  } catch (error) {
    console.error('Error saving report:', error)
    alert('Error saving report: ' + (error.response?.data?.error || error.message))
  } finally {
    loading.value = false
  }
}

const runReport = async (report) => {
  try {
    loading.value = true
    const response = await shippingAPI.runCustomReport(report.id)
    reportResults.value = response.data || []
    currentReport.value = report
    showResultsModal.value = true
  } catch (error) {
    console.error('Error running report:', error)
  } finally {
    loading.value = false
  }
}

const editReport = (report) => {
  currentReport.value = report
  const parameters = report.parameters || {}
  reportForm.value = {
    report_name: report.report_name || report.title || '',
    description: report.description || '',
    sql_query: report.sql_query || '',
    report_type: parameters.report_type || report.report_type || 'custom',
    filters: parameters.filters || report.filters || {},
    columns: parameters.columns || report.columns || [],
    chart_config: parameters.chart_config || report.chart_config || {},
    schedule_config: parameters.schedule_config || report.schedule_config || {},
    is_public: parameters.is_public || report.is_public || false
  }
  showEditModal.value = true
  activeReportMenu.value = null
}

const deleteReport = async (report) => {
  if (confirm(`Are you sure you want to delete "${report.report_name || report.title}"?`)) {
    try {
      await shippingAPI.deleteCustomReport(report.id)
      await loadReports()
    } catch (error) {
      console.error('Error deleting report:', error)
    }
  }
  activeReportMenu.value = null
}

const duplicateReport = (report) => {
  const parameters = report.parameters || {}
  reportForm.value = {
    report_name: `${report.report_name || report.title} (Copy)`,
    description: report.description || '',
    sql_query: report.sql_query || '',
    report_type: parameters.report_type || report.report_type || 'custom',
    filters: { ...(parameters.filters || report.filters || {}) },
    columns: [...(parameters.columns || report.columns || [])],
    chart_config: { ...(parameters.chart_config || report.chart_config || {}) },
    schedule_config: { ...(parameters.schedule_config || report.schedule_config || {}) },
    is_public: false
  }
  showCreateModal.value = true
  activeReportMenu.value = null
}

const useTemplate = (template) => {
  // Check if template has required parameters
  const requiredParams = template.parameters?.required_params || {}
  
  if (Object.keys(requiredParams).length > 0) {
    // Initialize template parameters with default values
    templateParameters.value = { ...requiredParams }
    currentTemplate.value = template
    showParameterModal.value = true
  } else {
    // Use template directly if no required parameters
    applyTemplate(template)
  }
}

const applyTemplate = (template, customParams = {}) => {
  // Replace parameter placeholders in SQL query
  let sqlQuery = template.sql_query || ''
  const requiredParams = template.parameters?.required_params || {}
  
  // Replace placeholders with actual values
  Object.keys(requiredParams).forEach(param => {
    const value = customParams[param] || requiredParams[param]
    sqlQuery = sqlQuery.replace(new RegExp(`{${param}}`, 'g'), value)
  })
  
  reportForm.value = {
    report_name: template.report_name || template.title,
    description: template.description,
    sql_query: sqlQuery,
    report_type: template.parameters?.report_type || template.report_type || 'custom',
    filters: { ...(template.parameters?.filters || template.filters || {}) },
    columns: [...(template.parameters?.columns || template.columns || [])],
    chart_config: { ...(template.parameters?.chart_config || template.chart_config || {}) },
    schedule_config: {},
    is_public: false
  }
  showTemplatesModal.value = false
  showParameterModal.value = false
  showCreateModal.value = true
}

const viewReport = (report) => {
  runReport(report)
}

const exportResults = async (format = 'csv') => {
  try {
    exporting.value = true
    showExportMenu.value = false
    
    const response = await shippingAPI.exportData({
      format: format,
      data: reportResults.value
    })
    
    // Create download link
    const link = document.createElement('a')
    link.href = `http://136.243.133.165${response.download_url}`
    link.download = `${response.filename}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error exporting results:', error)
    alert('Error exporting results: ' + (error.response?.data?.error || error.message))
  } finally {
    exporting.value = false
  }
}

const applyTemplateWithParameters = () => {
  if (currentTemplate.value) {
    applyTemplate(currentTemplate.value, templateParameters.value)
  }
}

const formatParameterLabel = (paramName) => {
  const labels = {
    'phone_number': 'Phone Number',
    'city_name': 'City Name'
  }
  return labels[paramName] || paramName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  showResultsModal.value = false
  showTemplatesModal.value = false
  showParameterModal.value = false
  currentReport.value = null
  currentTemplate.value = null
  templateParameters.value = {}
  reportForm.value = {
    report_name: '',
    description: '',
    sql_query: '',
    report_type: 'custom',
    filters: {
      date_filter: '',
      shipper_name: '',
      shipper_city: '',
      consignee_name: '',
      consignee_city: '',
      min_weight: '',
      max_weight: ''
    },
    columns: [],
    chart_config: {},
    schedule_config: {},
    is_public: false
  }
}

const showReportMenu = (report) => {
  activeReportMenu.value = activeReportMenu.value === report.id ? null : report.id
}

const formatDate = (dateString) => {
  if (!dateString) return 'Never'
  try {
    return format(new Date(dateString), 'MMM dd, yyyy')
  } catch {
    return dateString
  }
}

const formatCellValue = (value, columnKey) => {
  if (value === null || value === undefined) return 'N/A'
  
  if (columnKey === 'shipment_creation_date') {
    try {
      return format(new Date(value), 'dd-MM-yyyy')
    } catch {
      return value
    }
  }
  
  if (columnKey === 'created_at') {
    try {
      return format(new Date(value), 'dd-MM-yyyy HH:mm')
    } catch {
      return value
    }
  }
  
  return value
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.relative')) {
    activeReportMenu.value = null
    showExportMenu.value = false
  }
})

// Lifecycle
onMounted(() => {
  loadReports()
})
</script>
