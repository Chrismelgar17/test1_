import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Customers from './Customers';
import CustomerForm from './Customers_form';
import Home from './Home';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App(){
  return (
    <BrowserRouter>
    <nav>
        <Link to="/">Home</Link> | <Link to="/customers">Customers</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomerForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;