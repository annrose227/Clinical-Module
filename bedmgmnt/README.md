# Hospital Admission & Bed Management Service

A comprehensive microservice for managing hospital bed allocation and patient admissions with smart automation and real-time tracking capabilities.

## 🎯 Features

### 1. Digital Bed Mapping Dashboard
- Real-time bed status visualization
- Ward-wise bed organization
- Interactive bed mapping interface
- Equipment status tracking

### 2. Smart Admission Management
- Automated bed allocation algorithm
- Priority-based patient categorization
- Intelligent bed matching
- Admission workflow automation

### 3. Patient Category Tagging
- Emergency, Scheduled, Transfer, Observation categories
- Priority levels (Critical, High, Medium, Low)
- Special requirements tracking
- Insurance information management

### 4. Real-Time Bed Status Tracker
- Live bed availability monitoring
- Status updates (Available, Occupied, Cleaning, Maintenance, Reserved)
- Patient assignment tracking
- Historical status logs

### 5. Admission Workflow Automation
- Automated admission process
- Workflow status tracking
- Discharge preparation automation
- Transfer management

### 6. Discharge & Transfer Management
- Streamlined discharge process
- Bed-to-bed transfers
- Transfer history tracking
- Discharge instructions management

## 🛠️ Tech Stack

- **Backend:** Node.js + Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (placeholder implementation)
- **Documentation:** Swagger/OpenAPI 3.0
- **Architecture:** Microservice-ready RESTful APIs

## 📁 Project Structure

```
admission-bed-service/
│
├── src/
│   ├── models/
│   │   ├── Bed.js              # Bed data model
│   │   └── Admission.js        # Admission data model
│   ├── controllers/
│   │   ├── bedController.js     # Bed management logic
│   │   └── admissionController.js # Admission management logic
│   ├── routes/
│   │   ├── bedRoutes.js         # Bed API routes
│   │   └── admissionRoutes.js   # Admission API routes
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT authentication (placeholder)
│   │   └── errorHandler.js      # Centralized error handling
│   ├── utils/
│   │   └── bedAllocator.js      # Smart bed allocation algorithm
│   ├── app.js                   # Express app configuration
│   └── server.js                # Server startup
│
├── swagger.js                   # API documentation config
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd admission-bed-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file with the following variables:
   NODE_ENV=development
   PORT=3001
   SERVICE_NAME=admission-bed-service
   DB_URI=mongodb://localhost:27017/hospital_bed_management
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=24h
   MAX_BEDS_PER_WARD=50
   DEFAULT_ADMISSION_DURATION_HOURS=72
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the service**
   - API Base URL: `http://localhost:3001`
   - API Documentation: `http://localhost:3001/api-docs`
   - Health Check: `http://localhost:3001/health`

## 📚 API Documentation

The service provides comprehensive Swagger/OpenAPI documentation accessible at `/api-docs`. Key API endpoints include:

### Bed Management APIs
- `GET /api/beds` - Get all beds with filtering
- `POST /api/beds` - Create new bed
- `GET /api/beds/:id` - Get specific bed
- `PUT /api/beds/:id` - Update bed details
- `DELETE /api/beds/:id` - Delete bed
- `GET /api/beds/dashboard/mapping` - Bed mapping dashboard
- `GET /api/beds/stats/utilization` - Bed utilization statistics

### Admission Management APIs
- `GET /api/admissions` - Get all admissions
- `POST /api/admissions` - Create new admission (with smart bed allocation)
- `GET /api/admissions/:id` - Get specific admission
- `POST /api/admissions/:id/discharge` - Discharge patient
- `POST /api/admissions/:id/transfer` - Transfer patient
- `GET /api/admissions/dashboard/workflow` - Workflow dashboard
- `GET /api/admissions/dashboard/bed-status` - Real-time bed status

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3001` |
| `DB_URI` | MongoDB connection string | `mongodb://localhost:27017/hospital_bed_management` |
| `JWT_SECRET` | JWT secret key | Required for production |
| `MAX_BEDS_PER_WARD` | Maximum beds per ward | `50` |
| `DEFAULT_ADMISSION_DURATION_HOURS` | Default admission duration | `72` |

### Database Models

#### Bed Model
```javascript
{
  bedId: String (UUID),
  ward: String,
  roomNumber: String,
  bedNumber: String,
  type: "ICU" | "General" | "Private",
  status: "Available" | "Occupied" | "Cleaning" | "Maintenance" | "Reserved",
  assignedPatientId: String | null,
  equipment: Array,
  notes: String,
  isActive: Boolean,
  timestamps: true
}
```

#### Admission Model
```javascript
{
  admissionId: String (UUID),
  patientId: String,
  patientName: String,
  patientCategory: "Emergency" | "Scheduled" | "Transfer" | "Observation",
  priority: "Critical" | "High" | "Medium" | "Low",
  bedId: String,
  ward: String,
  roomNumber: String,
  bedNumber: String,
  admissionDate: Date,
  expectedDischargeDate: Date,
  actualDischargeDate: Date,
  status: "Active" | "Discharged" | "Transferred" | "Cancelled",
  workflowStatus: "Admitted" | "Under Observation" | "Ready for Discharge" | "Discharged",
  timestamps: true
}
```

## 🧠 Smart Bed Allocation Algorithm

The service includes an intelligent bed allocation system that considers:

1. **Patient Category & Priority**
   - Emergency cases get ICU beds
   - Critical patients prioritized for ICU
   - Scheduled patients get appropriate bed types

2. **Special Requirements**
   - Equipment availability
   - Ward preferences
   - Accessibility needs

3. **Optimization Factors**
   - Ward efficiency
   - Room proximity
   - Equipment utilization

## 🔒 Security Features

- **Rate Limiting:** 100 requests per 15 minutes per IP
- **CORS Protection:** Configurable origins
- **Helmet Security:** Security headers
- **Input Validation:** Comprehensive request validation
- **Error Handling:** Centralized error management
- **JWT Authentication:** Token-based authentication (placeholder)

## 📊 Monitoring & Analytics

- **Health Check Endpoint:** `/health`
- **Bed Utilization Statistics:** Real-time metrics
- **Admission Workflow Tracking:** Status monitoring
- **Performance Metrics:** Response time tracking
- **Error Logging:** Comprehensive error tracking

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 🚀 Deployment

### Docker Deployment (Recommended)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment-Specific Configuration

- **Development:** Full logging, CORS enabled for localhost
- **Production:** Optimized logging, restricted CORS, security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api-docs`
- Review the health check endpoint at `/health`

## 🔄 Version History

- **v1.0.0** - Initial release with core features
  - Bed management system
  - Smart admission workflow
  - Real-time tracking
  - Swagger documentation
  - Comprehensive error handling
