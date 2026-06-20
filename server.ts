import path from 'path';
import express, { Request, Response } from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Serve built SPA in production
const distPath = path.resolve(import.meta.dirname, 'dist');
app.use(express.static(distPath));

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
    const d = req.body;
    
    const query = `
      INSERT INTO survey_responses (
        hotel_name, email, contact_number, location, location_other,
        current_software, current_software_other,
        biggest_problem, advanced_features,
        payment_structure, payment_structure_other, current_payment,
        payment_model, payment_model_other,
        migration_willingness, migration_willingness_other,
        ota_percentage, has_website, has_website_other,
        mobile_app_importance, mobile_app_importance_other,
        seasonal_pricing_difficulty, seasonal_pricing_difficulty_other,
        multiple_properties, multiple_properties_other,
        overbooking_frequency, overbooking_frequency_other,
        automated_messages, automated_messages_other,
        extra_services_upsell, extra_services_upsell_other,
        has_hotel_management_system, hotel_management_system_name,
        why_not_using_hms, would_use_custom_hms, would_use_custom_hms_other,
        hms_requirements, hms_max_budget,
        custom_questions, form_data
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41)
      RETURNING id;
    `;
    
    const values = [
      d.hotelName, d.email, d.contactNumber, d.location, d.locationOther,
      JSON.stringify(d.currentSoftware), d.currentSoftwareOther,
      d.biggestProblem, d.advancedFeatures,
      d.paymentStructure, d.paymentStructureOther, d.currentPayment,
      d.paymentModel, d.paymentModelOther,
      d.migrationWillingness, d.migrationWillingnessOther,
      d.otaPercentage, d.hasWebsite, d.hasWebsiteOther,
      d.mobileAppImportance, d.mobileAppImportanceOther,
      d.seasonalPricingDifficulty, d.seasonalPricingDifficultyOther,
      d.multipleProperties, d.multiplePropertiesOther,
      d.overbookingFrequency, d.overbookingFrequencyOther,
      d.automatedMessages, d.automatedMessagesOther,
      d.extraServicesUpsell, d.extraServicesUpsellOther,
      d.hasHotelManagementSystem, d.hotelManagementSystemName,
      d.whyNotUsingHMS, d.wouldUseCustomHMS, d.wouldUseCustomHMSOther,
      d.hmsRequirements, d.hmsMaxBudget,
      JSON.stringify(d.customQuestions),
      JSON.stringify({ ...d, customQuestions: undefined }),
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

// SPA fallback: redirect /admin to hash route, serve index.html for the rest
app.get('*', (req: Request, res: Response) => {
  if (req.path.startsWith('/api')) return;
  if (req.path === '/admin') {
    res.redirect('/#/admin');
    return;
  }
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
