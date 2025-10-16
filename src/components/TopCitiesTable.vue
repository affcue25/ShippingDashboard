<template>
  <div class="overflow-hidden">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="loading-spinner"></div>
    </div>
    <div v-else-if="!data || data.length === 0" class="flex items-center justify-center py-12 text-gray-500">
      <p class="font-english">{{ $t('common.noData') }}</p>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-english">
              {{ $t('dashboard.rank') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-english">
              {{ $t('dashboard.city') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-english">
              {{ $t('dashboard.shipments') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-english">
              {{ $t('dashboard.percentage') }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr 
            v-for="(item, index) in data" 
            :key="item.city"
            class="hover:bg-gray-50 transition-colors duration-200"
          >
            <!-- Rank -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div 
                  class="flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold font-english"
                  :class="getRankColor(index)"
                >
                  {{ index + 1 }}
                </div>
              </div>
            </td>
            
            <!-- City Name -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-8 w-8">
                  <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <svg class="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 font-english">
                    {{ item.city }}
                  </div>
                </div>
              </div>
            </td>
            
            <!-- Shipment Count -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 font-english">
                {{ item.shipment_count.toLocaleString() }}
              </div>
            </td>
            
            <!-- Percentage -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    class="h-2 rounded-full transition-all duration-500"
                    :class="getProgressBarColor(index)"
                    :style="{ width: getPercentage(item.shipment_count) + '%' }"
                  ></div>
                </div>
                <div class="text-sm text-gray-600 font-english">
                  {{ getPercentage(item.shipment_count) }}%
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Calculate total shipments for percentage calculation
const totalShipments = computed(() => {
  return props.data.reduce((sum, item) => sum + item.shipment_count, 0)
})

// Get percentage of total shipments
const getPercentage = (count) => {
  if (totalShipments.value === 0) return 0
  return Math.round((count / totalShipments.value) * 100)
}

// Get rank color based on position
const getRankColor = (index) => {
  const colors = [
    'bg-yellow-100 text-yellow-800', // 1st - Gold
    'bg-gray-100 text-gray-800',     // 2nd - Silver
    'bg-orange-100 text-orange-800', // 3rd - Bronze
    'bg-blue-100 text-blue-800',     // 4th
    'bg-green-100 text-green-800'    // 5th
  ]
  return colors[index] || 'bg-gray-100 text-gray-800'
}

// Get progress bar color based on position
const getProgressBarColor = (index) => {
  const colors = [
    'bg-yellow-500',  // 1st
    'bg-gray-400',    // 2nd
    'bg-orange-500',  // 3rd
    'bg-blue-500',    // 4th
    'bg-green-500'    // 5th
  ]
  return colors[index] || 'bg-gray-400'
}
</script>
