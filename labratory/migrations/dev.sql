-- Development database migration script

-- Create database


-- Connect to the database
\c lis_db;

-- Create tables
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    medical_record_number VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lab_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(100),
    reference_range TEXT,
    unit VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lab_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    ordered_by UUID NOT NULL, -- clinician ID
    priority VARCHAR(20) CHECK (priority IN ('routine', 'urgent', 'stat')) DEFAULT 'routine',
    status VARCHAR(50) DEFAULT 'ordered',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lab_order_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_order_id UUID REFERENCES lab_orders(id) ON DELETE CASCADE,
    lab_test_id UUID REFERENCES lab_tests(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE samples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_order_id UUID REFERENCES lab_orders(id) ON DELETE CASCADE,
    sample_type VARCHAR(100) NOT NULL,
    collection_date TIMESTAMP,
    collection_status VARCHAR(50) DEFAULT 'pending',
    collected_by UUID, -- lab technician ID
    collected_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sample_id UUID REFERENCES samples(id) ON DELETE CASCADE,
    lab_test_id UUID REFERENCES lab_tests(id) ON DELETE CASCADE,
    value TEXT NOT NULL,
    unit VARCHAR(50),
    reference_range TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    performed_by UUID, -- lab technician ID
    performed_at TIMESTAMP,
    verified_by UUID, -- lab supervisor ID
    verified_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_patients_medical_record_number ON patients(medical_record_number);
CREATE INDEX idx_lab_orders_patient_id ON lab_orders(patient_id);
CREATE INDEX idx_lab_orders_status ON lab_orders(status);
CREATE INDEX idx_samples_lab_order_id ON samples(lab_order_id);
CREATE INDEX idx_results_sample_id ON results(sample_id);
CREATE INDEX idx_results_lab_test_id ON results(lab_test_id);

-- Insert some sample data
INSERT INTO lab_tests (name, code, category, reference_range, unit) VALUES
('Complete Blood Count', 'CBC', 'Hematology', 'See individual components', NULL),
('Hemoglobin', 'HGB', 'Hematology', '12-16 g/dL (Female), 13-17 g/dL (Male)', 'g/dL'),
('White Blood Cell Count', 'WBC', 'Hematology', '4.0-11.0 x10^9/L', 'x10^9/L'),
('Platelet Count', 'PLT', 'Hematology', '150-450 x10^9/L', 'x10^9/L'),
('Glucose', 'GLU', 'Chemistry', '70-100 mg/dL (fasting)', 'mg/dL'),
('Creatinine', 'CRE', 'Chemistry', '0.6-1.2 mg/dL', 'mg/dL');