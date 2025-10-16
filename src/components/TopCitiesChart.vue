<template>
  <div class="h-64">
    <div v-if="loading" class="flex items-center justify-center h-full">
      <div class="loading-spinner"></div>
    </div>
    <div v-else-if="!data || data.length === 0" class="flex items-center justify-center h-full text-gray-500">
      <p class="font-english">{{ $t('common.noData') }}</p>
    </div>
    <div v-else-if="error" class="flex items-center justify-center h-full text-red-500">
      <p class="font-english">{{ error }}</p>
    </div>
    <div v-else class="h-full relative">
      <canvas ref="chartCanvas" class="w-full h-full"></canvas>
      <!-- Fallback simple chart if Canvas fails -->
      <div v-if="showFallback" class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <div class="text-sm text-gray-500 mb-4 font-english">Top Cities Distribution</div>
          <div class="space-y-2">
            <div 
              v-for="(item, index) in data" 
              :key="item.city"
              class="flex items-center justify-between text-xs"
            >
              <span class="font-english">{{ item.city }}</span>
              <div class="flex items-center ml-4">
                <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    class="h-2 rounded-full"
                    :class="getProgressBarColor(index)"
                    :style="{ width: getPercentage(item.shipment_count) + '%' }"
                  ></div>
                </div>
                <span class="font-english">{{ item.shipment_count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

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

const chartCanvas = ref(null)
const error = ref(null)
const showFallback = ref(false)
let chart = null

// Calculate total shipments for percentage calculation
const totalShipments = computed(() => {
  return props.data.reduce((sum, item) => sum + item.shipment_count, 0)
})

// Get percentage of total shipments
const getPercentage = (count) => {
  if (totalShipments.value === 0) return 0
  return Math.round((count / totalShipments.value) * 100)
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

const createChart = async () => {
  try {
    error.value = null
    
    if (!chartCanvas.value || !props.data.length) {
      return
    }

    if (chart) {
      chart.destroy()
      chart = null
    }

    // Wait for next tick to ensure DOM is ready
    await nextTick()

    const ctx = chartCanvas.value.getContext('2d')
    
    if (!ctx) {
      throw new Error('Could not get canvas context')
    }
    
    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: props.data.map(item => item.city),
        datasets: [{
          data: props.data.map(item => item.shipment_count),
          backgroundColor: [
            '#3B82F6',
            '#10B981',
            '#F59E0B',
            '#EF4444',
            '#8B5CF6',
            '#06B6D4',
            '#84CC16',
            '#F97316'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                family: 'Inter, system-ui, sans-serif'
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        }
      }
    })
    
  } catch (err) {
    console.error('Error creating chart:', err)
    error.value = 'Failed to load chart'
    showFallback.value = true
  }
}

watch(() => props.data, () => {
  createChart()
}, { deep: true })

watch(() => props.loading, (newLoading) => {
  if (!newLoading && props.data.length > 0) {
    createChart()
  }
})

onMounted(() => {
  createChart()
  
  // Show fallback after 3 seconds if chart hasn't loaded
  setTimeout(() => {
    if (!chart && props.data.length > 0) {
      showFallback.value = true
    }
  }, 3000)
})
</script>
