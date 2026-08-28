import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import jsPDF from "jspdf";
import QuotationDetails from "./QuotationDetails";
import EditQuotation from "./EditQuotation";

export default function ViewQuotations({ onBack }) {
  const [quotations, setQuotations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase
      .from("quotations")
      .select("*")
      .order("id", { ascending: false });

    setQuotations(data || []);
  };

  if (selectedId) {
    return (
      <QuotationDetails
        quotationId={selectedId}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  if (editId) {
    return (
      <EditQuotation
        quotationId={editId}
        onBack={() => {
          setEditId(null);
          fetchData();
        }}
      />
    );
  }

  const deleteQuotation = async (id) => {
    const ok = window.confirm("Delete this quotation?");
    if (!ok) return;

    await supabase.from("quotation_items").delete().eq("quotation_id", id);
    await supabase.from("quotations").delete().eq("id", id);

    fetchData();
  };

  const downloadPDF = (q) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("SOFTWARE QUOTATION", 20, 20);

    doc.setFontSize(12);
    doc.text(`Quotation : ${q.quotation_number}`, 20, 40);
    doc.text(`Customer : ${q.customer_name}`, 20, 50);
    doc.text(`Company : ${q.company_name}`, 20, 60);
    doc.text(`Email : ${q.email}`, 20, 70);
    doc.text(`Phone : ${q.phone}`, 20, 80);

    doc.line(20, 90, 190, 90);

    doc.text(`Subtotal : ₹ ${q.subtotal}`, 20, 105);
    doc.text(`GST : ₹ ${q.gst}`, 20, 115);

    doc.setFontSize(14);
    doc.text(`Grand Total : ₹ ${q.total}`, 20, 130);

    doc.save(`${q.quotation_number}.pdf`);
  };

  const filtered = quotations.filter(
    (q) =>
      q.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      q.quotation_number?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = filtered.reduce(
    (sum, q) => sum + Number(q.total || 0),
    0
  );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          ← Dashboard
        </button>

        <div style={styles.headerContent}>
          <h1 style={styles.title}>Saved Quotations</h1>
          <p style={styles.subtitle}>
            View & Manage Software Quotations
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h2>{filtered.length}</h2>
          <p>Total Quotations</p>
        </div>

        <div style={styles.statCard}>
          <h2>₹ {totalRevenue.toFixed(0)}</h2>
          <p>Total Revenue</p>
        </div>

        <div style={styles.statCard}>
          <h2>18%</h2>
          <p>GST Applied</p>
        </div>
      </div>

      {/* Search */}
      <div style={styles.searchCard}>
        <input
          style={styles.searchInput}
          placeholder="🔍 Search Customer or Quotation No..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Quotation</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.empty}>
                  📭 No Quotations Found
                </td>
              </tr>
            ) : (
              filtered.map((q) => (
                <tr key={q.id} style={styles.row}>
                  <td style={styles.td}>{q.quotation_number}</td>
                  <td style={styles.td}>{q.customer_name}</td>
                  <td style={styles.td}>{q.company_name}</td>
                  <td style={styles.td}>₹ {q.total}</td>

                  <td style={styles.td}>
                    <button
                      style={styles.viewBtn}
                      onClick={() => setSelectedId(q.id)}
                    >
                      View
                    </button>

                    <button
                      style={styles.editBtn}
                      onClick={() => setEditId(q.id)}
                    >
                      Edit
                    </button>

                    <button
                      style={styles.pdfBtn}
                      onClick={() => downloadPDF(q)}
                    >
                      PDF
                    </button>

                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteQuotation(q.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
    position: "relative",
    marginBottom: 20,
  },

  headerContent: {
    textAlign: "center",
  },

  title: {
    margin: 0,
    fontSize: 32,
    fontWeight: "bold",
  },

  subtitle: {
    marginTop: 6,
    opacity: 0.9,
  },

  backBtn: {
    position: "absolute",
    left: 20,
    top: 20,
    background: "white",
    color: "#2563eb",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 18,
    marginBottom: 20,
  },

  statCard: {
    background: "white",
    borderRadius: 14,
    padding: 20,
    textAlign: "center",
    boxShadow: "0 6px 14px rgba(0,0,0,.08)",
  },

  searchCard: {
    background: "white",
    padding: 18,
    borderRadius: 14,
    marginBottom: 20,
    boxShadow: "0 6px 14px rgba(0,0,0,.08)",
  },

  searchInput: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 15,
    boxSizing: "border-box",
  },

  tableCard: {
    background: "white",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 8px 18px rgba(0,0,0,.08)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    background: "#2563eb",
    color: "white",
    padding: 14,
    fontSize: 15,
  },

  td: {
    padding: 14,
    textAlign: "center",
    borderBottom: "1px solid #e5e7eb",
  },

  row: {
    transition: "0.2s",
  },

  empty: {
    padding: 40,
    textAlign: "center",
    color: "#6b7280",
    fontSize: 18,
  },

  viewBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 6,
    padding: "8px 12px",
    cursor: "pointer",
    marginRight: 6,
  },

  editBtn: {
    background: "#f59e0b",
    color: "white",
    border: "none",
    borderRadius: 6,
    padding: "8px 12px",
    cursor: "pointer",
    marginRight: 6,
  },

  pdfBtn: {
    background: "#059669",
    color: "white",
    border: "none",
    borderRadius: 6,
    padding: "8px 12px",
    cursor: "pointer",
    marginRight: 6,
  },

  deleteBtn: {
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: 6,
    padding: "8px 12px",
    cursor: "pointer",
  },
};