import React from 'react';

const CheckoutPage = () => {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
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
                />
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-6 text-xl font-semibold text-slate-900">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">Minimal Chair</p>
                  <p className="text-sm text-slate-500">Qty: 1</p>
                </div>
                <p className="font-medium text-slate-900">$120</p>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">Ceramic Table Lamp</p>
                  <p className="text-sm text-slate-500">Qty: 1</p>
                </div>
                <p className="font-medium text-slate-900">$80</p>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">Cotton Throw Pillow</p>
                  <p className="text-sm text-slate-500">Qty: 2</p>
                </div>
                <p className="font-medium text-slate-900">$50</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 border-t border-slate-200 pt-5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>$250</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-900">
                <span>Total</span>
                <span>$250</span>
              </div>
            </div>

            <button className="mt-6 w-full rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800">
              Place Order
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
