const express = require('express');
const cors = require('cors');
const teacherRoutes = require('./routes/teacherRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/teachers', teacherRoutes);
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Learning Platform API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});