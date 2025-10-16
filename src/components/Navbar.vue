<template>
  <nav class="bg-white shadow-sm border-b border-gray-200 fixed top-0 z-40 left-0 right-0"
       :class="$i18n.locale === 'ar' ? 'lg:right-64' : 'lg:left-64'">
    <div class="px-2 sm:px-3 lg:px-6">
      <div class="flex items-center justify-between h-14 sm:h-16">
        <!-- Left side - Mobile menu button and page title -->
        <div class="flex items-center flex-1 min-w-0">
          <!-- Mobile sidebar toggle -->
          <button
            @click="toggleSidebar"
            class="lg:hidden p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 mr-2 rtl:mr-0 rtl:ml-2 flex-shrink-0"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          
          <!-- Page title -->
          <h1 class="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 truncate" 
              :class="currentLanguage === 'ar' ? 'font-arabic' : 'font-english'">
            {{ getPageTitle() }}
          </h1>
        </div>

        <!-- Right side - Language switcher and user menu -->
        <div class="flex items-center space-x-1 rtl:space-x-reverse">
          <!-- Language Switcher -->
          <button
            @click="toggleLanguage"
            class="flex items-center space-x-1 rtl:space-x-reverse text-gray-700 hover:text-primary-600 px-1.5 sm:px-2 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200"
          >
            <svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
            </svg>
            <!-- Show language text on larger screens, icon only on mobile -->
            <span class="hidden xs:inline text-xs sm:text-sm" 
                  :class="currentLanguage === 'ar' ? 'font-arabic' : 'font-english'">
              {{ currentLanguage === 'ar' ? 'العربية' : 'English' }}
            </span>
            <!-- Mobile: Show language code -->
            <span class="xs:hidden text-xs font-medium">
              {{ currentLanguage === 'ar' ? 'ع' : 'EN' }}
            </span>
          </button>

          <!-- User menu -->
          <button class="flex items-center space-x-1 rtl:space-x-reverse p-1 sm:p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            <div class="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span class="text-xs sm:text-sm font-medium text-white">A</span>
            </div>
            <span class="hidden sm:inline text-xs sm:text-sm font-medium" 
                  :class="currentLanguage === 'ar' ? 'font-arabic' : 'font-english'">
              {{ currentLanguage === 'ar' ? 'مدير' : 'Admin' }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'

const { locale, t } = useI18n()
const router = useRouter()
const route = useRoute()

const currentLanguage = computed(() => locale.value)

const toggleLanguage = () => {
  const newLocale = locale.value === 'en' ? 'ar' : 'en'
  locale.value = newLocale
  localStorage.setItem('locale', newLocale)
  
  // Update document direction and language
  document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = newLocale
}

const toggleSidebar = () => {
  // Emit event to parent to toggle sidebar
  // This will be handled by the parent component
  const event = new CustomEvent('toggle-sidebar')
  window.dispatchEvent(event)
}

const getPageTitle = () => {
  const routeNames = {
    'Dashboard': t('nav.dashboard'),
    'Shipments': t('nav.shipments'),
    'Search': t('nav.search'),
    'Analytics': t('nav.analytics'),
    'Reports': t('nav.reports')
  }
  return routeNames[route.name] || t('nav.dashboard')
}
</script>
