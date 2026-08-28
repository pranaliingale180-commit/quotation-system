import { useState } from "react";
import { supabase } from "../supabase";
import CreateQuotation from "./CreateQuotation";
import ViewQuotations from "./ViewQuotations";

export default function Dashboard({ onLogout }) {
  const [page, setPage] = useState("home");

  if (page === "create") {
    return <CreateQuotation onBack={() => setPage("home")} />;
  }

  if (page === "view") {
    return <ViewQuotations onBack={() => setPage("home")} />;
  }

  const logout = async () => {
    const ok = window.confirm("Are you sure you want to logout?");
    if (!ok) return;

    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.logoutBtn} onClick={logout}>
          Logout
        </button>

        <div style={styles.headerContent}>
          <h1 style={styles.title}>Software Quotation</h1>
          <p style={styles.subtitle}>Management System</p>
        </div>
      </div>

      {/* Welcome */}
      <div style={styles.welcomeCard}>
        <h2>Welcome Admin 👋</h2>
        <p>
          Create, manage and download professional software quotations with GST
          calculation.
        </p>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.icon}>📄</div>
          <h3>Create</h3>
          <p>New Quotations</p>
        </div>

        <div style={styles.statCard}>
          <div style={styles.icon}>📋</div>
          <h3>View</h3>
          <p>Saved Quotations</p>
        </div>

        <div style={styles.statCard}>
          <div style={styles.icon}>🧾</div>
          <h3>GST</h3>
          <p>18% Auto Calculate</p>
        </div>
      </div>

      {/* Action Cards */}
      <div style={styles.actionGrid}>
        <div style={styles.actionCard}>
          <div style={styles.bigIcon}>➕</div>

          <h2 style={styles.cardTitle}>Create Quotation</h2>

          <p style={styles.cardText}>
            Generate a new quotation with automatic GST calculation and PDF.
          </p>

          <button
            style={styles.createBtn}
            onClick={() => setPage("create")}
          >
            Create Now
          </button>
        </div>

        <div style={styles.actionCard}>
          <div style={styles.bigIcon}>📑</div>

          <h2 style={styles.cardTitle}>View Quotations</h2>

          <p style={styles.cardText}>
            View, edit, delete and download saved quotations.
          </p>

          <button
            style={styles.viewBtn}
            onClick={() => setPage("view")}
          >
            Open List
          </button>
        </div>
      </div>

      {/* Features */}
      <div style={styles.featureCard}>
        <h2>✨ Dashboard Features</h2>

        <div style={styles.featureGrid}>
          <div>✅ Create Quotations</div>
          <div>✅ View Saved Records</div>
          <div>✅ Edit Quotations</div>
          <div>✅ Delete Quotations</div>
          <div>✅ Download PDF</div>
          <div>✅ Supabase Database</div>
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
    padding: 28,
    position: "relative",
    boxShadow: "0 10px 25px rgba(0,0,0,.15)",
  },

  headerContent: {
    textAlign: "center",
  },

  title: {
    margin: 0,
    fontSize: 36,
    fontWeight: "bold",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 18,
    opacity: 0.95,
  },

  logoutBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: 10,
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  welcomeCard: {
    marginTop: 20,
    background: "white",
    borderRadius: 16,
    padding: 20,
    textAlign: "center",
    boxShadow: "0 6px 16px rgba(0,0,0,.08)",
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 16,
    marginTop: 20,
  },

  statCard: {
    background: "white",
    borderRadius: 16,
    padding: 18,
    textAlign: "center",
    boxShadow: "0 6px 16px rgba(0,0,0,.08)",
  },

  icon: {
    fontSize: 34,
    marginBottom: 6,
  },

  actionGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 18,
    marginTop: 20,
  },

  actionCard: {
    background: "white",
    borderRadius: 18,
    padding: 20,
    boxShadow: "0 8px 18px rgba(0,0,0,.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    minHeight: 220,
  },

  bigIcon: {
    fontSize: 40,
    marginBottom: 4,
  },

  cardTitle: {
    margin: "6px 0",
    fontSize: 24,
  },

  cardText: {
    color: "#6b7280",
    lineHeight: 1.4,
    marginTop: 4,
    marginBottom: 8,
    fontSize: 15,
    flex: 1,
  },

  createBtn: {
    width: "100%",
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: 12,
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 15,
  },

  viewBtn: {
    width: "100%",
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: 12,
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 15,
  },

  featureCard: {
    marginTop: 20,
    background: "white",
    borderRadius: 16,
    padding: 22,
    boxShadow: "0 8px 18px rgba(0,0,0,.08)",
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 15,
    fontSize: 15,
  },
};