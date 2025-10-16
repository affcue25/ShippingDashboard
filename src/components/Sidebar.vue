<template>
  <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-gray-100"
       :class="{ 'translate-x-0': sidebarOpen, '-translate-x-full': !sidebarOpen }"
       style="background-image: radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.05) 1px, transparent 0); background-size: 20px 20px;">
    
    <!-- Sidebar Header -->
    <div class="flex items-center justify-between h-20 px-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <div class="flex items-center">
        <div class="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
        </div>
        <div class="ml-4">
          <h1 class="text-lg font-bold text-gray-900 font-english">
            Smart Shipping
          </h1>
          <p class="text-xs text-gray-500 font-english">
            Dashboard
          </p>
        </div>
      </div>
      
      <!-- Close button for mobile -->
      <button
        @click="toggleSidebar"
        class="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="mt-8 px-4 flex-1 overflow-y-auto sidebar-scroll">
      <!-- Navigation Section Label -->
      <div class="px-4 mb-4">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider font-english">
          Navigation
        </h3>
      </div>
      
      <div class="space-y-2">
        <router-link
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.to"
          class="group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] sidebar-menu-item"
          :class="[
            $route.name === item.name
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
              : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-md'
          ]"
          @click="closeSidebarOnMobile"
        >
          <!-- Active indicator -->
          <div
            v-if="$route.name === item.name"
            class="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
          ></div>
          
          <!-- Icon with enhanced styling -->
          <div
            class="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300"
            :class="[
              $route.name === item.name
                ? 'bg-white/20 backdrop-blur-sm'
                : 'bg-gray-100 group-hover:bg-white group-hover:shadow-sm'
            ]"
          >
          <!-- Dashboard Icon -->
          <svg v-if="item.icon === 'DashboardIcon'" class="h-5 w-5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" :class="[
            $route.name === item.name
              ? 'text-white'
              : 'text-gray-500 group-hover:text-primary-600'
          ]">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
          </svg>
          
          <!-- Truck Icon -->
          <svg v-else-if="item.icon === 'TruckIcon'" class="h-5 w-5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" :class="[
            $route.name === item.name
              ? 'text-white'
              : 'text-gray-500 group-hover:text-primary-600'
          ]">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0M15 17a2 2 0 104 0"></path>
          </svg>
          
          <!-- Search Icon -->
          <svg v-else-if="item.icon === 'SearchIcon'" class="h-5 w-5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" :class="[
            $route.name === item.name
              ? 'text-white'
              : 'text-gray-500 group-hover:text-primary-600'
          ]">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          
          <!-- Chart Icon -->
          <svg v-else-if="item.icon === 'ChartIcon'" class="h-5 w-5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" :class="[
            $route.name === item.name
              ? 'text-white'
              : 'text-gray-500 group-hover:text-primary-600'
          ]">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          
          <!-- Document Icon -->
          <svg v-else-if="item.icon === 'DocumentIcon'" class="h-5 w-5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" :class="[
            $route.name === item.name
              ? 'text-white'
              : 'text-gray-500 group-hover:text-primary-600'
          ]">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          </div>
          
          <!-- Text with better typography -->
          <div class="ml-4 flex-1">
            <span class="font-semibold font-english tracking-wide">
              {{ $t(`nav.${item.key}`) }}
            </span>
          </div>
          
          <!-- Hover arrow indicator -->
          <div
            class="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            :class="{ 'opacity-100': $route.name === item.name }"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </router-link>
      </div>
    </nav>

    <!-- Sidebar Footer -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <div class="flex items-center">
        <div class="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
          <span class="text-sm font-bold text-white">A</span>
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-semibold text-gray-900 font-english">Admin User</p>
          <p class="text-xs text-gray-500 font-english">admin@shipping.com</p>
        </div>
        <button class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile overlay -->
  <div
    v-if="sidebarOpen"
    @click="toggleSidebar"
    class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
  ></div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const sidebarOpen = ref(false)

const navigationItems = [
  {
    name: 'Dashboard',
    key: 'dashboard',
    to: '/',
    icon: 'DashboardIcon'
  },
  {
    name: 'Shipments',
    key: 'shipments',
    to: '/shipments',
    icon: 'TruckIcon'
  },
  {
    name: 'Search',
    key: 'search',
    to: '/search',
    icon: 'SearchIcon'
  },
  {
    name: 'Analytics',
    key: 'analytics',
    to: '/analytics',
    icon: 'ChartIcon'
  },
  {
    name: 'Reports',
    key: 'reports',
    to: '/reports',
    icon: 'DocumentIcon'
  }
]

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebarOnMobile = () => {
  // Close sidebar on mobile when navigating
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false
  }
}

// Expose toggle function for parent components
defineExpose({
  toggleSidebar
})
</script>

