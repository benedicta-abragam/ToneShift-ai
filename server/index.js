const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const rewriteRoute = require('./routes/rewrite');

if (!process.env.GROQ_API_KEY) {
  console.error('FATAL: GROQ_API_KEY is not set. The rewrite feature cannot function without it.');
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.warn('WARNING: MONGO_URI is not set. Rewrite history will not be saved.');
}

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/rewrite', rewriteRoute);

app.get('/', (req, res) => {
  res.send('ToneShift server is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});