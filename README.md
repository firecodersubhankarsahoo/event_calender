# Custom Event Calendar

A full-stack event calendar application built with React, Node.js, Express, and PostgreSQL. This application allows users to manage their schedule with features like event creation, editing, deletion, recurring events, drag-and-drop rescheduling, and conflict detection.

## Features

### ✅ Implemented Features

- **Monthly Calendar View**: Traditional calendar grid with navigation
- **Event Management**: Create, edit, and delete events
- **Event Form**: Comprehensive form with title, date/time, description, category, and color
- **Drag & Drop**: Reschedule events by dragging them to different days
- **Search & Filter**: Real-time search and category-based filtering
- **Responsive Design**: Bootstrap-based responsive layout
- **Event Colors**: Multiple color options for event categorization
- **Event Categories**: Predefined categories (Work, Personal, Health, etc.)
- **Time Display**: Events show start time and duration
- **Today Highlighting**: Current day is highlighted
- **Event Conflicts**: Basic conflict detection (overlapping events)

### 🚧 Recurring Events (Backend Ready)

The backend includes full support for recurring events with the following patterns:
- Daily recurrence
- Weekly recurrence  
- Monthly recurrence
- Custom intervals
- End date or max occurrences

*Frontend integration for recurring events is partially implemented and can be completed.*

## Tech Stack

- **Frontend**: React, Bootstrap 5, Axios
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Languages**: JavaScript, HTML, CSS

## Project Structure

```
flame/
├── backend/
│   ├── config/
│   │   └── database.sql          # Database schema
│   ├── controllers/
│   │   └── eventController.js    # Event business logic
│   ├── models/
│   │   └── Event.js              # Event data model
│   ├── routes/
│   │   └── events.js             # API routes
│   ├── server.js                 # Express server
│   ├── .env                      # Environment variables
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html            # Main HTML file
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── Calendar.js
│   │   │   ├── CalendarDay.js
│   │   │   ├── EventItem.js
│   │   │   ├── EventModal.js
│   │   │   └── SearchFilter.js
│   │   ├── services/
│   │   │   └── api.js            # API service layer
│   │   ├── styles/
│   │   │   └── index.css         # Custom styles
│   │   ├── utils/
│   │   │   └── dateUtils.js      # Date utility functions
│   │   ├── App.js                # Main App component
│   │   └── index.js              # React entry point
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Database Setup

1. Install PostgreSQL and create a database:
```sql
CREATE DATABASE event_calendar;
```

2. Run the database schema:
```bash
cd backend
psql -d event_calendar -f config/database.sql
```

3. Update database credentials in `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_calendar
DB_USER=your_username
DB_PASSWORD=your_password
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Events
- `GET /api/events?startDate=&endDate=` - Get events in date range
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/search?q=&category=` - Search events
- `GET /api/events/conflicts?startDate=&endDate=&excludeId=` - Check conflicts

### Health Check
- `GET /api/health` - API health status

## Usage

1. **Adding Events**: Click on any day or use the "Add Event" button
2. **Editing Events**: Click on an existing event to edit
3. **Deleting Events**: Use the delete button in the event modal
4. **Drag & Drop**: Drag events to different days to reschedule
5. **Search**: Use the search bar to find events by title or description
6. **Filter**: Filter events by category using the dropdown
7. **Navigation**: Use the navigation buttons to move between months

## Event Data Model

```javascript
{
  id: "unique_id",
  title: "Event Title",
  description: "Event Description",
  start_date: "2024-01-15T10:00:00Z",
  end_date: "2024-01-15T11:00:00Z",
  color: "#007bff",
  category: "Work",
  is_recurring: false,
  // Recurring event fields (when applicable)
  recurrence_type: "daily|weekly|monthly|custom",
  interval_value: 1,
  days_of_week: [1, 3, 5], // For weekly recurrence
  day_of_month: 15, // For monthly recurrence
  recurrence_end_date: "2024-12-31T23:59:59Z",
  max_occurrences: 10
}
```

## Customization

### Adding New Event Categories
Update the `EVENT_CATEGORIES` array in `frontend/src/utils/dateUtils.js`

### Adding New Colors
Update the `EVENT_COLORS` array in `frontend/src/utils/dateUtils.js`

### Styling
Modify `frontend/src/styles/index.css` for custom styling

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Deployment

### Backend Deployment
1. Set production environment variables
2. Use a process manager like PM2
3. Set up reverse proxy with Nginx

### Frontend Deployment
1. Build the production bundle:
```bash
npm run build
```
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Update API URL in environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Future Enhancements

- [ ] Complete recurring events frontend integration
- [ ] User authentication and authorization
- [ ] Event sharing and collaboration
- [ ] Email notifications and reminders
- [ ] Calendar import/export (iCal, Google Calendar)
- [ ] Mobile app development
- [ ] Real-time updates with WebSockets
- [ ] Advanced recurring patterns
- [ ] Event templates
- [ ] Calendar themes and customization
