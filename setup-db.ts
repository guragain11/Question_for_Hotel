import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Create table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS survey_responses (
        id SERIAL PRIMARY KEY,
        hotel_name VARCHAR(255),
        email VARCHAR(255),
        contact_number VARCHAR(20),
        location VARCHAR(255),
        current_software TEXT,
        biggest_problem TEXT,
        advanced_features TEXT,
        form_data JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Add columns if they don't exist (for existing dbs using older schema)
    const newColumns = [
      'ADD COLUMN IF NOT EXISTS location_other TEXT',
      'ADD COLUMN IF NOT EXISTS current_software_other TEXT',
      'ADD COLUMN IF NOT EXISTS payment_structure VARCHAR(50)',
      'ADD COLUMN IF NOT EXISTS payment_structure_other TEXT',
      'ADD COLUMN IF NOT EXISTS current_payment VARCHAR(100)',
      'ADD COLUMN IF NOT EXISTS payment_model VARCHAR(50)',
      'ADD COLUMN IF NOT EXISTS payment_model_other TEXT',
      'ADD COLUMN IF NOT EXISTS migration_willingness INTEGER DEFAULT 0',
      'ADD COLUMN IF NOT EXISTS migration_willingness_other TEXT',
      'ADD COLUMN IF NOT EXISTS ota_percentage VARCHAR(100)',
      'ADD COLUMN IF NOT EXISTS has_website VARCHAR(50)',
      'ADD COLUMN IF NOT EXISTS has_website_other TEXT',
      'ADD COLUMN IF NOT EXISTS mobile_app_importance INTEGER DEFAULT 0',
      'ADD COLUMN IF NOT EXISTS mobile_app_importance_other TEXT',
      'ADD COLUMN IF NOT EXISTS seasonal_pricing_difficulty VARCHAR(50)',
      'ADD COLUMN IF NOT EXISTS seasonal_pricing_difficulty_other TEXT',
      'ADD COLUMN IF NOT EXISTS multiple_properties VARCHAR(50)',
      'ADD COLUMN IF NOT EXISTS multiple_properties_other TEXT',
      'ADD COLUMN IF NOT EXISTS overbooking_frequency VARCHAR(50)',
      'ADD COLUMN IF NOT EXISTS overbooking_frequency_other TEXT',
      'ADD COLUMN IF NOT EXISTS automated_messages VARCHAR(50)',
      'ADD COLUMN IF NOT EXISTS automated_messages_other TEXT',
      'ADD COLUMN IF NOT EXISTS extra_services_upsell VARCHAR(50)',
      'ADD COLUMN IF NOT EXISTS extra_services_upsell_other TEXT',
      'ADD COLUMN IF NOT EXISTS has_hotel_management_system VARCHAR(50)',
      'ADD COLUMN IF NOT EXISTS hotel_management_system_name VARCHAR(255)',
      'ADD COLUMN IF NOT EXISTS why_not_using_hms TEXT',
      'ADD COLUMN IF NOT EXISTS would_use_custom_hms VARCHAR(50)',
      'ADD COLUMN IF NOT EXISTS would_use_custom_hms_other TEXT',
      'ADD COLUMN IF NOT EXISTS hms_requirements TEXT',
      'ADD COLUMN IF NOT EXISTS hms_max_budget VARCHAR(100)',
      'ADD COLUMN IF NOT EXISTS custom_questions JSONB',
      'ADD COLUMN IF NOT EXISTS form_data JSONB',
    ];

    for (const col of newColumns) {
      await pool.query(`ALTER TABLE survey_responses ${col};`);
    }

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_survey_created_at 
      ON survey_responses(created_at DESC);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_survey_hotel_name 
      ON survey_responses(hotel_name);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_survey_form_data 
      ON survey_responses USING gin(form_data);
    `);

    console.log('Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
