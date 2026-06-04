import React, { useState } from 'react';

const CheckoutPage = () => {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const cartItems = [
    { name: 'Product A', qty: 1, price: 29.99 },
    { name: 'Product B', qty: 2, price: 14.99 }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !address || !city || !pincode || !phone) {
      setError('Please fill all fields.');
      return;
    }
    setError('');
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-6 text-xl font-semibold text-slate-900">Shipping Information</h2>

            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  id="fullName"
                  placeholder="Enter your full name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="address">
                  Address
                </label>
                <input
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  id="address"
                  placeholder="House number, street, area"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="city">
                    City
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    id="city"
                    placeholder="City"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="pincode">
                    Pincode
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    id="pincode"
                    placeholder="Pincode"
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="phone">
                  Phone
                </label>
                <input
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  id="phone"
                  placeholder="Phone number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-sm font-medium text-red-600">{error}</p>
              )}
            </div>
          </section>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-6 text-xl font-semibold text-slate-900">Order Summary</h2>

            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">Qty: {item.qty}</p>
                  </div>
                  <p className="font-medium text-slate-900">${item.price}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-slate-200 pt-5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${cartItems.reduce((sum, item) => sum + item.qty * item.price, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-900">
                <span>Total</span>
                <span>${cartItems.reduce((sum, item) => sum + item.qty * item.price, 0).toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" className="mt-6 w-full rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800">
              Place Order
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
};

export default CheckoutPage;
