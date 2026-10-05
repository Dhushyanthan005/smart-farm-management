-- V6__create_breeding_and_reproduction.sql
-- Breeding, Reproduction Lifecycle, Heat Detection, Insemination, Pregnancy, and Calving Records

-- 1. HEAT DETECTION RECORDS
CREATE TABLE heat_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cow_id UUID NOT NULL REFERENCES cows(id) ON DELETE RESTRICT,
    detected_at TIMESTAMP WITH TIME ZONE NOT NULL,
    detection_method VARCHAR(30) NOT NULL,
    signs_observed TEXT NOT NULL,
    confidence VARCHAR(20) NOT NULL DEFAULT 'HIGH',
    notes TEXT,
    detected_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
    detected_by_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50)
);

CREATE INDEX idx_heat_cow_id ON heat_records(cow_id);
CREATE INDEX idx_heat_detected_at ON heat_records(detected_at);
CREATE INDEX idx_heat_method ON heat_records(detection_method);
CREATE INDEX idx_heat_detected_by ON heat_records(detected_by_id);

-- 2. BREEDING & INSEMINATION RECORDS
CREATE TABLE breeding_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cow_id UUID NOT NULL REFERENCES cows(id) ON DELETE RESTRICT,
    heat_record_id UUID REFERENCES heat_records(id) ON DELETE SET NULL,
    breeding_date DATE NOT NULL,
    breeding_method VARCHAR(40) NOT NULL,
    bull_id UUID REFERENCES cows(id) ON DELETE SET NULL,
    bull_tag_number VARCHAR(30),
    semen_reference VARCHAR(100),
    technician_id UUID REFERENCES users(id) ON DELETE SET NULL,
    technician_name VARCHAR(100),
    veterinarian_id UUID REFERENCES users(id) ON DELETE SET NULL,
    veterinarian_name VARCHAR(100),
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50)
);

CREATE INDEX idx_breeding_cow_id ON breeding_records(cow_id);
CREATE INDEX idx_breeding_date ON breeding_records(breeding_date);
CREATE INDEX idx_breeding_status ON breeding_records(status);
CREATE INDEX idx_breeding_method ON breeding_records(breeding_method);
CREATE INDEX idx_breeding_heat_id ON breeding_records(heat_record_id);

-- 3. PREGNANCY RECORDS
CREATE TABLE pregnancy_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cow_id UUID NOT NULL REFERENCES cows(id) ON DELETE RESTRICT,
    breeding_id UUID REFERENCES breeding_records(id) ON DELETE SET NULL,
    confirmation_date DATE,
    confirmation_method VARCHAR(40),
    expected_calving_date DATE,
    pregnancy_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    confirmed_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
    confirmed_by_name VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50)
);

CREATE INDEX idx_pregnancy_cow_id ON pregnancy_records(cow_id);
CREATE INDEX idx_pregnancy_status ON pregnancy_records(pregnancy_status);
CREATE INDEX idx_pregnancy_expected_calving ON pregnancy_records(expected_calving_date);
CREATE INDEX idx_pregnancy_breeding_id ON pregnancy_records(breeding_id);

-- 4. CALVING RECORDS
CREATE TABLE calving_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cow_id UUID NOT NULL REFERENCES cows(id) ON DELETE RESTRICT,
    pregnancy_id UUID REFERENCES pregnancy_records(id) ON DELETE SET NULL,
    calving_date DATE NOT NULL,
    calving_type VARCHAR(30) NOT NULL DEFAULT 'NORMAL',
    calf_count INT NOT NULL DEFAULT 1,
    calf_details TEXT,
    complications TEXT,
    assistance_required BOOLEAN NOT NULL DEFAULT FALSE,
    veterinarian_id UUID REFERENCES users(id) ON DELETE SET NULL,
    veterinarian_name VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    CONSTRAINT chk_calf_count CHECK (calf_count >= 1)
);

CREATE INDEX idx_calving_cow_id ON calving_records(cow_id);
CREATE INDEX idx_calving_date ON calving_records(calving_date);
CREATE INDEX idx_calving_pregnancy_id ON calving_records(pregnancy_id);

