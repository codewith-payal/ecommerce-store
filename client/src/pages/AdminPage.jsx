import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api/products';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  image: '',
  countInStock: '',
};

function AdminPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  const loadProducts = () => {
    axios
      .get(API)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (!user || !user.isAdmin) return <Navigate to="/" />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const body = {
      ...form,
      price: Number(form.price),
      countInStock: Number(form.countInStock),
    };
    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, body, config);
      } else {
        await axios.post(API, body, config);
      }
      setForm(emptyForm);
      setEditingId(null);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      image: p.image,
      countInStock: p.countInStock,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API}/${id}`, config);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete product.');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="container">
      <h2 className="page-title">Admin Dashboard</h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit product' : 'Add product'}</h3>
        {error && <p className="form-error">{error}</p>}

        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <input name="price" type="number" min="0" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="countInStock" type="number" min="0" placeholder="Stock" value={form.countInStock} onChange={handleChange} required />
        <input name="image" placeholder="Image link (https://...)" value={form.image} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />

        <div className="admin-buttons">
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Update product' : 'Add product'}
          </button>
          {editingId && (
            <button type="button" className="cancel-btn" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="cart-list">
        {products.map((p) => (
          <div key={p._id} className="cart-item">
            <img src={p.image} alt={p.name} />
            <div className="cart-item-info">
              <h3>{p.name}</h3>
              <p>₹{p.price} · Stock: {p.countInStock}</p>
            </div>
            <button className="edit-btn" onClick={() => handleEdit(p)}>Edit</button>
            <button className="remove-btn" onClick={() => handleDelete(p._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;