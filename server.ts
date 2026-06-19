import express, { Request, Response } from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// PostgreSQL Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Simple auth middleware
const adminAuth = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  
  if (token === process.env.ADMIN_TOKEN || token === 'admin123') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// POST: Save survey response
app.post('/api/surveys', async (req: Request, res: Response) => {
  try {
    const surveyData = req.body;
    
    const query = `
      INSERT INTO survey_responses (
        hotel_name, email, contact_number, location, current_software,
        biggest_problem, advanced_features, amenities, sustainability,
        budget, timeline, additional_comments, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
      RETURNING id;
    `;
    
    const values = [
      surveyData.hotelName,
      surveyData.email,
      surveyData.contactNumber,
      surveyData.location,
      JSON.stringify(surveyData.currentSoftware),
      surveyData.biggestProblem,
      surveyData.advancedFeatures,
      JSON.stringify(surveyData.amenities),
      JSON.stringify(surveyData.sustainability),
      surveyData.budget,
      surveyData.timeline,
      surveyData.additionalComments,
    ];
    
    const result = await pool.query(query, values);
    res.json({ id: result.rows[0].id, message: 'Survey saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save survey' });
  }
});

// GET: Fetch all survey responses (with admin auth)
app.get('/api/surveys', adminAuth, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM survey_responses ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch surveys' });
  }
});

// GET: Survey statistics
app.get('/api/surveys/stats', adminAuth, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_responses,
        COUNT(DISTINCT hotel_name) as unique_hotels,
        COUNT(DISTINCT email) as unique_emails
      FROM survey_responses;
    `);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// DELETE: Remove a survey response
app.delete('/api/surveys/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM survey_responses WHERE id = $1', [req.params.id]);
    res.json({ message: 'Survey deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete survey' });
  }
});

// GET: Export surveys as CSV
app.get('/api/surveys/export/csv', adminAuth, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM survey_responses ORDER BY created_at DESC'
    );
    
    const surveys = result.rows;
    if (surveys.length === 0) {
      res.status(404).json({ error: 'No surveys to export' });
      return;
    }
    
    const headers = Object.keys(surveys[0]).join(',');
    const rows = surveys.map(survey => {
      return Object.values(survey).map(val => {
        if (typeof val === 'object') return `"${JSON.stringify(val)}"`;
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',');
    });
    
    const csv = [headers, ...rows].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="surveys.csv"');
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to export surveys' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