-- 5. PERMISSIONS FOR BREEDING MODULE
INSERT INTO permissions (name, description, module) VALUES
    ('BREEDING_VIEW', 'View breeding, insemination, heat, and pregnancy records', 'breeding'),
    ('BREEDING_CREATE', 'Plan and record breeding and insemination events', 'breeding'),
    ('BREEDING_UPDATE', 'Update breeding and insemination records', 'breeding'),
    ('BREEDING_DELETE', 'Delete breeding records', 'breeding'),
    ('HEAT_VIEW', 'View estrus and heat detection records', 'breeding'),
    ('HEAT_CREATE', 'Log observed signs of heat and estrus', 'breeding'),
    ('HEAT_UPDATE', 'Update heat detection logs', 'breeding'),
    ('PREGNANCY_VIEW', 'View pregnancy diagnostic exams and gestation timers', 'breeding'),
    ('PREGNANCY_CREATE', 'Create pregnancy examination records', 'breeding'),
    ('PREGNANCY_UPDATE', 'Update pregnancy examination records', 'breeding'),
    ('PREGNANCY_CONFIRM', 'Confirm pregnancy diagnosis or record lost gestation', 'breeding'),
    ('CALVING_VIEW', 'View calving and birth records', 'breeding'),
    ('CALVING_CREATE', 'Record calving events and newborn calves', 'breeding'),
    ('CALVING_UPDATE', 'Update calving records', 'breeding'),
    ('BREEDING_REPORT_VIEW', 'View reproductive performance KPIs and summaries', 'breeding')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to roles
-- 1. OWNER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_OWNER' AND p.name IN (
    'BREEDING_VIEW', 'BREEDING_CREATE', 'BREEDING_UPDATE', 'BREEDING_DELETE',
    'HEAT_VIEW', 'HEAT_CREATE', 'HEAT_UPDATE',
    'PREGNANCY_VIEW', 'PREGNANCY_CREATE', 'PREGNANCY_UPDATE', 'PREGNANCY_CONFIRM',
    'CALVING_VIEW', 'CALVING_CREATE', 'CALVING_UPDATE',
    'BREEDING_REPORT_VIEW'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 2. ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_ADMIN' AND p.name IN (
    'BREEDING_VIEW', 'BREEDING_CREATE', 'BREEDING_UPDATE', 'BREEDING_DELETE',
    'HEAT_VIEW', 'HEAT_CREATE', 'HEAT_UPDATE',
    'PREGNANCY_VIEW', 'PREGNANCY_CREATE', 'PREGNANCY_UPDATE', 'PREGNANCY_CONFIRM',
    'CALVING_VIEW', 'CALVING_CREATE', 'CALVING_UPDATE',
    'BREEDING_REPORT_VIEW'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 3. MANAGER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_MANAGER' AND p.name IN (
    'BREEDING_VIEW', 'BREEDING_CREATE', 'BREEDING_UPDATE',
    'HEAT_VIEW', 'HEAT_CREATE', 'HEAT_UPDATE',
    'PREGNANCY_VIEW', 'PREGNANCY_CREATE', 'PREGNANCY_UPDATE', 'PREGNANCY_CONFIRM',
    'CALVING_VIEW', 'CALVING_CREATE', 'CALVING_UPDATE',
    'BREEDING_REPORT_VIEW'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 4. VETERINARIAN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_VETERINARIAN' AND p.name IN (
    'BREEDING_VIEW', 'BREEDING_CREATE', 'BREEDING_UPDATE',
    'HEAT_VIEW', 'HEAT_CREATE', 'HEAT_UPDATE',
    'PREGNANCY_VIEW', 'PREGNANCY_CREATE', 'PREGNANCY_UPDATE', 'PREGNANCY_CONFIRM',
    'CALVING_VIEW', 'CALVING_CREATE', 'CALVING_UPDATE',
    'BREEDING_REPORT_VIEW'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 5. WORKER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ROLE_WORKER' AND p.name IN (
    'BREEDING_VIEW', 'HEAT_VIEW', 'HEAT_CREATE', 'PREGNANCY_VIEW', 'CALVING_VIEW'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;
