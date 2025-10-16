import axios from 'axios'
import { currentConfig } from '../config/api.js'

// Create axios instance with environment-specific configuration
const api = axios.create({
  baseURL: currentConfig.baseURL,
  timeout: currentConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor with retry logic
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  async (error) => {
    const originalRequest = error.config
    
    // Retry logic for production API
    if (currentConfig.retries > 1 && !originalRequest._retry && 
        (error.code === 'ECONNABORTED' || error.message.includes('Network Error'))) {
      
      originalRequest._retry = true
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1
      
      if (originalRequest._retryCount <= currentConfig.retries) {
        console.log(`🔄 Retrying API request (${originalRequest._retryCount}/${currentConfig.retries})`)
        
        // Wait before retry (exponential backoff)
        const delay = Math.pow(2, originalRequest._retryCount) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
        
        return api(originalRequest)
      }
    }
    
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.error || 'Server error')
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error. Please check your connection.')
    } else {
      // Something else happened
      throw new Error(error.message)
    }
  }
)

// API endpoints
export const shippingAPI = {
  // Health check
  healthCheck: () => api.get('/health'),

  // Get all shipments with pagination
  getShipments: (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key])
      }
    })
    return api.get(`/shipments?${queryParams}`)
  },

  // Filter shipments
  filterShipments: (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key])
      }
    })
    return api.get(`/shipments/filter?${queryParams}`)
  },

  // Get top customers
  getTopCustomers: (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key])
      }
    })
    return api.get(`/customers/top?${queryParams}`)
  },

  // Get recent shipments
  getRecentShipments: (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key])
      }
    })
    return api.get(`/shipments/recent?${queryParams}`)
  },

  // Get shipments by city
  getShipmentsByCity: (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key])
      }
    })
    return api.get(`/shipments/by-city?${queryParams}`)
  },

  // Get average weight
  getAverageWeight: (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key])
      }
    })
    return api.get(`/shipments/average-weight?${queryParams}`)
  },

  // Get total shipments
  getTotalShipments: (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key])
      }
    })
    return api.get(`/shipments/total?${queryParams}`)
  },

  // Get top cities
  getTopCities: (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key])
      }
    })
    return api.get(`/cities/top?${queryParams}`)
  },

  // Advanced search
  advancedSearch: (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key])
      }
    })
    return api.get(`/shipments/advanced-search?${queryParams}`)
  },

  // Search by weight
  searchByWeight: (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key])
      }
    })
    return api.get(`/shipments/by-weight?${queryParams}`)
  },

  // Search by shipper
  searchByShipper: (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key])
      }
    })
    return api.get(`/shipments/by-shipper?${queryParams}`)
  },

  // Search by consignee
  searchByConsignee: (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key])
      }
    })
    return api.get(`/shipments/by-consignee?${queryParams}`)
  },

  // Export data
  exportData: (data) => api.post('/export', data),

  // Download file
  downloadFile: (filename) => {
    return api.get(`/download/${filename}`, {
      responseType: 'blob'
    })
  }
}

export default api
