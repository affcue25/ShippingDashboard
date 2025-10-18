// API Configuration
export const API_CONFIG = {
  // Production API (Your server)
  production: {
    baseURL: 'http://136.243.133.165/api',
    timeout: 30000, // Longer timeout for production (30s)
    retries: 3
  },
  
  // Development API (Your server)
  development: {
    baseURL: 'http://136.243.133.165/api',
    timeout: 10000,
    retries: 1
  },
  
  // Fallback API (if production is down)
  fallback: {
    baseURL: '/api', // Use local API as fallback
    timeout: 10000,
    retries: 1
  }
}

// Environment detection
export const getApiConfig = () => {
  const isDevelopment = import.meta.env.DEV
  
  // Manual override for testing (uncomment to force specific environment)
  // const forceEnvironment = 'production' // or 'development' or 'fallback'
  const forceEnvironment = null // Set to null for automatic detection
  
  let environment
  if (forceEnvironment) {
    environment = forceEnvironment
    console.log(`🔧 Manual API override: ${environment}`)
  } else {
    environment = isDevelopment ? 'development' : 'production'
  }
  
  const config = API_CONFIG[environment]
  
  console.log(`🌐 API Configuration:`)
  console.log(`   Environment: ${environment}`)
  console.log(`   Base URL: ${config.baseURL}`)
  console.log(`   Timeout: ${config.timeout}ms`)
  console.log(`   Retries: ${config.retries}`)
  
  return config
}

// Export current config
export const currentConfig = getApiConfig()
