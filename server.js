const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Sample data (in a real app, this would come from a database)
let beneficiaries = [
  {
    id: 1,
    fullName: "John Doe",
    phoneNumber: "1234567890",
    email: "john@example.com",
    address: "123 Main St, City",
    dateOfBirth: "1990-01-15",
    gender: "Male",
    education: "High School",
    skills: ["Plumbing", "Electrician"],
    experience: "2 years"
  },
  {
    id: 2,
    fullName: "Jane Smith",
    phoneNumber: "0987654321",
    email: "jane@example.com",
    address: "456 Oak Ave, Town",
    dateOfBirth: "1985-05-20",
    gender: "Female",
    education: "Bachelor's",
    skills: ["Cook", "Maid"],
    experience: "5 years"
  }
];

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.get('/api/beneficiaries', (req, res) => {
  res.json(beneficiaries);
});

app.post('/api/beneficiaries', (req, res) => {
  const newBeneficiary = {
    id: beneficiaries.length + 1,
    ...req.body
  };
  beneficiaries.push(newBeneficiary);
  res.status(201).json(newBeneficiary);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
