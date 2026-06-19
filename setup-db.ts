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
    
    // Create table if it doesn't exist
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
        amenities TEXT,
        sustainability TEXT,
        budget VARCHAR(100),
        timeline VARCHAR(100),
        additional_comments TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Create index on created_at for faster queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_survey_created_at 
      ON survey_responses(created_at DESC);
    `);
    
    // Create index on hotel_name for filtering
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_survey_hotel_name 
      ON survey_responses(hotel_name);
    `);
    
    console.log('Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
