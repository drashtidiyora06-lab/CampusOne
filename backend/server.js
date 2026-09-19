import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seed.js';

const PORT = process.env.PORT || 5000;

// Start Server and Seed Database
const startServer = async () => {
  await connectDB();
  await seedDatabase();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🚀 CampusOne Shared REST API running on 0.0.0.0:${PORT}`);
    console.log(`👉 Base API: http://localhost:${PORT}/api`);
    console.log(`=======================================================`);
  });
};

startServer();
