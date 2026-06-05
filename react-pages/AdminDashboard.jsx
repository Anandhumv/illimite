export default function AdminDashboard() {
    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f3f4f6' }}>

            {/* Sidebar */}
            <div style={{ width: '256px', backgroundColor: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>

                {/* Brand */}
                <div style={{ height: '64px', display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ fontWeight: '600', fontSize: '18px' }}>Admin Panel</span>
                </div>

                {/* Nav Links */}
                <nav style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {['Dashboard', 'Products', 'Orders', 'Users'].map((item) => (
                        <a key={item} href="#" style={{ padding: '8px 12px', borderRadius: '6px', fontSize: '14px', color: '#374151', textDecoration: 'none' }}
                            onMouseEnter={e => e.target.style.backgroundColor = '#f3f4f6'}
                            onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>
                            {item}
                        </a>
                    ))}
                </nav>
            </div>

            {/* Main Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* Top Bar */}
                <div style={{ height: '64px', backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
                    <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>Dashboard</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>Admin User</span>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: '500' }}>
                            A
                        </div>
                    </div>
                </div>

                {/* Empty Content Area */}
                <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Content will load here</p>
                    </div>
                </main>

            </div>
        </div>
    )
}