# 🌐 API Configuration

## Overview

The Vue.js dashboard is configured to automatically use the correct API endpoint based on the environment:

- **Development**: Uses local API (`/api`)
- **Production**: Uses production API (`https://shippingapiflask.onrender.com/api`)

## Configuration Files

### `src/config/api.js`
Contains the API configuration for different environments:

```javascript
export const API_CONFIG = {
  production: {
    baseURL: 'https://shippingapiflask.onrender.com/api',
    timeout: 15000, // Longer timeout for production
    retries: 3
  },
  development: {
    baseURL: '/api',
    timeout: 10000,
    retries: 1
  }
}
```

### `src/services/api.js`
Uses the configuration to create the axios instance with:
- Environment-specific base URL
- Appropriate timeout values
- Retry logic for production API
- Error handling and logging

## Environment Detection

The system automatically detects the environment using:
```javascript
const isDevelopment = import.meta.env.DEV
```

- **Development**: When running `npm run dev`
- **Production**: When running `npm run build` or deployed

## API Endpoints

All API calls are made through the configured base URL:

### Health Check
- **URL**: `{baseURL}/health`
- **Method**: GET
- **Purpose**: Check API availability

### Shipments
- **URL**: `{baseURL}/shipments`
- **Method**: GET
- **Parameters**: `limit`, `offset`, `date_filter`

### Average Weight
- **URL**: `{baseURL}/shipments/average-weight`
- **Method**: GET
- **Parameters**: `date_filter`

### Top Cities
- **URL**: `{baseURL}/cities/top`
- **Method**: GET
- **Parameters**: `limit`, `date_filter`

### And many more... (see `src/services/api.js` for complete list)

## Production API Features

### Retry Logic
- Automatically retries failed requests (up to 3 times)
- Uses exponential backoff (1s, 2s, 4s delays)
- Only retries on network errors, not HTTP errors

### Timeout
- Production: 15 seconds (accounts for Render.com cold starts)
- Development: 10 seconds

### Error Handling
- Network errors: Automatic retry with backoff
- HTTP errors: Display user-friendly error messages
- Timeout errors: Retry with exponential backoff

## Testing the Configuration

### Development
```bash
npm run dev
```
- Uses local API at `http://localhost:5000/api`
- Check browser console for API configuration logs

### Production
```bash
npm run build
npm run preview
```
- Uses production API at `https://shippingapiflask.onrender.com/api`
- Check browser console for API configuration logs

## Troubleshooting

### Production API Issues
1. **Cold Start**: Render.com services can take 10-30 seconds to wake up
2. **Timeout**: Production API has 15-second timeout
3. **Retries**: Automatic retry with exponential backoff
4. **Check Logs**: Browser console shows retry attempts

### Development API Issues
1. **Local Server**: Ensure Flask API is running on port 5000
2. **CORS**: API has CORS enabled for all origins
3. **Database**: Ensure database file exists in `api/` folder

## Manual Configuration Override

To force a specific environment, modify `src/config/api.js`:

```javascript
// Force production API in development
export const getApiConfig = () => {
  return API_CONFIG.production // Always use production
}
```

## API Status

### Production API
- **URL**: https://shippingapiflask.onrender.com/api
- **Status**: Deployed on Render.com
- **Database**: 10,000+ shipment records
- **Endpoints**: All 13 endpoints available

### Health Check
Test the API status:
```bash
curl https://shippingapiflask.onrender.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-16T12:00:00Z",
  "database": "connected"
}
```
