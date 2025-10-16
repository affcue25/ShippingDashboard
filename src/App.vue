<template>
  <div id="app" :class="{ 'rtl': $i18n.locale === 'ar' }" class="min-h-screen bg-gray-50">
    <Sidebar ref="sidebar" />
    <div class="lg:pl-64">
      <Navbar />
      <main class="pt-16">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'

const { locale } = useI18n()
const sidebar = ref(null)

onMounted(() => {
  // Set initial locale from localStorage or default to English
  const savedLocale = localStorage.getItem('locale') || 'en'
  locale.value = savedLocale
  
  // Set document direction
  document.documentElement.dir = savedLocale === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = savedLocale
  
  // Listen for sidebar toggle events
  window.addEventListener('toggle-sidebar', () => {
    if (sidebar.value) {
      sidebar.value.toggleSidebar()
    }
  })
})
</script>

<style>
.rtl {
  direction: rtl;
}

.rtl .font-english {
  font-family: 'Inter', Arial, sans-serif;
}

.font-arabic {
  font-family: 'Cairo', Arial, sans-serif;
}

.font-english {
  font-family: 'Inter', Arial, sans-serif;
}
</style>
