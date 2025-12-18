const express = require('express');
const path = require('path');
const FileSystem = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors()); // allow all origins
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello, Node.js world!');
});

app.get('/customers',(req,res)=>{
    const filePath = path.join(__dirname, 'customers.json');
    FileSystem.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading customer data');
            return;
        }
        res.send(JSON.parse(data));
    });
});


app.get('/customers/:id',(req,res)=>{
    const customerId = req.params.id;
    const filePath = path.join(__dirname, 'customers.json');
    FileSystem.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading customer data');
            return;
        }
        const customers = JSON.parse(data);
        const customer = customers.find(c => c.id === parseInt(customerId));
        if (customer) {
            res.send(customer);
        } else {
            res.status(404).send('Customer not found');
        }
    });
});

app.post('/customers',(req,res)=>{
    const filePath = path.join(__dirname, 'customers.json');
    FileSystem.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading customer data');
        const customers = JSON.parse(data);
        const maxId = customers.reduce((max, customer) => customer.id > max ? customer.id : max, 0);
        
        const newCustomer = {
            id: maxId + 1,
            first_name: req.query.first_name || 'Unnamed',
            last_name: req.query.last_name || 'Unnamed',
            email: req.query.email || '',
            gender: req.query.gender || '',
            image: req.query.image || ''
        };
        customers.push(newCustomer);
        FileSystem.writeFile(filePath, JSON.stringify(customers, null, 2), (err) => {
            if (err) return res.status(500).send('Error saving customer data');
            res.status(201).send(newCustomer);
        });
    });
});

app.put('/customers/:id',(req,res)=>{
    const customerId = req.params.id;
    const filePath = path.join(__dirname, 'customers.json');
    FileSystem.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading customer data');
        let customers = JSON.parse(data);
        const index = customers.findIndex(c => Number(c.id) === Number(customerId));
        if (index === -1) {
            return res.status(404).send('Customer not found');
        }
        customers[index] = { ...customers[index], ...req.body };
        FileSystem.writeFile(filePath, JSON.stringify(customers, null, 2), (err) => {
            if (err) return res.status(500).send('Error saving customer data');
            res.send(customers[index]);
        });
    });
});

app.delete('/customers/:id',(req,res)=>{
    const customerId = req.params.id;
    const filePath = path.join(__dirname, 'customers.json');
    FileSystem.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading customer data');
        let customers = JSON.parse(data);
        const index = customers.findIndex(c => Number(c.id) === Number(customerId));
        if (index === -1) {
            return res.status(404).send('Customer not found');
        }
        customers.splice(index, 1);
        FileSystem.writeFile(filePath, JSON.stringify(customers, null, 2), (err) => {
            if (err) return res.status(500).send('Error saving customer data');
            res.send('Customer deleted successfully');
        });
    });
});