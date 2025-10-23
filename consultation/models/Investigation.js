// Data model for Investigation
// Using in-memory storage for this example; in production, use a database

class Investigation {
  constructor(id, consultationId, testName, status, results) {
    this.id = id;
    this.consultationId = consultationId;
    this.testName = testName;
    this.status = status; // e.g., 'ordered', 'completed'
    this.results = results; // Results data if completed
  }
}

// In-memory storage
const investigations = [];

module.exports = { Investigation, investigations };
