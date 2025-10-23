# Diagnostics & Laboratory Information System (LIS)

A minimal Express.js backend service for managing laboratory information in a distributed hospital management platform.

## Features

- **Lab Test Orders**: Submit and validate lab test orders
- **Sample Collection**: Track sample collection status
- **Lab Results**: Enter and verify laboratory instrument results
- **Patient Reports**: Retrieve comprehensive patient lab reports
- **JWT Authentication**: Secure API endpoints
- **PostgreSQL Integration**: Raw SQL with connection pooling
- **Input Validation**: Joi-based validation for all endpoints

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. PostgreSQL Setup

Install PostgreSQL and create a user with database creation privileges:

```bash
# On Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# On macOS with Homebrew
brew install postgresql
brew services start postgresql

# On Windows, download from postgresql.org
```

Create a PostgreSQL user and set up databases:

```bash
# Create user (replace 'your_password' with a secure password)
createuser --createdb --password lis_user
# Enter password when prompted

# Or via psql
psql -U postgres -c "CREATE USER lis_user WITH PASSWORD 'your_password' CREATEDB;"
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration (Local PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lis_dev
DB_USER=lis_user
DB_PASSWORD=your_password

# Test Database Configuration
TEST_DB_NAME=lis_test

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Database Migration

Run the migration scripts to set up the database:

```bash
# For development
npm run migrate:dev

# For testing
npm run migrate:test
```

This will create the databases and tables with sample data.

## Running the Service

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on port 3000 by default.

## API Endpoints

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### Lab Orders

- `POST /api/lab/orders` - Create a new lab order
- `GET /api/lab/orders/:id` - Get order by ID
- `GET /api/lab/orders` - Get orders (with optional filters: `?patientId=...&status=...&limit=...`)

### Sample Collection

- `PUT /api/lab/samples/:id/collection` - Update sample collection status
- `GET /api/lab/samples/:orderId` - Get samples for an order

### Lab Results

- `POST /api/lab/results` - Create a new result
- `PUT /api/lab/results/:id/verification` - Verify a result
- `GET /api/lab/results/:sampleId` - Get results for a sample

### Patient Reports

- `GET /api/lab/reports/:patientId` - Get comprehensive patient report

## Testing the APIs

### 1. Get Authentication Token

First, obtain a JWT token from your authentication service (assumed to be handled externally).

### 2. Create a Patient (via external system)

The system expects patients to exist. In a real setup, patients would be managed by the EMR system.

### 3. Sample API Calls

Use curl or Postman to test the endpoints:

```bash
# Create a lab order
curl -X POST http://localhost:3000/api/lab/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "patientId": "patient-uuid-here",
    "orderedBy": "clinician-uuid-here",
    "priority": "routine",
    "tests": [
      {
        "testId": "cbc-test-uuid",
        "notes": "Routine CBC"
      }
    ]
  }'

# Get orders
curl -X GET http://localhost:3000/api/lab/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update sample collection
curl -X PUT http://localhost:3000/api/lab/samples/sample-uuid/collection \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "collectionStatus": "collected",
    "collectedBy": "technician-uuid",
    "notes": "Sample collected successfully"
  }'

# Create result
curl -X POST http://localhost:3000/api/lab/results \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "sampleId": "sample-uuid",
    "labTestId": "test-uuid",
    "value": "14.5",
    "unit": "g/dL",
    "referenceRange": "12-16 g/dL",
    "performedBy": "technician-uuid",
    "notes": "Normal range"
  }'

# Get patient report
curl -X GET http://localhost:3000/api/lab/reports/patient-uuid \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Schema

### Tables

- `patients` - Patient information
- `lab_tests` - Available laboratory tests
- `lab_orders` - Test orders
- `lab_order_tests` - Tests within orders
- `samples` - Sample collection information
- `results` - Test results

### Key Relationships

- Orders belong to patients
- Orders contain multiple tests
- Each test generates a sample
- Samples produce results

## Architecture

```
├── server.js              # Main application entry point
├── db/                    # Database connection
├── routes/               # API route definitions
├── controllers/          # Request handlers with validation
├── services/             # Business logic and database operations
├── middleware/           # Authentication and error handling
└── migrations/           # Database setup scripts
```

## Future Integrations

The following TODO comments indicate planned integrations:

- EMR system updates for patient records
- Billing system notifications
- Notification services for physicians
- External laboratory information systems

## Error Handling

The service provides comprehensive error handling for:

- Authentication failures
- Validation errors
- Database connection issues
- Constraint violations
- General server errors

## Development Notes

- Uses raw SQL queries with connection pooling
- Validates all inputs with Joi schemas
- Implements proper transaction handling
- Includes comprehensive error responses
- Follows RESTful API conventions

## License

ISC
