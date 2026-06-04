import React from 'react';

const OrderHistoryPage = () => {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
          <p className="mt-2 text-slate-600">View your recent order activity.</p>
        </div>

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">#ORD-1001</td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">June 1, 2026</td>
                  <td className="px-6 py-4 text-slate-600">Minimal Chair, Ceramic Table Lamp</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Delivered
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-slate-900">$200</td>
                </tr>

                <tr>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">#ORD-1002</td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">June 2, 2026</td>
                  <td className="px-6 py-4 text-slate-600">Cotton Throw Pillow</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                      Pending
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-slate-900">$50</td>
                </tr>

                <tr>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">#ORD-1003</td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">June 3, 2026</td>
                  <td className="px-6 py-4 text-slate-600">Wireless Speaker, Desk Organizer</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Delivered
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-slate-900">$165</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};

export default OrderHistoryPage;
