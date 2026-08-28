import { useState } from "react";
import { supabase } from "../supabase";
import jsPDF from "jspdf";

export default function CreateQuotation({ onBack }) {
  const [customer, setCustomer] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    quotationNo: "",
    date: "",
    valid: "",
  });

  const [products, setProducts] = useState([
    { name: "", qty: 1, price: 0, discount: 0 },
  ]);

  const GST = 18;

  const updateProduct = (index, field, value) => {
    const data = [...products];
    data[index][field] = value;
    setProducts(data);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { name: "", qty: 1, price: 0, discount: 0 },
    ]);
  };

  const removeProduct = (index) => {
    if (products.length === 1) return;
    const data = [...products];
    data.splice(index, 1);
    setProducts(data);
  };

  const subtotal = products.reduce((sum, p) => {
    const gross = Number(p.qty) * Number(p.price);
    const net = gross - (gross * Number(p.discount)) / 100;
    return sum + net;
  }, 0);

  const gstAmount = subtotal * GST / 100;
  const total = subtotal + gstAmount;

  const saveQuotation = async () => {
    if (!customer.name || !customer.quotationNo) {
      alert("Customer Name & Quotation Number are required");
      return;
    }

    const { data, error } = await supabase
      .from("quotations")
      .insert([
        {
          quotation_number: customer.quotationNo,
          customer_name: customer.name,
          company_name: customer.company,
          email: customer.email,
          phone: customer.phone,
          quotation_date: customer.date,
          valid_until: customer.valid,
          subtotal,
          gst: gstAmount,
          total,
        },
      ])
      .select();

    if (error) {
      alert(error.message);
      return;
    }

    const quotationId = data[0].id;

    const items = products.map((p) => ({
      quotation_id: quotationId,
      product_name: p.name,
      quantity: p.qty,
      unit_price: p.price,
      discount: p.discount,
      amount:
        p.qty * p.price -
        (p.qty * p.price * p.discount) / 100,
    }));

    await supabase.from("quotation_items").insert(items);

    alert("Quotation Saved Successfully!");

    setCustomer({
      name: "",
      company: "",
      email: "",
      phone: "",
      quotationNo: "",
      date: "",
      valid: "",
    });

    setProducts([{ name: "", qty: 1, price: 0, discount: 0 }]);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("SOFTWARE QUOTATION", 20, 20);

    doc.setFontSize(11);
    doc.text(`Quotation No : ${customer.quotationNo}`, 20, 35);
    doc.text(`Customer : ${customer.name}`, 20, 45);
    doc.text(`Company : ${customer.company}`, 20, 55);
    doc.text(`Email : ${customer.email}`, 20, 65);
    doc.text(`Phone : ${customer.phone}`, 20, 75);

    let y = 90;
    doc.text("Products", 20, y);
    y += 10;

    products.forEach((p) => {
      const amount =
        p.qty * p.price -
        (p.qty * p.price * p.discount) / 100;

      doc.text(
        `${p.name} | Qty:${p.qty} | ₹${p.price} | Amount: ₹${amount.toFixed(2)}`,
        20,
        y
      );
      y += 10;
    });

    y += 10;
    doc.text(`Subtotal : ₹${subtotal.toFixed(2)}`, 20, y);
    y += 10;
    doc.text(`GST (18%) : ₹${gstAmount.toFixed(2)}`, 20, y);
    y += 10;

    doc.setFontSize(14);
    doc.text(`Grand Total : ₹${total.toFixed(2)}`, 20, y);

    doc.save(`Quotation_${customer.quotationNo}.pdf`);
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          ← Dashboard
        </button>

        <div style={styles.headerContent}>
          <h1 style={styles.title}>Create Quotation</h1>
          <p style={styles.subtitle}>
            Generate Professional Software Quotations
          </p>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.heading}>👤 Customer Information</h2>

        <div style={styles.grid2}>
          <input
            style={styles.input}
            placeholder="Customer Name"
            value={customer.name}
            onChange={(e) =>
              setCustomer({ ...customer, name: e.target.value })
            }
          />

          <input
            style={styles.input}
            placeholder="Company Name"
            value={customer.company}
            onChange={(e) =>
              setCustomer({
                ...customer,
                company: e.target.value,
              })
            }
          />

          <input
            style={styles.input}
            placeholder="Email"
            value={customer.email}
            onChange={(e) =>
              setCustomer({
                ...customer,
                email: e.target.value,
              })
            }
          />

          <input
            style={styles.input}
            placeholder="Phone Number"
            value={customer.phone}
            onChange={(e) =>
              setCustomer({
                ...customer,
                phone: e.target.value,
              })
            }
          />
        </div>

        <h2 style={styles.heading}>🧾 Quotation Details</h2>

        <div style={styles.grid3}>
          <input
            style={styles.input}
            placeholder="Quotation No"
            value={customer.quotationNo}
            onChange={(e) =>
              setCustomer({
                ...customer,
                quotationNo: e.target.value,
              })
            }
          />

          <input
            style={styles.input}
            type="date"
            value={customer.date}
            onChange={(e) =>
              setCustomer({
                ...customer,
                date: e.target.value,
              })
            }
          />

          <input
            style={styles.input}
            type="date"
            value={customer.valid}
            onChange={(e) =>
              setCustomer({
                ...customer,
                valid: e.target.value,
              })
            }
          />
        </div>

        <h2 style={styles.heading}>📦 Products</h2>

        {products.map((p, index) => (
          <div key={index} style={styles.productRow}>
            <input
              style={styles.input}
              placeholder="Product"
              value={p.name}
              onChange={(e) =>
                updateProduct(index, "name", e.target.value)
              }
            />

            <input
              style={styles.input}
              type="number"
              value={p.qty}
              onChange={(e) =>
                updateProduct(index, "qty", Number(e.target.value))
              }
            />

            <input
              style={styles.input}
              type="number"
              value={p.price}
              onChange={(e) =>
                updateProduct(index, "price", Number(e.target.value))
              }
            />

            <input
              style={styles.input}
              type="number"
              value={p.discount}
              onChange={(e) =>
                updateProduct(index, "discount", Number(e.target.value))
              }
            />

            <button
              style={styles.deleteBtn}
              onClick={() => removeProduct(index)}
            >
              ✕
            </button>
          </div>
        ))}

        <button style={styles.addBtn} onClick={addProduct}>
          + Add Product
        </button>

        <div style={styles.summary}>
          <h2>💰 Quotation Summary</h2>

          <div style={styles.row}>
            <span>Subtotal</span>
            <b>₹ {subtotal.toFixed(2)}</b>
          </div>

          <div style={styles.row}>
            <span>GST (18%)</span>
            <b>₹ {gstAmount.toFixed(2)}</b>
          </div>

          <hr />

          <div style={styles.row}>
            <h2>Total</h2>
            <h2 style={{ color: "#059669" }}>
              ₹ {total.toFixed(2)}
            </h2>
          </div>

          <div style={styles.buttonGroup}>
            <button style={styles.saveBtn} onClick={saveQuotation}>
              💾 Save
            </button>

            <button style={styles.pdfBtn} onClick={downloadPDF}>
              📄 Download PDF
            </button>
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
    marginBottom: 25,
    position: "relative",
  },

  headerContent: {
    textAlign: "center",
  },

  backBtn: {
    position: "absolute",
    left: 20,
    top: 20,
    background: "#fff",
    color: "#2563eb",
    border: "none",
    borderRadius: 8,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  title: {
    margin: 0,
    fontSize: 30,
    fontWeight: "bold",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 15,
    opacity: 0.95,
  },

  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 25,
    boxShadow: "0 5px 18px rgba(0,0,0,.1)",
  },

  heading: {
    color: "#1e40af",
    marginTop: 20,
  },

  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 15,
  },

  grid3: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 15,
  },

  productRow: {
    display: "grid",
    gridTemplateColumns: "2fr .8fr 1fr 1fr auto",
    gap: 10,
    marginBottom: 10,
    background: "#f8fafc",
    padding: 10,
    borderRadius: 10,
  },

  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #d1d5db",
  },

  addBtn: {
    marginTop: 10,
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    width: 40,
    borderRadius: 8,
    cursor: "pointer",
  },

  summary: {
    background: "#f8fafc",
    borderRadius: 12,
    padding: 20,
    marginTop: 30,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    margin: "10px 0",
  },

  buttonGroup: {
    display: "flex",
    gap: 10,
    marginTop: 20,
  },

  saveBtn: {
    flex: 1,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: 14,
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
  },

  pdfBtn: {
    flex: 1,
    background: "#059669",
    color: "#fff",
    border: "none",
    padding: 14,
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
  },
};