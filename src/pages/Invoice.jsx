export default function Invoice({ customer, products, subtotal, gst, total }) {
  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>
        SOFTWARE QUOTATION
      </h1>

      <hr />

      <h3>Customer Details</h3>
      <p><b>Name:</b> {customer.name}</p>
      <p><b>Company:</b> {customer.company}</p>
      <p><b>Email:</b> {customer.email}</p>
      <p><b>Phone:</b> {customer.phone}</p>

      <h3>Products</h3>

      <table border="1" cellPadding="8" width="100%" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p, i) => (
            <tr key={i}>
              <td>{p.name}</td>
              <td>{p.qty}</td>
              <td>₹ {p.price}</td>
              <td>{p.discount}%</td>
              <td>
                ₹ {p.qty * p.price - (p.qty * p.price * p.discount) / 100}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: "right", marginTop: 20 }}>
        <h3>Subtotal: ₹ {subtotal.toFixed(2)}</h3>
        <h3>GST: ₹ {gst.toFixed(2)}</h3>
        <h2>Total: ₹ {total.toFixed(2)}</h2>
      </div>
    </div>
  );
}