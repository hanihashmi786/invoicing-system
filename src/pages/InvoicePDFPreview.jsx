"use client"

import { useRef } from "react"

const translations = {
  en: {
    download_pdf: "Download PDF",
    print: "Print",
    back: "Back",
  },
  ar: {
    download_pdf: "تحميل PDF",
    print: "طباعة",
    back: "رجوع",
  },
}

export default function InvoicePDFPreview({ invoiceData, language = "en", onBack }) {
  const printRef = useRef()
  const t = translations[language]
  const isArabic = language === "ar"

  // Debug: Log the received data
  console.log("InvoicePDFPreview received data:", invoiceData)

  if (!invoiceData) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p>No invoice data available</p>
      </div>
    )
  }

  const handleDownloadPDF = async () => {
    try {
      const html2pdf = (await import("html2pdf.js")).default
      const element = printRef.current
      const opt = {
        margin: 0.3,
        filename: `invoice-${invoiceData.invoice_number}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      }
      html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 2,
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (isArabic) {
      return date.toLocaleDateString("ar-SA")
    }
    return date.toLocaleDateString("en-GB")
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif" }}>
      {/* Action Buttons - Hidden in Print */}
      <div
        className="print:hidden"
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          zIndex: 50,
          display: "flex",
          gap: "8px",
          backgroundColor: "white",
          padding: "8px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e5e7eb",
        }}
      >
        {onBack && (
          <button
            onClick={onBack}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            ← {t.back}
          </button>
        )}
        <button
          onClick={handlePrint}
          style={{
            padding: "8px 16px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          🖨️ {t.print}
        </button>
        <button
          onClick={handleDownloadPDF}
          style={{
            padding: "8px 16px",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          📄 {t.download_pdf}
        </button>
      </div>

      {/* Professional Invoice Design */}
      <div
        ref={printRef}
        className={`max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none print:max-w-none ${isArabic ? "rtl" : "ltr"}`}
        dir={isArabic ? "rtl" : "ltr"}
        style={{
          minHeight: "297mm",
          margin: "0 auto",
          backgroundColor: "white",
          padding: "20px",
        }}
      >
        {/* Header Section */}
        <header style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gap: "16px",
              alignItems: "center",
              paddingBottom: "16px",
              borderBottom: "2px solid #2563eb",
            }}
          >
            {/* Left Column - English Company Details */}
            <div style={{ textAlign: "left" }}>
              <h1
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#111827",
                  margin: "0 0 4px 0",
                  lineHeight: "1.3",
                }}
              >
                {invoiceData.company?.name || "Abdulaziz Turki Abdullah Al-Otaishan"}
              </h1>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#2563eb",
                  margin: "0 0 8px 0",
                }}
              >
                Engineering Consulting Co.
              </p>
              <div style={{ fontSize: "12px", color: "#4b5563", lineHeight: "1.4" }}>
                <p style={{ margin: "0 0 2px 0" }}>Riyadh, Saudi Arabia</p>
                <p style={{ margin: "0 0 2px 0" }}>P.O. Box 12345</p>
                <p style={{ margin: "0 0 2px 0" }}>{invoiceData.company?.phone || "+966 11 123 4567"}</p>
                <p style={{ margin: "0 0 2px 0" }}>{invoiceData.company?.email || "info@alotaishan.com.sa"}</p>
              </div>
              <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "8px", lineHeight: "1.4" }}>
                <p style={{ margin: "0 0 2px 0" }}>CR: {invoiceData.company?.cr_number || "1010123456"}</p>
                <p style={{ margin: "0 0 2px 0" }}>License: {invoiceData.company?.license_number || "51000123456"}</p>
                <p style={{ margin: "0 0 2px 0" }}>Tax: {invoiceData.company?.tax_number || "310123456789001"}</p>
              </div>
            </div>

            {/* Center Column - Company Logo */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  position: "relative",
                  width: "64px",
                  height: "64px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/assets/images/OCE.jpg"
                  alt="Company Logo"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  onError={(e) => {
                    e.target.style.display = "none"
                  }}
                />
              </div>
            </div>

            {/* Right Column - Arabic Company Details */}
            <div style={{ textAlign: "right" }}>
              <h1
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#111827",
                  margin: "0 0 4px 0",
                  lineHeight: "1.3",
                }}
              >
                {invoiceData.company?.name_ar || "شركة عبد العزيز تركي عبد الله العتيشان"}
              </h1>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#2563eb",
                  margin: "0 0 8px 0",
                }}
              >
                للاستشارات الهندسية
              </p>
              <div style={{ fontSize: "12px", color: "#4b5563", lineHeight: "1.4" }}>
                <p style={{ margin: "0 0 2px 0" }}>الرياض، المملكة العربية السعودية</p>
                <p style={{ margin: "0 0 2px 0" }}>ص.ب ١٢٣٤٥</p>
                <p style={{ margin: "0 0 2px 0" }}>{invoiceData.company?.phone || "+966 11 123 4567"}</p>
                <p style={{ margin: "0 0 2px 0" }}>{invoiceData.company?.email || "info@alotaishan.com.sa"}</p>
              </div>
              <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "8px", lineHeight: "1.4" }}>
                <p style={{ margin: "0 0 2px 0" }}>س.ت: {invoiceData.company?.cr_number || "1010123456"}</p>
                <p style={{ margin: "0 0 2px 0" }}>ترخيص: {invoiceData.company?.license_number || "51000123456"}</p>
                <p style={{ margin: "0 0 2px 0" }}>ضريبة: {invoiceData.company?.tax_number || "310123456789001"}</p>
              </div>
            </div>
          </div>

          {/* Invoice Title */}
          <div style={{ textAlign: "center", marginTop: "12px", marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#2563eb",
                backgroundColor: "#eff6ff",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #bfdbfe",
                margin: "0",
                display: "inline-block",
              }}
            >
              {isArabic ? "فاتورة ضريبية • TAX INVOICE" : "TAX INVOICE • فاتورة ضريبية"}
            </h2>
          </div>
        </header>

        {/* Client and Invoice Information */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {/* Client Information */}
          <div
            style={{
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                backgroundColor: "#dcfce7",
                borderBottom: "1px solid #bbf7d0",
                padding: "12px 16px",
              }}
            >
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#1f2937",
                  margin: "0",
                }}
              >
                {isArabic ? "معلومات العميل • Client Information" : "Client Information • معلومات العميل"}
              </h3>
            </div>
            <div style={{ padding: "12px 16px" }}>
              <div style={{ marginBottom: "8px", fontSize: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "#4b5563", fontWeight: "500" }}>
                    {isArabic ? "اسم العميل:" : "Client Name:"}
                  </span>
                  <span style={{ color: "#111827", fontWeight: "500" }}>
                    {invoiceData.client?.name || "Client Name"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "#4b5563", fontWeight: "500" }}>{isArabic ? "العنوان:" : "Address:"}</span>
                  <span style={{ color: "#111827", textAlign: "right", maxWidth: "200px" }}>
                    {invoiceData.client?.address || "Client Address"}
                  </span>
                </div>
                {invoiceData.client?.phone && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ color: "#4b5563", fontWeight: "500" }}>{isArabic ? "الهاتف:" : "Phone:"}</span>
                    <span style={{ color: "#111827" }}>{invoiceData.client.phone}</span>
                  </div>
                )}
                {invoiceData.client?.email && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ color: "#4b5563", fontWeight: "500" }}>
                      {isArabic ? "البريد الإلكتروني:" : "Email:"}
                    </span>
                    <span style={{ color: "#111827" }}>{invoiceData.client.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Information */}
          <div
            style={{
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                backgroundColor: "#dbeafe",
                borderBottom: "1px solid #bfdbfe",
                padding: "12px 16px",
              }}
            >
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#1f2937",
                  margin: "0",
                }}
              >
                {isArabic ? "معلومات الفاتورة • Invoice Information" : "Invoice Information • معلومات الفاتورة"}
              </h3>
            </div>
            <div style={{ padding: "12px 16px" }}>
              <div style={{ marginBottom: "8px", fontSize: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "#4b5563", fontWeight: "500" }}>
                    {isArabic ? "رقم الفاتورة:" : "Invoice Number:"}
                  </span>
                  <span style={{ color: "#2563eb", fontWeight: "bold" }}>{invoiceData.invoice_number}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "#4b5563", fontWeight: "500" }}>
                    {isArabic ? "تاريخ الفاتورة:" : "Invoice Date:"}
                  </span>
                  <span style={{ color: "#111827" }}>{formatDate(invoiceData.invoice_date)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "#4b5563", fontWeight: "500" }}>
                    {isArabic ? "تاريخ التوريد:" : "Supply Date:"}
                  </span>
                  <span style={{ color: "#111827" }}>{formatDate(invoiceData.invoice_date)}</span>
                </div>
                {invoiceData.customer_number && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ color: "#4b5563", fontWeight: "500" }}>
                      {isArabic ? "رقم العميل:" : "Customer Number:"}
                    </span>
                    <span style={{ color: "#111827" }}>{invoiceData.customer_number}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              backgroundColor: "#faf5ff",
              borderBottom: "1px solid #e9d5ff",
              padding: "12px 16px",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "#1f2937",
                margin: "0",
              }}
            >
              {isArabic ? "بنود الفاتورة • Invoice Items" : "Invoice Items • بنود الفاتورة"}
            </h3>
          </div>
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#f3f4f6" }}>
                <tr>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "center",
                      fontWeight: "600",
                      color: "#374151",
                      borderRight: "1px solid #e5e7eb",
                    }}
                  >
                    {isArabic ? "م" : "No."}
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "center",
                      fontWeight: "600",
                      color: "#374151",
                      borderRight: "1px solid #e5e7eb",
                    }}
                  >
                    {isArabic ? "تاريخ التوريد" : "Supply Date"}
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#374151",
                      borderRight: "1px solid #e5e7eb",
                    }}
                  >
                    {isArabic ? "الوصف" : "Description"}
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "center",
                      fontWeight: "600",
                      color: "#374151",
                      borderRight: "1px solid #e5e7eb",
                    }}
                  >
                    {isArabic ? "الكمية" : "Qty"}
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "right",
                      fontWeight: "600",
                      color: "#374151",
                      borderRight: "1px solid #e5e7eb",
                    }}
                  >
                    {isArabic ? "سعر الوحدة" : "Unit Price"}
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "right",
                      fontWeight: "600",
                      color: "#374151",
                      borderRight: "1px solid #e5e7eb",
                    }}
                  >
                    {isArabic ? "المجموع الفرعي" : "Subtotal"}
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "center",
                      fontWeight: "600",
                      color: "#374151",
                      borderRight: "1px solid #e5e7eb",
                    }}
                  >
                    {isArabic ? "نسبة الضريبة" : "VAT Rate"}
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "right",
                      fontWeight: "600",
                      color: "#374151",
                      borderRight: "1px solid #e5e7eb",
                    }}
                  >
                    {isArabic ? "مبلغ الضريبة" : "VAT Amount"}
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "right",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    {isArabic ? "الإجمالي شامل الضريبة" : "Total Incl. VAT"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items &&
                  invoiceData.items.map((item, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: index % 2 === 0 ? "white" : "#f9fafb",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          borderRight: "1px solid #e5e7eb",
                        }}
                      >
                        {index + 1}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          borderRight: "1px solid #e5e7eb",
                        }}
                      >
                        {formatDate(item.supply_date || invoiceData.invoice_date)}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          borderRight: "1px solid #e5e7eb",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: "500", color: "#111827", marginBottom: "2px" }}>
                            {item.description}
                          </div>
                          {item.description_ar && (
                            <div style={{ fontSize: "11px", color: "#6b7280", fontStyle: "italic" }}>
                              {item.description_ar}
                            </div>
                          )}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          borderRight: "1px solid #e5e7eb",
                        }}
                      >
                        {item.quantity}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "right",
                          fontFamily: "monospace",
                          borderRight: "1px solid #e5e7eb",
                        }}
                      >
                        {formatCurrency(item.unit_price)}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "right",
                          fontFamily: "monospace",
                          borderRight: "1px solid #e5e7eb",
                        }}
                      >
                        {formatCurrency(item.total_excl_vat)}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          borderRight: "1px solid #e5e7eb",
                        }}
                      >
                        {item.vat_rate}%
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "right",
                          fontFamily: "monospace",
                          borderRight: "1px solid #e5e7eb",
                        }}
                      >
                        {formatCurrency(item.vat_amount)}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "right",
                          fontFamily: "monospace",
                          fontWeight: "bold",
                          color: "#2563eb",
                        }}
                      >
                        {formatCurrency(item.total_incl_vat)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary and Bank Information */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {/* Empty space */}
          <div></div>

          {/* Totals Summary */}
          <div
            style={{
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                backgroundColor: "#eef2ff",
                borderBottom: "1px solid #c7d2fe",
                padding: "12px 16px",
              }}
            >
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#1f2937",
                  margin: "0",
                }}
              >
                {isArabic ? "ملخص المبالغ • Amount Summary" : "Amount Summary • ملخص المبالغ"}
              </h3>
            </div>
            <div style={{ padding: "12px 16px" }}>
              <div style={{ marginBottom: "8px", fontSize: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 0",
                    borderBottom: "1px solid #e5e7eb",
                    marginBottom: "4px",
                  }}
                >
                  <span style={{ color: "#4b5563", fontWeight: "500" }}>
                    {isArabic ? "المجموع الفرعي:" : "Subtotal:"}
                  </span>
                  <span style={{ color: "#111827", fontFamily: "monospace" }}>
                    {formatCurrency(invoiceData.subtotal)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 0",
                    borderBottom: "1px solid #e5e7eb",
                    marginBottom: "4px",
                  }}
                >
                  <span style={{ color: "#4b5563", fontWeight: "500" }}>
                    {isArabic ? "إجمالي ضريبة القيمة المضافة (15%):" : "Total VAT (15%):"}
                  </span>
                  <span style={{ color: "#111827", fontFamily: "monospace" }}>
                    {formatCurrency(invoiceData.total_vat)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    padding: "8px",
                    backgroundColor: "#eff6ff",
                    borderRadius: "6px",
                    border: "1px solid #bfdbfe",
                  }}
                >
                  <span style={{ color: "#1e40af", fontWeight: "bold" }}>
                    {isArabic ? "الإجمالي النهائي:" : "Grand Total:"}
                  </span>
                  <span style={{ color: "#1e40af", fontFamily: "monospace", fontWeight: "bold" }}>
                    {formatCurrency(invoiceData.grand_total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Transfer Information */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              backgroundColor: "#fefce8",
              border: "1px solid #fde047",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                backgroundColor: "#fef3c7",
                borderBottom: "1px solid #fde047",
                padding: "12px 16px",
              }}
            >
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#1f2937",
                  margin: "0",
                }}
              >
                {isArabic
                  ? "معلومات التحويل البنكي • Bank Transfer Information"
                  : "Bank Transfer Information • معلومات التحويل البنكي"}
              </h3>
            </div>
            <div style={{ padding: "12px 16px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  fontSize: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#4b5563", fontWeight: "500" }}>{isArabic ? "اسم البنك:" : "Bank Name:"}</span>
                  <span style={{ color: "#111827", fontWeight: "500" }}>
                    {invoiceData.company?.bank_name || "Saudi British Bank (SABB)"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#4b5563", fontWeight: "500" }}>{isArabic ? "رقم الآيبان:" : "IBAN:"}</span>
                  <span
                    style={{
                      color: "#111827",
                      fontFamily: "monospace",
                      fontWeight: "bold",
                      backgroundColor: "#fde047",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {invoiceData.company?.iban || "SA0645000000815396684001"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
            marginBottom: "16px",
          }}
        >
          {/* General Manager Signature */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                height: "64px",
                borderBottom: "1px solid #d1d5db",
                marginBottom: "8px",
              }}
            ></div>
            <div style={{ fontSize: "12px" }}>
              <div style={{ color: "#2563eb", fontWeight: "bold", marginBottom: "2px" }}>
                {invoiceData.approver_name || "Dr. Abdul Aziz Turki Al-Otaishan"}
              </div>
              <div style={{ color: "#4b5563", fontWeight: "500", marginBottom: "2px" }}>
                {isArabic ? "المدير العام" : invoiceData.approver_title || "General Manager"}
              </div>
              <div style={{ color: "#6b7280" }}>{isArabic ? "التوقيع • Signature" : "Signature • التوقيع"}</div>
            </div>
          </div>

          {/* Company Stamp */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                height: "64px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "48px",
                  border: "1px dashed #d1d5db",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f9fafb",
                }}
              >
                <span style={{ color: "#9ca3af", fontSize: "12px" }}>{isArabic ? "ختم الشركة" : "Company Stamp"}</span>
              </div>
            </div>
            <div style={{ fontSize: "12px" }}>
              <div style={{ color: "#4b5563", fontWeight: "500", marginBottom: "2px" }}>
                {isArabic ? "ختم الشركة الرسمي" : "Official Company Stamp"}
              </div>
              <div style={{ color: "#6b7280" }}>{isArabic ? "الختم • Stamp" : "Stamp • الختم"}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "8px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: "#6b7280",
              margin: "0",
              fontStyle: "italic",
            }}
          >
            {isArabic
              ? "هذه فاتورة ضريبية صادرة إلكترونياً وفقاً لأنظمة هيئة الزكاة والضريبة والجمارك"
              : "This is an electronically issued tax invoice in accordance with ZATCA regulations"}
          </p>
        </div>
      </div>
    </div>
  )
}
