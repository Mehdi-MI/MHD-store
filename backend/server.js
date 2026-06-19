require('dotenv').config();
const app       = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 MHD Store API running on port ${PORT}`);
    console.log(`   Environment : ${process.env.NODE_ENV}`);
    console.log(`   Docs        : http://localhost:${PORT}/api\n`);
  });
};

startServer();

// Handle unhandled rejections — shut down gracefully
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err.message);
  process.exit(1);
});
