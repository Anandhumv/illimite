import { useEffect } from 'react';
import { useCart } from './CartContext';

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.99;

function CartSidebar({ onCheckout }) {
  const { items, isOpen, closeCart, increment, decrement, removeItem } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => { if (e.key === 'Escape') closeCart(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeCart]);

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : items.length ? SHIPPING_COST : 0;
  const grandTotal = subtotal + tax + shipping;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={closeCart}
      />

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Your Cart</h2>
            <p className="text-sm text-slate-500">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
          </div>
          <button
            onClick={closeCart}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mb-4 h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <p className="text-sm font-medium text-slate-500">Your cart is empty</p>
              <p className="mt-1 text-xs text-slate-400">Add items to get started</p>
              <button
                onClick={closeCart}
                className="mt-6 rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 py-4">
                  {/* Image */}
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-400">No img</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-medium text-slate-900">{item.name}</h3>
                        <p className="mt-0.5 text-sm text-slate-500">${item.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="ml-2 flex-shrink-0 rounded p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        aria-label={`Remove ${item.name}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => decrement(item.productId)}
                        className="flex h-7 w-7 items-center justify-center rounded border border-slate-300 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-slate-900">{item.qty}</span>
                      <button
                        onClick={() => increment(item.productId)}
                        className="flex h-7 w-7 items-center justify-center rounded border border-slate-300 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                      >
                        +
                      </button>
                      <span className="ml-auto text-sm font-medium text-slate-900">
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-200 px-6 py-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-slate-400">
                  Free shipping on orders over ${FREE_SHIPPING_THRESHOLD}
                </p>
              )}
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="mt-4 w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:bg-slate-950"
            >
              Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default CartSidebar;
