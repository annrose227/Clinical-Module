const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hospital Admission & Bed Management Service',
      version: '1.0.0',
      description: 'A comprehensive microservice for managing hospital bed allocation and patient admissions',
      contact: {
        name: 'Hospital Management System',
        email: 'admin@hospital.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Bed: {
          type: 'object',
          properties: {
            bedId: {
              type: 'string',
              format: 'uuid',
              description: 'Unique bed identifier'
            },
            ward: {
              type: 'string',
              description: 'Ward name'
            },
            roomNumber: {
              type: 'string',
              description: 'Room number'
            },
            bedNumber: {
              type: 'string',
              description: 'Bed number within the room'
            },
            type: {
              type: 'string',
              enum: ['ICU', 'General', 'Private'],
              description: 'Bed type'
            },
            status: {
              type: 'string',
              enum: ['Available', 'Occupied', 'Cleaning', 'Maintenance', 'Reserved'],
              description: 'Current bed status'
            },
            assignedPatientId: {
              type: 'string',
              nullable: true,
              description: 'ID of assigned patient'
            },
            lastUpdated: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            },
            equipment: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  status: { 
                    type: 'string',
                    enum: ['Working', 'Maintenance', 'Out of Order']
                  }
                }
              }
            },
            notes: {
              type: 'string',
              maxLength: 500,
              description: 'Additional notes'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether bed is active'
            }
          }
        },
        Admission: {
          type: 'object',
          properties: {
            admissionId: {
              type: 'string',
              format: 'uuid',
              description: 'Unique admission identifier'
            },
            patientId: {
              type: 'string',
              description: 'Patient identifier'
            },
            patientName: {
              type: 'string',
              description: 'Patient full name'
            },
            patientCategory: {
              type: 'string',
              enum: ['Emergency', 'Scheduled', 'Transfer', 'Observation'],
              description: 'Patient admission category'
            },
            priority: {
              type: 'string',
              enum: ['Critical', 'High', 'Medium', 'Low'],
              description: 'Admission priority'
            },
            bedId: {
              type: 'string',
              description: 'Assigned bed ID'
            },
            ward: {
              type: 'string',
              description: 'Ward name'
            },
            roomNumber: {
              type: 'string',
              description: 'Room number'
            },
            bedNumber: {
              type: 'string',
              description: 'Bed number'
            },
            admissionDate: {
              type: 'string',
              format: 'date-time',
              description: 'Admission date and time'
            },
            expectedDischargeDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Expected discharge date'
            },
            actualDischargeDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Actual discharge date'
            },
            status: {
              type: 'string',
              enum: ['Active', 'Discharged', 'Transferred', 'Cancelled'],
              description: 'Admission status'
            },
            admissionReason: {
              type: 'string',
              description: 'Reason for admission'
            },
            diagnosis: {
              type: 'string',
              description: 'Patient diagnosis'
            },
            attendingPhysician: {
              type: 'string',
              description: 'Attending physician name'
            },
            workflowStatus: {
              type: 'string',
              enum: ['Admitted', 'Under Observation', 'Ready for Discharge', 'Discharged'],
              description: 'Current workflow status'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'string',
              description: 'Error details (development only)'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            },
            path: {
              type: 'string'
            },
            method: {
              type: 'string'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
            message: {
              type: 'string',
              description: 'Success message'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi
};
