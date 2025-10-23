const { consultations } = require("../models/Consultation");
const { prescriptions } = require("../models/Prescription");
const { investigations } = require("../models/Investigation");

// Retrieve patient consultation history
const getPatientHistory = async (req, res) => {
  const { patientId } = req.params;

  // TODO: Verify access permissions - ensure the requesting user has access to this patient's data
  // This might involve checking user roles from the auth service

  const patientConsultations = consultations.filter((c) => c.patientId == patientId);
  const patientPrescriptions = prescriptions.filter((p) => {
    const consultation = consultations.find((c) => c.id == p.consultationId);
    return consultation && consultation.patientId == patientId;
  });
  const patientInvestigations = investigations.filter((i) => {
    const consultation = consultations.find((c) => c.id == i.consultationId);
    return consultation && consultation.patientId == patientId;
  });

  const history = {
    consultations: patientConsultations,
    prescriptions: patientPrescriptions,
    investigations: patientInvestigations,
  };

  res.json(history);
};

module.exports = {
  getPatientHistory,
};
