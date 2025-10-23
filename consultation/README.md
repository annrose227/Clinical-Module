# Consultation & E-Prescription Platform

An Express.js backend service for managing consultations, digital prescriptions, and investigation orders in a hospital management system.

## Features

- **Consultation Management**: Create and update consultation records with notes
- **Digital Prescriptions**: Manage e-prescriptions with formulary selections and brand preferences
- **Investigation Orders**: Submit and track investigation orders and results
- **Patient History**: Retrieve comprehensive patient consultation history
- **Authentication**: JWT-based authentication via central User Authentication service
- **External Integrations**: Ready for integration with various hospital systems

## Project Structure

```
├── controllers/          # Request handlers
│   ├── consultationController.js
│   ├── prescriptionController.js
│   ├── investigationController.js
│   └── patientHistoryController.js
├── middleware/           # Custom middleware
│   └── authMiddleware.js
├── models/               # Data models
│   ├── Consultation.js
│   ├── Prescription.js
│   └── Investigation.js
├── routes/               # API routes
│   ├── consultationRoutes.js
│   ├── prescriptionRoutes.js
│   ├── investigationRoutes.js
│   └── patientHistoryRoutes.js
├── services/             # External service integrations
│   └── externalServices.js
├── server.js             # Main application file
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:

   ```
   PORT=3000
   JWT_SECRET=your_jwt_secret_here
   ```

3. **Run the Server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Consultations

- `POST /api/consultations` - Create a new consultation
- `PUT /api/consultations/:id` - Update an existing consultation

### Prescriptions

- `POST /api/prescriptions` - Create a new prescription
- `PUT /api/prescriptions/:id/submit` - Submit a prescription to pharmacy

### Investigations

- `POST /api/investigations` - Submit an investigation order
- `GET /api/investigations/:id/results` - Get investigation results

### Patient History

- `GET /api/patients/:patientId/history` - Retrieve patient consultation history

## Authentication

All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## External Service Integrations

This service is designed to integrate with multiple external systems. Currently, all external API calls are stubbed with TODO comments. To implement actual integrations, replace the stub functions in `services/externalServices.js` with real API calls.

### Required Integrations

1. **User Management Service**

   - Endpoint: `fetchPatientDetails(patientId)`
   - Purpose: Retrieve patient information by ID

2. **Pharmacy / Formulary Service**

   - Endpoints: `performFormularySearch(medications)`, `checkBrandAvailability(medications)`
   - Purpose: Validate medications against hospital formulary and check brand availability

3. **Clinical Decision Support (CDS) APIs**

   - Endpoints: `conductDrugInteractionAnalysis(medications)`, `validatePrescription(medications)`
   - Purpose: Analyze drug interactions and validate prescriptions for safety

4. **Electronic Medical Records (EMR) System**

   - Endpoint: `postToEMR(consultation)`
   - Purpose: Sync consultation data with EMR system

5. **Pharmacy Information System (PIS)**

   - Endpoint: `sendToPharmacyInformationSystem(prescription)`
   - Purpose: Transmit e-prescriptions and orders to pharmacy

6. **Messaging/Notification Service**
   - Endpoint: `triggerPatientNotification(patientId, message)`
   - Purpose: Send notifications to patients

### Implementation Steps

For each integration:

1. **Obtain API Documentation**: Get the API specs from the respective service teams.

2. **Install HTTP Client**: Add `axios` or similar to `package.json` if not already present.

3. **Configure Environment Variables**: Add service URLs and authentication details to `.env`.

4. **Implement API Calls**: Replace stub functions with actual HTTP requests in `services/externalServices.js`.

5. **Handle Errors**: Implement proper error handling for API failures.

6. **Add Logging**: Use a logging library like `winston` for better traceability.

Example implementation for `fetchPatientDetails`:

```javascript
const axios = require("axios");

const fetchPatientDetails = async (patientId) => {
  try {
    const response = await axios.get(`${process.env.USER_MANAGEMENT_URL}/patients/${patientId}`, {
      headers: {
        Authorization: `Bearer ${process.env.USER_MANAGEMENT_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching patient details:", error);
    throw new Error("Failed to fetch patient details");
  }
};
```

## Data Models

### Consultation

- `id`: Unique identifier
- `patientId`: Patient identifier
- `doctorId`: Doctor identifier
- `notes`: Consultation notes
- `date`: Date of consultation
- `status`: 'active' or 'completed'

### Prescription

- `id`: Unique identifier
- `consultationId`: Associated consultation ID
- `medications`: Array of medication objects
- `status`: 'draft', 'submitted', or 'filled'

### Medication

- `drugName`: Name of the medication
- `dosage`: Dosage instructions
- `frequency`: Frequency of administration
- `duration`: Duration of treatment
- `brandPreference`: Preferred brand (optional)

### Investigation

- `id`: Unique identifier
- `consultationId`: Associated consultation ID
- `testName`: Name of the investigation/test
- `status`: 'ordered' or 'completed'
- `results`: Test results (when completed)

## Validation

Request validation is implemented using `express-validator`. Invalid requests will return a 400 status with detailed error messages.

## Error Handling

The application includes comprehensive error handling:

- Input validation errors
- Authentication failures
- Resource not found errors
- Generic server errors

## Development Notes

- Uses in-memory data storage for demonstration. Replace with a proper database (e.g., MongoDB, PostgreSQL) for production.
- All external service calls are currently stubbed. Implement actual integrations as described above.
- Consider adding rate limiting, caching, and monitoring in production.

## License

ISC
