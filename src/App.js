import React, { useState } from "react";
import InvoiceForm from "./pages/InvoiceForm";
import InvoicePage from "./pages/InvoicePage"; // or InvoicePDFPreview

function App() {
  // State to hold submitted invoice data
  const [invoiceData, setInvoiceData] = useState(null);

  // Function to handle going back from preview to form
  const handleBack = () => setInvoiceData(null);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {!invoiceData ? (
        // Show form if no invoice data yet
        <InvoiceForm onSubmit={setInvoiceData} />
      ) : (
        // Show preview page if data is submitted
        <InvoicePage
          invoiceData={invoiceData}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

export default App;
