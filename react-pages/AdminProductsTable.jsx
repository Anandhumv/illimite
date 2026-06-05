import { useEffect, useState } from 'react';

export default function AdminProductsTable() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/api/admin/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load products');
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <p style={{ padding: '24px', color: '#6b7280' }}>Loading products...</p>
    );

    if (error) return (
        <p style={{ padding: '24px', color: '#ef4444' }}>{error}</p>
    );

    if (products.length === 0) return (
        <p style={{ padding: '24px', color: '#6b7280' }}>No active products found</p>
    );

    return (
        <div style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
                Active Products
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        {['Name', 'Price', 'Stock', 'Category', 'Actions'].map(col => (
                            <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '500', color: '#374151' }}>
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '12px 16px', color: '#1f2937' }}>{product.name}</td>
                            <td style={{ padding: '12px 16px', color: '#1f2937' }}>${product.price}</td>
                            <td style={{ padding: '12px 16px', color: '#1f2937' }}>{product.stock}</td>
                            <td style={{ padding: '12px 16px', color: '#1f2937' }}>{product.category}</td>
                            <td style={{ padding: '12px 16px', display: 'flex', gap: '8px' }}>
                                <button style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#fff', cursor: 'pointer', color: '#374151' }}>
                                    Edit
                                </button>
                                <button style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #fca5a5', backgroundColor: '#fff', cursor: 'pointer', color: '#ef4444' }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}