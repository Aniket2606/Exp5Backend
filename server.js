const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const readData = () => {
  const data = fs.readFileSync('data.json');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

app.get('/employees', (req, res) => {
  const employees = readData();
  res.json(employees);
});

app.post('/employees', (req, res) => {
  const employees = readData();
  const newEmployee = req.body;
  employees.push(newEmployee);
  writeData(employees);
  res.status(201).json(newEmployee);
});

app.put('/employees/:id', (req, res) => {
  const employees = readData();
  const id = req.params.id;
  const updatedFields = req.body; // Only the fields to update

  const index = employees.findIndex((emp) => emp.id === id);
  if (index !== -1) {
    // Update only the fields present in updatedFields
    employees[index] = { ...employees[index], ...updatedFields };
    writeData(employees);
    res.json(employees[index]);
  } else {
    res.status(404).json({ message: 'Employee not found' });
  }
});

app.delete('/employees/:id', (req, res) => {
  const employees = readData(); 
  const { id } = req.params; 
  const employeeIndex = employees.findIndex(emp => emp.id === id);

  if (employeeIndex !== -1) {
    employees.splice(employeeIndex, 1);
    writeData(employees);
    res.status(200).json({ deleted: true });
  } else {
    res.status(404).json({ deleted: false, message: 'Employee ID not found' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
