"use client"

import { useState } from "react"
import html2pdf from "html2pdf.js"
import "../styles/InvoicePage.css"

export default function InvoicePage({ invoiceData, language = "en" }) {
  const [currentLang, setCurrentLang] = useState(language)
  const isRTL = currentLang === "ar"

  // Show a message if no data is available (important for debugging!)
  if (!invoiceData) {
    return (
      <div className="no-data-container">
        <div className="no-data-card">
          <h2 className="no-data-title">No Invoice Data Available</h2>
          <p className="no-data-message">Please submit an invoice to view its details.</p>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    if (isRTL) {
      return date.toLocaleDateString("ar-SA")
    }
    return date.toLocaleDateString("en-GB")
  }

  const downloadPDF = () => {
    const element = document.querySelector(".invoice-page")
    const opt = {
      margin: [0.3, 0.3, 0.3, 0.3],
      filename: `invoice-${invoiceData.invoice_number}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 1.5,
        useCORS: true,
        height: element.scrollHeight,
        windowHeight: element.scrollHeight,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
        compress: true,
      },
      pagebreak: { mode: "avoid-all" },
    }

    // Hide the PDF button during generation
    const pdfButton = document.querySelector(".pdf-download-btn")
    if (pdfButton) pdfButton.style.display = "none"

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        // Show the PDF button again after generation
        if (pdfButton) pdfButton.style.display = "block"
      })
  }

  return (
    <div className="invoice-container">
      {/* Language Toggle - Hidden in Print */}
      <div className="language-toggle">
        <div className="language-toggle-buttons">
          <button
            onClick={() => setCurrentLang("en")}
            className={`language-btn ${currentLang === "en" ? "language-btn-active" : ""}`}
          >
            EN
          </button>
          <button
            onClick={() => setCurrentLang("ar")}
            className={`language-btn ${currentLang === "ar" ? "language-btn-active" : ""}`}
          >
            AR
          </button>
        </div>
      </div>

      {/* PDF Download Button */}
      <div className="pdf-download-container">
        <button onClick={downloadPDF} className="pdf-download-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download PDF
        </button>
      </div>

      {/* A4 Container */}
      <div className={`invoice-page ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
        <div className="invoice-content">
          {/* Header Section */}
          <header className="invoice-header">
            <div className="header-grid">
              {/* Left Column - English Company Details */}
              <div className="company-details-left">
                <h1 className="company-name">{invoiceData.company.name}</h1>
                <p className="company-subtitle">Engineering Consulting Co.</p>
                <div className="company-info">
                  <p>Riyadh, Saudi Arabia</p>
                  <p>P.O. Box 12345</p>
                  <p>{invoiceData.company.phone}</p>
                  <p>{invoiceData.company.email}</p>
                </div>
                <div className="company-registration">
                  <p>CR: {invoiceData.company.cr_number || "1010691625"}</p>
                  <p>License: {invoiceData.company.license_number || "5100001331"}</p>
                  <p>CC: 625262</p>
                </div>
              </div>

              {/* Center Column - Company Logo */}
              <div className="logo-container">
                <div className="logo-wrapper">
                  <img src="../../assets/images/OCE.jpg" alt="Company Logo" className="company-logo" />
                </div>
              </div>

              {/* Right Column - Arabic Company Details */}
              <div className="company-details-right">
                <h1 className="company-name">{invoiceData.company.name_ar || "عبدالعزيز تركي عبدالله العطيشان"}</h1>
                <p className="company-subtitle">للاستشارات الهندسية</p>
                <div className="company-info">
                  <p>الرياض، المملكة العربية السعودية</p>
                  <p>ص.ب 62696</p>
                  <p>{invoiceData.company.phone}</p>
                  <p>{invoiceData.company.email}</p>
                </div>
                <div className="company-registration">
                  <p>س.ت: {invoiceData.company.cr_number || "1010691625"}</p>
                  <p>ترخيص: {invoiceData.company.license_number || "5100001331"}</p>
                  <p>غرفة: 625262</p>
                </div>
              </div>
            </div>

            {/* Invoice Title */}
            <div className="invoice-title-container">
              <h2 className="invoice-title">{isRTL ? "فاتورة ضريبية • TAX INVOICE" : "TAX INVOICE • فاتورة ضريبية"}</h2>
            </div>
          </header>

          {/* Client and Invoice Information */}
          <div className="info-grid">
            {/* Client Information */}
            <div className="info-card">
              <div className="info-card-header client-header">
                <h3 className="info-card-title">
                  {isRTL ? "معلومات العميل • Client Information" : "Client Information • معلومات العميل"}
                </h3>
              </div>
              <div className="info-card-content">
                <div className="info-row">
                  <span className="info-label">{isRTL ? "اسم العميل:" : "Client Name:"}</span>
                  <span className="info-value">{invoiceData.client.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">{isRTL ? "العنوان:" : "Address:"}</span>
                  <span className="info-value address-value">{invoiceData.client.address}</span>
                </div>
                {invoiceData.client.phone && (
                  <div className="info-row">
                    <span className="info-label">{isRTL ? "الهاتف:" : "Phone:"}</span>
                    <span className="info-value">{invoiceData.client.phone}</span>
                  </div>
                )}
                {invoiceData.client.email && (
                  <div className="info-row">
                    <span className="info-label">{isRTL ? "البريد الإلكتروني:" : "Email:"}</span>
                    <span className="info-value">{invoiceData.client.email}</span>
                  </div>
                )}
                {invoiceData.client.fax && (
                  <div className="info-row">
                    <span className="info-label">{isRTL ? "الفاكس:" : "Fax:"}</span>
                    <span className="info-value">{invoiceData.client.fax}</span>
                  </div>
                )}
                {invoiceData.client.vat_registration && (
                  <div className="info-row">
                    <span className="info-label">
                      {isRTL ? "تسجيل ضريبة القيمة المضافة:" : "VAT"}
                    </span>
                    <span className="info-value">{invoiceData.client.vat_registration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Invoice Information */}
            <div className="info-card">
              <div className="info-card-header invoice-header-info">
                <h3 className="info-card-title">
                  {isRTL ? "معلومات الفاتورة • Invoice Information" : "Invoice Information • معلومات الفاتورة"}
                </h3>
              </div>
              <div className="info-card-content">
                <div className="info-row">
                  <span className="info-label">{isRTL ? "رقم الفاتورة:" : "Invoice Number:"}</span>
                  <span className="info-value invoice-number">{invoiceData.invoice_number}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">{isRTL ? "تاريخ الفاتورة:" : "Invoice Date:"}</span>
                  <span className="info-value">{formatDate(invoiceData.invoice_date)}</span>
                </div>

                {invoiceData.customer_number && (
                  <div className="info-row">
                    <span className="info-label">{isRTL ? "رقم العميل:" : "Customer Number:"}</span>
                    <span className="info-value">{invoiceData.customer_number}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="items-section">
            <div className="items-header">
              <h3 className="items-title">
                {isRTL ? "بنود الفاتورة • Invoice Items" : "Invoice Items • بنود الفاتورة"}
              </h3>
            </div>
            <div className="table-container">
              <table className="items-table">
                <thead className="table-header">
                  <tr>
                    <th className="table-cell table-header-cell text-center">{isRTL ? "م" : "No."}</th>
                    <th className="table-cell table-header-cell text-left">{isRTL ? "الوصف" : "Description"}</th>
                    <th className="table-cell table-header-cell text-center">{isRTL ? "الكمية" : "Qty"}</th>
                    <th className="table-cell table-header-cell text-right">{isRTL ? "سعر الوحدة" : "Unit Price"}</th>
                    <th className="table-cell table-header-cell text-right">{isRTL ? "المجموع الفرعي" : "Subtotal"}</th>
                    <th className="table-cell table-header-cell text-center">{isRTL ? "نسبة الضريبة" : "VAT Rate"}</th>
                    <th className="table-cell table-header-cell text-right">{isRTL ? "مبلغ الضريبة" : "VAT Amount"}</th>
                    <th className="table-cell table-header-cell text-right no-border-right">
                      {isRTL ? "الإجمالي شامل الضريبة" : "Total Incl. VAT"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={index} className={`table-row ${index % 2 === 0 ? "table-row-even" : "table-row-odd"}`}>
                      <td className="table-cell text-center">{index + 1}</td>
                      <td className="table-cell">
                        <div className="description-container">
                          <div className="description-primary">{item.description}</div>
                        </div>
                      </td>
                      <td className="table-cell text-center">{item.quantity}</td>
                      <td className="table-cell text-right mono-font">{formatCurrency(item.unit_price)}</td>
                      <td className="table-cell text-right mono-font">{formatCurrency(item.total_excl_vat)}</td>
                      <td className="table-cell text-center">{item.vat_rate}%</td>
                      <td className="table-cell text-right mono-font">{formatCurrency(item.vat_amount)}</td>
                      <td className="table-cell text-right mono-font total-cell no-border-right">
                        {formatCurrency(item.total_incl_vat)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary and Bank Information */}
          <div className="summary-grid">
            {/* Empty space */}
            <div></div>
            {/* Totals Summary */}
            <div className="info-card">
              <div className="info-card-header summary-header">
                <h3 className="info-card-title">
                  {isRTL ? "ملخص المبالغ • Amount Summary" : "Amount Summary • ملخص المبالغ"}
                </h3>
              </div>
              <div className="info-card-content">
                <div className="summary-row">
                  <span className="info-label">{isRTL ? "المجموع الفرعي:" : "Subtotal:"}</span>
                  <span className="info-value mono-font">{formatCurrency(invoiceData.subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span className="info-label">
                    {isRTL ? "إجمالي ضريبة القيمة المضافة (15%):" : "Total VAT (15%):"}
                  </span>
                  <span className="info-value mono-font">{formatCurrency(invoiceData.total_vat)}</span>
                </div>
                <div className="grand-total-row">
                  <span className="grand-total-label">{isRTL ? "الإجمالي النهائي:" : "Grand Total:"}</span>
                  <span className="grand-total-value">{formatCurrency(invoiceData.grand_total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Transfer Information */}
          <div className="bank-section">
            <div className="info-card bank-card">
              <div className="info-card-header bank-header">
                <h3 className="info-card-title">
                  {isRTL
                    ? "معلومات التحويل البنكي • Bank Transfer Information"
                    : "Bank Transfer Information • معلومات التحويل البنكي"}
                </h3>
              </div>
              <div className="info-card-content">
                <div className="bank-info-grid">
                  <div className="info-row">
                    <span className="info-label">{isRTL ? "اسم البنك:" : "Bank Name:"}</span>
                    <span className="info-value bank-name">
                      {invoiceData.company.bank_name || "Saudi National Bank"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">{isRTL ? "رقم الآيبان:" : "IBAN:"}</span>
                    <span className="iban-value">{invoiceData.company.iban || "SA1234567890123456789012"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="signature-grid">
            {/* General Manager Signature */}
            <div className="signature-section">
              <div className="signature-line"></div>
              <div className="signature-info">
                <div className="signature-name">{invoiceData.approver_name}</div>
                <div className="signature-title">{isRTL ? "المدير العام" : invoiceData.approver_title}</div>
                <div className="signature-label">{isRTL ? "التوقيع • Signature" : "Signature • التوقيع"}</div>
              </div>
            </div>

            {/* Company Stamp */}
            <div className="signature-section">
              <div className="stamp-container">
                <div className="stamp-placeholder">
                  <span className="stamp-text">{isRTL ? "ختم الشركة" : "Company Stamp"}</span>
                </div>
              </div>
              <div className="signature-info">
                <div className="signature-title">{isRTL ? "ختم الشركة الرسمي" : "Official Company Stamp"}</div>
                <div className="signature-label">{isRTL ? "الختم • Stamp" : "Stamp • الختم"}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="invoice-footer">
            <p className="footer-text">
              {isRTL
                ? "هذه فاتورة ضريبية صادرة إلكترونيًا وفقًا للوائح شركة العطيشان للاستشارات الهندسية"
                : "This is an electronically issued tax invoice in accordance with Al Otaishan Consulting Engeering regulations"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}



//هذه فاتورة ضريبية صادرة إلكترونيًا وفقًا للوائح شركة العطيشان للاستشارات الهندسية

