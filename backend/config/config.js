const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI ,
  jwtSecret: process.env.JWT_SECRET ,
  openaiApiKey: process.env.GOOGLE_GENAI_API_KEY,
};
