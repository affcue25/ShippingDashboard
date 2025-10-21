<template>
  <div class="overflow-hidden">
    <div v-if="loading" class="flex items-center justify-center h-32">
      <div class="loading-spinner"></div>
    </div>
    <div v-else-if="!data || data.length === 0" class="text-center py-8 text-gray-500">
      <p class="font-english">No customer data available</p>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="table-header">#</th>
            <th class="table-header w-48 whitespace-normal break-words">{{ $t('shipments.columns.shipperName') }}</th>
            <th class="table-header">Shipper Phone</th>
            <th class="table-header">Shipments</th>
            <th class="table-header">Unique Consignees</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(customer, index) in data" :key="customer.shipper_name" class="hover:bg-gray-50">
            <td class="table-cell font-medium text-gray-500">
              {{ index + 1 }}
            </td>
            <td class="table-cell font-medium text-gray-900 w-48 whitespace-normal break-words align-top">
              {{ customer.shipper_name || 'N/A' }}
            </td>
            <td class="table-cell">
              {{ customer.shipper_phone || 'N/A' }}
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
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
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
</script>
