import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Jobs from "./pages/Jobs";
import Invoices from "./pages/Invoices";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page — always accessible */}
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
              <SignedOut>
                <Landing />
              </SignedOut>
            </>
          }
        />

        {/* Protected app routes */}
        <Route
          path="/*"
          element={
            <SignedIn>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            </SignedIn>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
