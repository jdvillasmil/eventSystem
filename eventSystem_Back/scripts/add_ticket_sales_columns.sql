-- Add ticket_price to events
ALTER TABLE events ADD COLUMN IF NOT EXISTS ticket_price NUMERIC(10, 2) DEFAULT 0;

-- Add payment fields to registrations
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'PENDING'; -- PENDING, PAID
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS amount_paid NUMERIC(10, 2) DEFAULT 0;
