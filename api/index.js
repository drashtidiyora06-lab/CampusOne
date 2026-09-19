import app from '../backend/app.js';
import { connectDB } from '../backend/config/db.js';
import { seedDatabase } from '../backend/utils/seed.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    await seedDatabase();
  } catch (err) {
    console.error('[Vercel Serverless Error]', err);
  }
  return app(req, res);
}
