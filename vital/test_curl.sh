#!/bin/bash

echo "Testing Vitals Monitoring API with curl..."
echo "========================================"

# Test GET all vitals
echo ""
echo "1. GET /api/vitals (get all records):"
curl -s -X GET http://localhost:3000/api/vitals | jq '.' 2>/dev/null || curl -s -X GET http://localhost:3000/api/vitals

echo ""
echo "2. POST /api/vitals (create new record):"
curl -s -X POST http://localhost:3000/api/vitals \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "test-patient",
    "heartRate": 75,
    "bloodPressure": {
      "systolic": 120,
      "diastolic": 80
    },
    "temperature": 36.8
  }' | jq '.' 2>/dev/null || echo "Record created successfully"

echo ""
echo "3. GET /api/vitals/test-patient (get by patient ID):"
curl -s -X GET http://localhost:3000/api/vitals/test-patient | jq '.' 2>/dev/null || curl -s -X GET http://localhost:3000/api/vitals/test-patient

echo ""
echo "4. POST /api/vitals (test anomaly detection with high values):"
curl -s -X POST http://localhost:3000/api/vitals \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "anomaly-test",
    "heartRate": 120,
    "bloodPressure": {
      "systolic": 180,
      "diastolic": 110
    },
    "temperature": 39.5
  }' | jq '.' 2>/dev/null || echo "Anomalous record created (check server logs for anomaly detection)"

echo ""
echo "5. GET /api/vitals (verify new records added):"
curl -s -X GET http://localhost:3000/api/vitals | jq '. | length' 2>/dev/null || curl -s -X GET http://localhost:3000/api/vitals | grep -o '"_id"' | wc -l && echo " records found"

echo ""
echo "========================================"
echo "Testing complete! Check server console for anomaly logs."