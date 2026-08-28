import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function QuotationDetails({ quotationId, onBack }) {
  const [quotation, setQuotation] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadQuotation();
  }, []);

  const loadQuotation = async () => {
    const { data } = await supabase
      .from("quotations")
      .select("*")
      .eq("id", quotationId)
      .single();

    setQuotation(data);

    const { data: products } = await supabase
      .from("quotation_items")
      .select("*")
      .eq("quotation_id", quotationId);

    setItems(products || []);
  };

  if (!quotation) {
    return (
      <h2 style={{ textAlign: "center", marginTop: 80 }}>
        Loading...
      </h2>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          ← Back
        </button>

        <div style={styles.headerText}>
          <h1 style={styles.title}>Software Quotation</h1>
          <p style={styles.subtitle}>Professional Invoice Details</p>
        </div>
      </div>

      {/* Invoice Card */}
      <div style={styles.card}>
        <div style={styles.topRow}>
          <div>
            <h2 style={{ margin: 0 }}>SOFTWARE QUOTATION</h2>
            <p style={{ color: "#64748b" }}>
              Quotation No: {quotation.quotation_number}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <p>
              <b>Date:</b> {quotation.quotation_date}
            </p>
            <p>
              <b>Valid:</b> {quotation.valid_until}
            </p>
          </div>
        </div>

        <hr />

        {/* Customer */}
        <h3 style={styles.section}>Customer Information</h3>

        <div style={styles.infoGrid}>
          <div>
            <span style={styles.label}>Customer</span>
            <p>{quotation.customer_name}</p>
          </div>

          <div>
            <span style={styles.label}>Company</span>
            <p>{quotation.company_name}</p>
          </div>

          <div>
            <span style={styles.label}>Email</span>
            <p>{quotation.email}</p>
          </div>

          <div>
            <span style={styles.label}>Phone</span>
            <p>{quotation.phone}</p>
          </div>
        </div>

        {/* Products */}
        <h3 style={styles.section}>Products</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Disc%</th>
              <th style={styles.th}>Amount</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td style={styles.td}>{item.product_name}</td>
                <td style={styles.td}>{item.quantity}</td>
                <td style={styles.td}>
                  ₹ {Number(item.unit_price).toFixed(2)}
                </td>
                <td style={styles.td}>{item.discount}%</td>
                <td style={styles.td}>
                  ₹ {Number(item.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div style={styles.totalBox}>
          <div style={styles.totalRow}>
            <span>Subtotal</span>
            <b>₹ {Number(quotation.subtotal).toFixed(2)}</b>
          </div>

          <div style={styles.totalRow}>
            <span>GST (18%)</span>
            <b>₹ {Number(quotation.gst).toFixed(2)}</b>
          </div>

          <hr />

          <div style={styles.grandRow}>
            <span>Grand Total</span>
            <span>₹ {Number(quotation.total).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#eef4ff",
    padding: 30,
    fontFamily: "Arial, sans-serif",
  },

  header: {
    background: "linear-gradient(135deg,#2563eb,#7c3aed)",
    color: "white",
    borderRadius: 20,
    padding: 25,
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 25,
  },

  backBtn: {
    background: "#fff",
    color: "#2563eb",
    border: "none",
    borderRadius: 8,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  headerText: {
    flex: 1,
    textAlign: "center",
    marginRight: 70,
  },

  title: {
    margin: 0,
    fontSize: 34,
  },

  subtitle: {
    marginTop: 6,
    opacity: 0.9,
  },

  card: {
    background: "#fff",
    borderRadius: 18,
    padding: 28,
    maxWidth: 1000,
    margin: "0 auto",
    boxShadow: "0 8px 20px rgba(0,0,0,.08)",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  section: {
    color: "#1e40af",
    marginTop: 20,
    marginBottom: 15,
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },

  label: {
    color: "#64748b",
    fontSize: 13,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 10,
  },

  th: {
    background: "#2563eb",
    color: "white",
    padding: 12,
  },

  td: {
    padding: 12,
    borderBottom: "1px solid #e5e7eb",
    textAlign: "center",
  },

  totalBox: {
    width: 320,
    marginLeft: "auto",
    marginTop: 30,
    background: "#f8fafc",
    borderRadius: 12,
    padding: 20,
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  grandRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 22,
    fontWeight: "bold",
    color: "#059669",
  },
};