# Event Calendar - Deployment Guide

## 🚀 Quick Start (Development Mode)

The application is ready to run immediately with mock data (no database setup required).

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Running the Application

1. **Start Backend (with Mock Data)**
   ```bash
   cd backend
   npm install
   npm run dev-mock
   ```
   Backend will run on: http://localhost:5000

2. **Start Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend will run on: http://localhost:3000

3. **Open Application**
   Navigate to http://localhost:3000 in your browser

## ✅ What's Working

### Core Features
- ✅ Monthly calendar view with navigation
- ✅ Add, edit, delete events
- ✅ Drag & drop event rescheduling
- ✅ Event search and filtering
- ✅ Event categories and colors
- ✅ Responsive design with Bootstrap
- ✅ Real-time form validation
- ✅ Conflict detection (basic)

### Technical Features
- ✅ React frontend with Bootstrap UI
- ✅ Express.js REST API
- ✅ Mock database for immediate testing
- ✅ PostgreSQL schema ready for production
- ✅ Error handling and validation
- ✅ CORS enabled for development

## 🗄️ Production Database Setup

When ready for production with PostgreSQL:

1. **Install PostgreSQL**
2. **Create Database**
   ```sql
   CREATE DATABASE event_calendar;
   ```

3. **Run Schema**
   ```bash
   cd backend
   psql -d event_calendar -f config/database.sql
   ```

4. **Update Environment Variables**
   Edit `backend/.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=event_calendar
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

5. **Switch to Production Mode**
   ```bash
   npm run dev  # Uses real PostgreSQL database
   ```

## 📁 Project Structure

```
flame/
├── backend/                 # Express.js API
│   ├── config/             # Database schema
│   ├── controllers/        # Business logic
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   ├── server.js          # Main server (PostgreSQL)
│   ├── server-dev.js      # Dev server (Mock data)
│   └── package.json
├── frontend/               # React application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API service layer
│   │   ├── styles/        # CSS styles
│   │   ├── utils/         # Utility functions
│   │   └── App.js         # Main app component
│   └── package.json
└── README.md              # Full documentation
```

## 🌐 API Endpoints

- `GET /api/health` - Health check
- `GET /api/events` - Get events by date range
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/search` - Search events
- `GET /api/events/conflicts` - Check conflicts

## 🎨 Features Demonstration

### Event Management
- Click any day to add an event
- Click existing events to edit
- Use the "Add Event" button for quick access
- Delete events from the edit modal

### Drag & Drop
- Drag any event to a different day
- Visual feedback during drag operations
- Automatic date/time updates

### Search & Filter
- Real-time search by title/description
- Filter by category (Work, Personal, Health, etc.)
- Clear filters button

### Event Customization
- 9 color options for events
- 7 predefined categories
- Rich event details (title, description, time)

## 🔧 Customization

### Adding New Categories
Edit `frontend/src/utils/dateUtils.js`:
```javascript
export const EVENT_CATEGORIES = [
  'Work', 'Personal', 'Health', 'Education', 
  'Social', 'Travel', 'Other', 'Your New Category'
];
```

### Adding New Colors
Edit `frontend/src/utils/dateUtils.js`:
```javascript
export const EVENT_COLORS = [
  { value: '#your-color', name: 'Your Color', class: 'event-your-color' }
];
```

### Styling
Modify `frontend/src/styles/index.css` for custom styles.

## 🚀 Production Deployment

### Backend (Node.js)
1. Use PM2 for process management
2. Set up Nginx reverse proxy
3. Configure environment variables
4. Set up PostgreSQL database

### Frontend (React)
1. Build production bundle: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Update API URL in environment variables

## 🧪 Testing

### Manual Testing Checklist
- [ ] Create new event
- [ ] Edit existing event
- [ ] Delete event
- [ ] Drag event to different day
- [ ] Search for events
- [ ] Filter by category
- [ ] Navigate between months
- [ ] Test responsive design

### API Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Get events
curl "http://localhost:5000/api/events?startDate=2024-01-01T00:00:00Z&endDate=2024-01-31T23:59:59Z"

# Create event
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Event","startDate":"2024-01-15T10:00:00Z","endDate":"2024-01-15T11:00:00Z"}'
```

## 🔮 Future Enhancements

### Ready to Implement
- [ ] Complete recurring events frontend integration
- [ ] User authentication
- [ ] Event sharing
- [ ] Email notifications
- [ ] Calendar import/export

### Backend Features Available
- ✅ Recurring events logic (Daily, Weekly, Monthly)
- ✅ Advanced conflict detection
- ✅ Event search and filtering
- ✅ Comprehensive API endpoints

## 📞 Support

For issues or questions:
1. Check the main README.md for detailed documentation
2. Review the API endpoints and data models
3. Test with mock data first before setting up PostgreSQL
4. Ensure both frontend and backend are running on correct ports

## 🎉 Success!

Your Event Calendar application is now ready to use! The application demonstrates all the required features from the assignment and provides a solid foundation for further development.
