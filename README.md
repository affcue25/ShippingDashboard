# Smart Shipping Dashboard

A modern, bilingual (Arabic/English) Vue3 dashboard for managing and analyzing shipping data. This dashboard provides comprehensive insights into your shipping operations with over 11 million shipments and 50,000 daily additions.

## 🚀 Features

### Core Functionality
- **Bilingual Support**: Full Arabic and English interface
- **Real-time Dashboard**: Live statistics and insights
- **Advanced Search**: Multi-criteria search with filters
- **Data Export**: PDF and CSV export capabilities
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with Tailwind CSS

### Dashboard Components
- **Statistics Cards**: Today's shipments, total count, average weight, top cities
- **Interactive Charts**: Top cities distribution, weight analysis
- **Data Tables**: Recent shipments, top customers with pagination
- **Quick Actions**: Easy navigation to key features

### Search & Analytics
- **Advanced Search**: Filter by city, shipper, consignee, weight, date
- **Analytics**: Comprehensive insights and trends
- **Reports**: Generate and download custom reports
- **Export**: Multiple format support (PDF, CSV)

## 🛠️ Technology Stack

- **Frontend**: Vue 3 + Composition API
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + Vue-ChartJS
- **Icons**: Heroicons
- **Internationalization**: Vue I18n
- **State Management**: Pinia
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn
- The shipping API server running on port 5000

### Setup Steps

1. **Navigate to the dashboard directory**
   ```bash
   cd shipping-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### API Configuration
The dashboard is configured to connect to the shipping API running on `http://localhost:5000`. 

To change the API URL, update the `vite.config.js` file:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://your-api-url:port',
      changeOrigin: true,
    },
  },
}
```

### Language Configuration
The dashboard supports Arabic and English. The default language is English, but users can switch using the language toggle in the navigation bar.

## 📱 Usage

### Dashboard Overview
- View key statistics at a glance
- Monitor recent shipments
- See top customers and cities
- Quick access to main features

### Shipments Management
- Browse all shipments with pagination
- Search and filter shipments
- View detailed shipment information
- Export filtered results

### Advanced Search
- Search by multiple criteria:
  - Source and destination cities
  - Shipper and consignee names
  - Weight ranges
  - Date filters
- Export search results

### Analytics & Reports
- View comprehensive analytics
- Generate custom reports
- Export data in multiple formats

## 🌐 Internationalization

The dashboard supports both Arabic and English:

### Arabic Features
- Right-to-left (RTL) layout
- Arabic font (Cairo)
- Localized content
- Proper text direction

### English Features
- Left-to-right (LTR) layout
- English font (Inter)
- Localized content
- Standard text direction

## 🎨 Customization

### Styling
The dashboard uses Tailwind CSS for styling. You can customize:
- Colors in `tailwind.config.js`
- Fonts in the HTML head
- Component styles in individual Vue files

### Adding New Features
1. Create new components in `src/components/`
2. Add new views in `src/views/`
3. Update the router in `src/router/index.js`
4. Add translations in `src/locales/`

## 📊 API Integration

The dashboard integrates with the shipping API through:
- **Service Layer**: `src/services/api.js`
- **Error Handling**: Comprehensive error management
- **Loading States**: User-friendly loading indicators
- **Data Transformation**: Proper data formatting

### Available API Endpoints
- Health check
- Shipments with pagination
- Advanced search
- Analytics data
- Export functionality

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deployment Options
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **Server Deployment**: Nginx, Apache
- **Container**: Docker

## 🔍 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Ensure the shipping API is running on port 5000
   - Check the proxy configuration in `vite.config.js`

2. **Language Switching Issues**
   - Clear browser cache
   - Check localStorage for language preference

3. **Chart Not Displaying**
   - Ensure Chart.js is properly installed
   - Check browser console for errors

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

## 📈 Performance

### Optimization Features
- **Lazy Loading**: Components loaded on demand
- **Code Splitting**: Automatic code splitting with Vite
- **Image Optimization**: Optimized assets
- **Caching**: Proper HTTP caching headers

### Best Practices
- Use pagination for large datasets
- Implement proper loading states
- Optimize API calls
- Use efficient data structures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review the API documentation
- Create an issue in the repository

---

**Smart Shipping Dashboard** - Transform chaos into order, scattered numbers into useful insights! 🚀
