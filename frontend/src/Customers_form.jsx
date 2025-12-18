import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function CustomerForm() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    image: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id && id !== 'create') {
      setLoading(true);
      fetch(`http://localhost:3000/customers/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Not found');
          return res.json();
        })
        .then(data => setCustomer({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          gender: data.gender || '',
          image: data.image || ''
        }))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id === 'create') {
        const params = new URLSearchParams(customer);
        await fetch(`http://localhost:3000/customers?${params.toString()}`, { method: 'POST' });
      } else {
        await fetch(`http://localhost:3000/customers/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customer)
        });
      }
      navigate('/customers');
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this customer?')) return;
    setLoading(true);
    try {
      await fetch(`http://localhost:3000/customers/${id}`, { method: 'DELETE' });
      navigate('/customers');
    } catch (err) {
      setError('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container py-4">Loading...</div>;
  if (error) return <div className="container py-4 text-danger">Error: {error}</div>;

  return (
    <div className="container py-4">
      <h3 className="mb-3">{id === 'create' ? 'Create customer' : 'Edit customer'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="form-label">First name</label>
          <input name="first_name" value={customer.first_name} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-2">
          <label className="form-label">Last name</label>
          <input name="last_name" value={customer.last_name} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-2">
          <label className="form-label">Email</label>
          <input name="email" value={customer.email} onChange={handleChange} className="form-control" type="email" />
        </div>
        <div className="mb-2">
          <label className="form-label">Gender</label>
           <select
            name="gender"
            value={customer.gender}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input name="image" value={customer.image} onChange={handleChange} className="form-control" />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">{id === 'create' ? 'Create' : 'Save'}</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/customers')}>Cancel</button>
          {id !== 'create' && (
            <button type="button" className="btn btn-danger ms-auto" onClick={handleDelete}>Delete</button>
          )}
        </div>
      </form>
    </div>
  );
}