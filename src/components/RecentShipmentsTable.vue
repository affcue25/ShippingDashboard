<template>
  <div class="overflow-hidden">
    <div v-if="loading" class="flex items-center justify-center h-32">
      <div class="loading-spinner"></div>
    </div>
    <div v-else-if="!data || data.length === 0" class="text-center py-8 text-gray-500">
      <p class="font-english">No recent shipments</p>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="table-header">{{ $t('shipments.columns.shipmentNumber') }}</th>
            <th class="table-header">{{ $t('shipments.columns.fromCity') }}</th>
            <th class="table-header">{{ $t('shipments.columns.toCity') }}</th>
            <th class="table-header">{{ $t('shipments.columns.weight') }}</th>
            <th class="table-header">{{ $t('shipments.columns.date') }}</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="shipment in data" :key="shipment.id" class="hover:bg-gray-50">
            <td class="table-cell font-medium text-primary-600">
              {{ shipment.number_shipment || 'N/A' }}
            </td>
            <td class="table-cell">{{ shipment.shipper_city || 'N/A' }}</td>
            <td class="table-cell">{{ shipment.consignee_city || 'N/A' }}</td>
            <td class="table-cell">{{ shipment.shipment_weight || 'N/A' }}</td>
            <td class="table-cell">{{ formatDate(shipment.shipment_creation_date) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'

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

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return format(new Date(dateString), 'dd-MM-yyyy')
  } catch {
    if(dateString != '' && dateString != 'NULL' && dateString != null && dateString != undefined && dateString != 'N/A' && dateString != 'NaN') return dateString
    return 'N/A'
  }
}
</script>
