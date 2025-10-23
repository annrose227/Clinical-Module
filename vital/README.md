# Vitals Monitoring API

A Node.js Express API for monitoring patient vitals with anomaly detection.

## Features

- Store and retrieve patient vitals (heart rate, blood pressure, temperature)
- Basic anomaly detection based on predefined ranges
- Input validation using express-validator
- MongoDB for data storage

## Prerequisites

- Node.js (v14 or higher)
- MongoDB

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/vitals
   ```
4. Start MongoDB service

## Usage

### Development

```
npm run dev
```

### Production

```
npm start
```

The server will run on the port specified in `.env` (default: 3000).

## API Endpoints

### GET /api/vitals

Retrieve all vitals records.

### POST /api/vitals

Create a new vitals record.

**Request Body:**

```json
{
  "patientId": "string",
  "heartRate": number,
  "bloodPressure": {
    "systolic": number,
    "diastolic": number
  },
  "temperature": number
}
```

### GET /api/vitals/:patientId

Retrieve vitals records for a specific patient.

## Normal Ranges

- Heart Rate: 60-100 bpm
- Systolic BP: 90-140 mmHg
- Diastolic BP: 60-90 mmHg
- Temperature: 36.1-37.5°C

Anomalies are detected when values fall outside these ranges and logged to the console.
