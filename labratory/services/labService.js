const { v4: uuidv4 } = require("uuid");
const db = require("../db");

// Lab order operations
const createOrder = async (orderData) => {
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    const orderId = uuidv4();
    const { patientId, orderedBy, priority, tests } = orderData;

    // Insert lab order
    const orderQuery = `
      INSERT INTO lab_orders (id, patient_id, ordered_by, priority)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const orderResult = await client.query(orderQuery, [orderId, patientId, orderedBy, priority]);

    // Insert lab order tests
    for (const test of tests) {
      const orderTestId = uuidv4();
      const orderTestQuery = `
        INSERT INTO lab_order_tests (id, lab_order_id, lab_test_id, notes)
        VALUES ($1, $2, $3, $4)
      `;
      await client.query(orderTestQuery, [orderTestId, orderId, test.testId, test.notes]);

      // Create sample record
      const sampleId = uuidv4();
      const sampleQuery = `
        INSERT INTO samples (id, lab_order_id, sample_type)
        SELECT $1, $2, lt.category
        FROM lab_tests lt
        WHERE lt.id = $3
      `;
      await client.query(sampleQuery, [sampleId, orderId, test.testId]);
    }

    await client.query("COMMIT");

    return { ...orderResult.rows[0], tests };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const getOrder = async (orderId) => {
  const query = `
    SELECT
      lo.*,
      json_agg(json_build_object(
        'id', lot.id,
        'testId', lot.lab_test_id,
        'notes', lot.notes,
        'test', json_build_object(
          'id', lt.id,
          'name', lt.name,
          'code', lt.code,
          'category', lt.category
        )
      )) as tests
    FROM lab_orders lo
    LEFT JOIN lab_order_tests lot ON lo.id = lot.lab_order_id
    LEFT JOIN lab_tests lt ON lot.lab_test_id = lt.id
    WHERE lo.id = $1
    GROUP BY lo.id
  `;
  const result = await db.query(query, [orderId]);
  return result.rows[0];
};

const getOrders = async (filters = {}) => {
  let query = `
    SELECT
      lo.*,
      p.first_name,
      p.last_name,
      json_agg(json_build_object(
        'id', lt.id,
        'name', lt.name,
        'code', lt.code
      )) as tests
    FROM lab_orders lo
    LEFT JOIN patients p ON lo.patient_id = p.id
    LEFT JOIN lab_order_tests lot ON lo.id = lot.lab_order_id
    LEFT JOIN lab_tests lt ON lot.lab_test_id = lt.id
  `;

  const conditions = [];
  const params = [];

  if (filters.patientId) {
    conditions.push(`lo.patient_id = $${conditions.length + 1}`);
    params.push(filters.patientId);
  }

  if (filters.status) {
    conditions.push(`lo.status = $${conditions.length + 1}`);
    params.push(filters.status);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += ` GROUP BY lo.id, p.first_name, p.last_name ORDER BY lo.created_at DESC`;

  if (filters.limit) {
    query += ` LIMIT $${params.length + 1}`;
    params.push(filters.limit);
  }

  const result = await db.query(query, params);
  return result.rows;
};

// Sample operations
const updateSampleCollection = async (sampleId, updateData) => {
  const { collectionStatus, collectedBy, notes } = updateData;

  const query = `
    UPDATE samples
    SET
      collection_status = $1,
      collected_by = $2,
      collected_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *
  `;

  const result = await db.query(query, [collectionStatus, collectedBy, sampleId]);
  return result.rows[0];
};

const getSamples = async (orderId) => {
  const query = `
    SELECT s.*, lt.name as test_name, lt.code as test_code
    FROM samples s
    JOIN lab_order_tests lot ON s.lab_order_id = lot.lab_order_id
    JOIN lab_tests lt ON lot.lab_test_id = lt.id
    WHERE s.lab_order_id = $1
  `;
  const result = await db.query(query, [orderId]);
  return result.rows;
};

// Result operations
const createResult = async (resultData) => {
  const { sampleId, labTestId, value, unit, referenceRange, performedBy, notes } = resultData;

  const resultId = uuidv4();
  const query = `
    INSERT INTO results (id, sample_id, lab_test_id, value, unit, reference_range, performed_by, performed_at, notes)
    VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, $8)
    RETURNING *
  `;

  const result = await db.query(query, [
    resultId,
    sampleId,
    labTestId,
    value,
    unit,
    referenceRange,
    performedBy,
    notes,
  ]);

  // TODO: Integrate with EMR system for result updates
  // TODO: Send notifications to ordering physician

  return result.rows[0];
};

const verifyResult = async (resultId, verificationData) => {
  const { verifiedBy, status, notes } = verificationData;

  const query = `
    UPDATE results
    SET
      status = $1,
      verified_by = $2,
      verified_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP,
      notes = COALESCE($3, notes)
    WHERE id = $4
    RETURNING *
  `;

  const result = await db.query(query, [status, verifiedBy, notes, resultId]);

  // TODO: Integrate with billing system
  // TODO: Update patient record in EMR
  // TODO: Send notifications

  return result.rows[0];
};

const getResults = async (sampleId) => {
  const query = `
    SELECT r.*, lt.name as test_name, lt.code as test_code, lt.reference_range as default_range
    FROM results r
    JOIN lab_tests lt ON r.lab_test_id = lt.id
    WHERE r.sample_id = $1
    ORDER BY r.created_at DESC
  `;
  const result = await db.query(query, [sampleId]);
  return result.rows;
};

// Report operations
const getPatientReport = async (patientId) => {
  const query = `
    SELECT
      json_build_object(
        'patient', json_build_object(
          'id', p.id,
          'firstName', p.first_name,
          'lastName', p.last_name,
          'medicalRecordNumber', p.medical_record_number
        ),
        'orders', json_agg(
          json_build_object(
            'id', lo.id,
            'orderDate', lo.order_date,
            'status', lo.status,
            'priority', lo.priority,
            'tests', (
              SELECT json_agg(
                json_build_object(
                  'test', json_build_object(
                    'name', lt.name,
                    'code', lt.code
                  ),
                  'sample', json_build_object(
                    'status', s.collection_status,
                    'collectedAt', s.collected_at
                  ),
                  'results', (
                    SELECT json_agg(
                      json_build_object(
                        'value', r.value,
                        'unit', r.unit,
                        'referenceRange', r.reference_range,
                        'status', r.status,
                        'performedAt', r.performed_at
                      )
                    )
                    FROM results r
                    WHERE r.sample_id = s.id AND r.lab_test_id = lt.id
                  )
                )
              )
              FROM lab_order_tests lot2
              JOIN lab_tests lt ON lot2.lab_test_id = lt.id
              LEFT JOIN samples s ON s.lab_order_id = lo.id
              WHERE lot2.lab_order_id = lo.id
            )
          )
        )
      ) as report
    FROM patients p
    LEFT JOIN lab_orders lo ON p.id = lo.patient_id
    WHERE p.id = $1
    GROUP BY p.id, p.first_name, p.last_name, p.medical_record_number
  `;

  const result = await db.query(query, [patientId]);
  return result.rows[0]?.report || { patient: null, orders: [] };
};

module.exports = {
  createOrder,
  getOrder,
  getOrders,
  updateSampleCollection,
  getSamples,
  createResult,
  verifyResult,
  getResults,
  getPatientReport,
};
