import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 40 }}>{children}</main>
      </div>
    </div>
  );
}

