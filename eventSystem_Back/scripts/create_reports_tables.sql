-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    category VARCHAR(100),
    expense_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create incomes table
CREATE TABLE IF NOT EXISTS incomes (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    source VARCHAR(100),
    income_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add status column to events if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'status'
    ) THEN
        ALTER TABLE events ADD COLUMN status VARCHAR(50) DEFAULT 'PLANNED';
    END IF;
END $$;

-- Update existing events to have PLANNED status
UPDATE events SET status = 'PLANNED' WHERE status IS NULL;
