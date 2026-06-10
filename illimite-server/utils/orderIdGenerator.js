function generateOrderId(customerName) {
  const sanitized = customerName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20) || 'Customer';
  const digits = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
  const letters = Array.from({ length: 4 }, () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return chars[Math.floor(Math.random() * chars.length)];
  }).join('');
  return `${sanitized}-${digits}${letters}`;
}

module.exports = { generateOrderId };
