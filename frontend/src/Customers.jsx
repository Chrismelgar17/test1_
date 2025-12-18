import { useEffect, useState } from 'react';

function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/customers')
      .then(res => res.json())
      .then(data => setCustomers(data));
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Customer List</h2>
      <button className="btn btn-success mb-3" onClick={() => window.location.href = '/customers/create'}>Add New Customer</button>
      <div className="row g-3">
        {customers.map(u => (
          <div key={u.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100">
              <img src={u.image} className="card-img-top" alt="avatar" style={{height:140, objectFit:'cover'}}/>
              <div className="card-body">
                <h6 className="card-title mb-1">{u.first_name} {u.last_name}</h6>
                <p className="card-text text-truncate mb-0">{u.email}</p>
                <button className="btn btn-sm btn-primary mt-2" onClick={() => window.location.href = `/customers/${u.id}`}>Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Customers;