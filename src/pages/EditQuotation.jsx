import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function EditQuotation({ quotationId, onBack }) {
  const [customer, setCustomer] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    quotationNo: "",
    date: "",
    valid: "",
  });

  const [products, setProducts] = useState([]);
  const GST = 18;

  useEffect(() => {
    loadQuotation();
  }, []);

  const loadQuotation = async () => {
    const { data } = await supabase
      .from("quotations")
      .select("*")
      .eq("id", quotationId)
      .single();

    setCustomer({
      name: data.customer_name,
      company: data.company_name,
      email: data.email,
      phone: data.phone,
      quotationNo: data.quotation_number,
      date: data.quotation_date,
      valid: data.valid_until,
    });

    const { data: items } = await supabase
      .from("quotation_items")
      .select("*")
      .eq("quotation_id", quotationId);

    setProducts(
      items.map((i) => ({
        id: i.id,
        name: i.product_name,
        qty: i.quantity,
        price: i.unit_price,
        discount: i.discount,
      }))
    );
  };

  const updateProduct = (index, field, value) => {
    const temp = [...products];
    temp[index][field] = value;
    setProducts(temp);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      {
        id: null,
        name: "",
        qty: 1,
        price: 0,
        discount: 0,
      },
    ]);
  };

  const removeProduct = async (index) => {
    const product = products[index];

    if (product.id) {
      await supabase
        .from("quotation_items")
        .delete()
        .eq("id", product.id);
    }

    const temp = [...products];
    temp.splice(index, 1);
    setProducts(temp);
  };

  const subtotal = products.reduce((sum, p) => {
    const gross = Number(p.qty) * Number(p.price);
    return sum + (gross - (gross * Number(p.discount)) / 100);
  }, 0);

  const gst = subtotal * GST / 100;
  const total = subtotal + gst;

  const updateQuotation = async () => {
    await supabase
      .from("quotations")
      .update({
        quotation_number: customer.quotationNo,
        customer_name: customer.name,
        company_name: customer.company,
        email: customer.email,
        phone: customer.phone,
        quotation_date: customer.date,
        valid_until: customer.valid,
        subtotal,
        gst,
        total,
      })
      .eq("id", quotationId);

    for (const p of products) {
      const item = {
        quotation_id: quotationId,
        product_name: p.name,
        quantity: p.qty,
        unit_price: p.price,
        discount: p.discount,
        amount:
          p.qty * p.price -
          (p.qty * p.price * p.discount) / 100,
      };

      if (p.id) {
        await supabase
          .from("quotation_items")
          .update(item)
          .eq("id", p.id);
      } else {
        await supabase
          .from("quotation_items")
          .insert(item);
      }
    }

    alert("Quotation Updated Successfully!");
    onBack();
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          ← Back
        </button>

        <div style={styles.headerText}>
          <h1 style={styles.title}>Edit Quotation</h1>
          <p style={styles.subtitle}>
            Update Customer & Product Details
          </p>
        </div>
      </div>

      {/* Main Card */}
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
              setCustomer({ ...customer, company: e.target.value })
            }
          />

          <input
            style={styles.input}
            placeholder="Email"
            value={customer.email}
            onChange={(e) =>
              setCustomer({ ...customer, email: e.target.value })
            }
          />

          <input
            style={styles.input}
            placeholder="Phone"
            value={customer.phone}
            onChange={(e) =>
              setCustomer({ ...customer, phone: e.target.value })
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
              setCustomer({ ...customer, date: e.target.value })
            }
          />

          <input
            style={styles.input}
            type="date"
            value={customer.valid}
            onChange={(e) =>
              setCustomer({ ...customer, valid: e.target.value })
            }
          />
        </div>

        <h2 style={styles.heading}>📦 Products</h2>

        {products.map((p, index) => (
          <div key={index} style={styles.productRow}>
            <input
              style={styles.input}
              placeholder="Product Name"
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
                updateProduct(
                  index,
                  "discount",
                  Number(e.target.value)
                )
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

        {/* Summary */}
        <div style={styles.summary}>
          <h2 style={{ marginBottom: 15 }}>💰 Quotation Summary</h2>

          <div style={styles.row}>
            <span>Subtotal</span>
            <b>₹ {subtotal.toFixed(2)}</b>
          </div>

          <div style={styles.row}>
            <span>GST (18%)</span>
            <b>₹ {gst.toFixed(2)}</b>
          </div>

          <hr style={{ margin: "15px 0" }} />

          <div style={styles.row}>
            <h2>Total</h2>
            <h2 style={{ color: "#059669" }}>
              ₹ {total.toFixed(2)}
            </h2>
          </div>

          <button
            style={styles.updateBtn}
            onClick={updateQuotation}
          >
            💾 Update Quotation
          </button>
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
    fontWeight: "bold",
  },

  subtitle: {
    marginTop: 8,
    opacity: 0.9,
  },

  card: {
    background: "#fff",
    borderRadius: 18,
    padding: 25,
    boxShadow: "0 8px 20px rgba(0,0,0,.08)",
  },

  heading: {
    color: "#1e40af",
    marginBottom: 15,
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
    background: "#f8fafc",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  input: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    fontSize: 14,
  },

  addBtn: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: 10,
  },

  deleteBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    width: 42,
    borderRadius: 10,
    cursor: "pointer",
  },

  summary: {
    background: "#f8fafc",
    borderRadius: 16,
    padding: 20,
    marginTop: 30,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "10px 0",
  },

  updateBtn: {
    width: "100%",
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: 15,
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 15,
  },
};