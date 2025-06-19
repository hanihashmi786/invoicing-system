"use client"

import { useState } from "react"

export default function InvoicePage({ invoiceData, language = "en" }) {
  const [currentLang, setCurrentLang] = useState(language)
  const isRTL = currentLang === "ar"

  // Show a message if no data is available (important for debugging!)
  if (!invoiceData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Invoice Data Available</h2>
          <p className="text-gray-500">Please submit an invoice to view its details.</p>
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

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* Language Toggle - Hidden in Print */}
      <div className="fixed top-4 right-4 z-50 print:hidden">
        <div className="flex gap-1 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <button
            onClick={() => setCurrentLang("en")}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              currentLang === "en" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-blue-600"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setCurrentLang("ar")}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              currentLang === "ar" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-blue-600"
            }`}
          >
            AR
          </button>
        </div>
      </div>

      {/* A4 Container */}
      <div
        className={`max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none print:max-w-none ${isRTL ? "rtl" : "ltr"}`}
        dir={isRTL ? "rtl" : "ltr"}
        style={{ minHeight: "297mm" }}
      >
        <div className="p-6 print:p-4">
          {/* Header Section */}
          <header className="mb-6">
            <div className="grid grid-cols-3 gap-4 items-center pb-4 border-b-2 border-blue-600">
              {/* Left Column - English Company Details */}
              <div className="text-left">
                <h1 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{invoiceData.company.name}</h1>
                <p className="text-sm font-semibold text-blue-600 mb-2">Engineering Consulting Co.</p>
                <div className="text-xs text-gray-600 space-y-0.5">
                  <p>Riyadh, Saudi Arabia</p>
                  <p>P.O. Box 12345</p>
                  <p>{invoiceData.company.phone}</p>
                  <p>{invoiceData.company.email}</p>
                </div>
                <div className="text-xs text-gray-500 mt-2 space-y-0.5">
                  <p>CR: 1010691625</p>
                  <p>License: 5100001331</p>
                  <p>CC: 625262</p>
                </div>
              </div>

              {/* Center Column - Company Logo */}
              <div className="flex justify-center">
                <div className="relative w-16 h-16 bg-gray-50 rounded-lg border border-gray-200 p-2">
                  <img
                    src="/placeholder.svg?height=64&width=64"
                    alt="Company Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Right Column - Arabic Company Details */}
              <div className="text-right">
                <h1 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{invoiceData.company.name_ar}</h1>
                <p className="text-sm font-semibold text-blue-600 mb-2">للاستشارات الهندسية</p>
                <div className="text-xs text-gray-600 space-y-0.5">
                  <p>الرياض، المملكة العربية السعودية</p>
                  <p>ص.ب ١٢٣٤٥</p>
                  <p>{invoiceData.company.phone}</p>
                  <p>{invoiceData.company.email}</p>
                </div>
                <div className="text-xs text-gray-500 mt-2 space-y-0.5">
                <p>س.ت: 1010691625</p>
                <p>ترخيص: 5100001331</p>
                <p>غرفة: 625262</p>
                </div>
              </div>
            </div>

            {/* Invoice Title */}
            <div className="text-center mt-3 mb-4">
              <h2 className="text-xl font-bold text-blue-600 bg-blue-50 py-2 px-4 rounded border border-blue-200">
                {isRTL ? "فاتورة ضريبية • TAX INVOICE" : "TAX INVOICE • فاتورة ضريبية"}
              </h2>
            </div>
          </header>

          {/* Client and Invoice Information */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Client Information */}
            <div className="bg-gray-50 border border-gray-200 rounded">
              <div className="bg-green-50 border-b border-green-200 px-3 py-2">
                <h3 className="text-sm font-bold text-gray-800">
                  {isRTL ? "معلومات العميل • Client Information" : "Client Information • معلومات العميل"}
                </h3>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 font-medium">{isRTL ? "اسم العميل:" : "Client Name:"}</span>
                  <span className="text-gray-900 font-medium">
                    {isRTL && invoiceData.client.name_ar ? invoiceData.client.name_ar : invoiceData.client.name}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 font-medium">{isRTL ? "العنوان:" : "Address:"}</span>
                  <span className="text-gray-900 text-right max-w-xs">
                    {isRTL && invoiceData.client.address_ar
                      ? invoiceData.client.address_ar
                      : invoiceData.client.address}
                  </span>
                </div>
                {invoiceData.client.phone && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 font-medium">{isRTL ? "الهاتف:" : "Phone:"}</span>
                    <span className="text-gray-900">{invoiceData.client.phone}</span>
                  </div>
                )}
                {invoiceData.client.email && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 font-medium">{isRTL ? "البريد الإلكتروني:" : "Email:"}</span>
                    <span className="text-gray-900">{invoiceData.client.email}</span>
                  </div>
                )}
                {invoiceData.client.tax_number && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 font-medium">{isRTL ? "الرقم الضريبي:" : "Tax Number:"}</span>
                    <span className="text-gray-900 font-mono">{invoiceData.client.tax_number}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Invoice Information */}
            <div className="bg-gray-50 border border-gray-200 rounded">
              <div className="bg-blue-50 border-b border-blue-200 px-3 py-2">
                <h3 className="text-sm font-bold text-gray-800">
                  {isRTL ? "معلومات الفاتورة • Invoice Information" : "Invoice Information • معلومات الفاتورة"}
                </h3>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 font-medium">{isRTL ? "رقم الفاتورة:" : "Invoice Number:"}</span>
                  <span className="text-blue-600 font-bold">{invoiceData.invoice_number}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 font-medium">{isRTL ? "تاريخ الفاتورة:" : "Invoice Date:"}</span>
                  <span className="text-gray-900">{formatDate(invoiceData.invoice_date)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 font-medium">{isRTL ? "تاريخ التوريد:" : "Supply Date:"}</span>
                  <span className="text-gray-900">{formatDate(invoiceData.supply_date)}</span>
                </div>
                {invoiceData.customer_number && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 font-medium">{isRTL ? "رقم العميل:" : "Customer Number:"}</span>
                    <span className="text-gray-900">{invoiceData.customer_number}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="mb-6">
            <div className="bg-purple-50 border-b border-purple-200 px-3 py-2 rounded-t">
              <h3 className="text-sm font-bold text-gray-800">
                {isRTL ? "بنود الفاتورة • Invoice Items" : "Invoice Items • بنود الفاتورة"}
              </h3>
            </div>
            <div className="border border-gray-200 rounded-b overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 py-2 text-center font-semibold text-gray-700 border-r border-gray-200">
                      {isRTL ? "م" : "No."}
                    </th>
                    <th className="px-2 py-2 text-center font-semibold text-gray-700 border-r border-gray-200">
                      {isRTL ? "تاريخ التوريد" : "Supply Date"}
                    </th>
                    <th className="px-2 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">
                      {isRTL ? "الوصف" : "Description"}
                    </th>
                    <th className="px-2 py-2 text-center font-semibold text-gray-700 border-r border-gray-200">
                      {isRTL ? "الكمية" : "Qty"}
                    </th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-700 border-r border-gray-200">
                      {isRTL ? "سعر الوحدة" : "Unit Price"}
                    </th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-700 border-r border-gray-200">
                      {isRTL ? "المجموع الفرعي" : "Subtotal"}
                    </th>
                    <th className="px-2 py-2 text-center font-semibold text-gray-700 border-r border-gray-200">
                      {isRTL ? "نسبة الضريبة" : "VAT Rate"}
                    </th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-700 border-r border-gray-200">
                      {isRTL ? "مبلغ الضريبة" : "VAT Amount"}
                    </th>
                    <th className="px-2 py-2 text-right font-semibold text-gray-700">
                      {isRTL ? "الإجمالي شامل الضريبة" : "Total Incl. VAT"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr
                      key={index}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-200`}
                    >
                      <td className="px-2 py-2 text-center border-r border-gray-200">{item.serial}</td>
                      <td className="px-2 py-2 text-center border-r border-gray-200">{formatDate(item.supply_date)}</td>
                      <td className="px-2 py-2 border-r border-gray-200">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">
                            {isRTL ? item.description_ar : item.description}
                          </div>
                          <div className="text-gray-500 italic">{isRTL ? item.description : item.description_ar}</div>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center border-r border-gray-200">{item.quantity}</td>
                      <td className="px-2 py-2 text-right font-mono border-r border-gray-200">
                        {formatCurrency(item.unit_price)}
                      </td>
                      <td className="px-2 py-2 text-right font-mono border-r border-gray-200">
                        {formatCurrency(item.subtotal)}
                      </td>
                      <td className="px-2 py-2 text-center border-r border-gray-200">{item.vat_rate}%</td>
                      <td className="px-2 py-2 text-right font-mono border-r border-gray-200">
                        {formatCurrency(item.vat_amount)}
                      </td>
                      <td className="px-2 py-2 text-right font-mono font-bold text-blue-600">
                        {formatCurrency(item.total_incl_vat)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary and Bank Information */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Totals Summary */}
            <div></div>
            <div className="bg-gray-50 border border-gray-200 rounded">
              <div className="bg-indigo-50 border-b border-indigo-200 px-3 py-2">
                <h3 className="text-sm font-bold text-gray-800">
                  {isRTL ? "ملخص المبالغ • Amount Summary" : "Amount Summary • ملخص المبالغ"}
                </h3>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex justify-between text-xs py-1 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">{isRTL ? "المجموع الفرعي:" : "Subtotal:"}</span>
                  <span className="text-gray-900 font-mono">{formatCurrency(invoiceData.subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">
                    {isRTL ? "إجمالي ضريبة القيمة المضافة (15%):" : "Total VAT (15%):"}
                  </span>
                  <span className="text-gray-900 font-mono">{formatCurrency(invoiceData.total_vat)}</span>
                </div>
                <div className="flex justify-between text-sm py-2 bg-blue-50 rounded px-2 border border-blue-200">
                  <span className="text-blue-800 font-bold">{isRTL ? "الإجمالي النهائي:" : "Grand Total:"}</span>
                  <span className="text-blue-800 font-mono font-bold">{formatCurrency(invoiceData.grand_total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Transfer Information */}
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded">
              <div className="bg-yellow-100 border-b border-yellow-200 px-3 py-2">
                <h3 className="text-sm font-bold text-gray-800">
                  {isRTL
                    ? "معلومات التحويل البنكي • Bank Transfer Information"
                    : "Bank Transfer Information • معلومات التحويل البنكي"}
                </h3>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">{isRTL ? "اسم البنك:" : "Bank Name:"}</span>
                    <span className="text-gray-900 font-medium">{invoiceData.bank_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">{isRTL ? "رقم الآيبان:" : "IBAN:"}</span>
                    <span className="text-gray-900 font-mono font-bold bg-yellow-200 px-2 py-1 rounded">
                      {invoiceData.iban}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="grid grid-cols-2 gap-8 mb-4">
            {/* General Manager Signature */}
            <div className="text-center">
              <div className="h-16 border-b border-gray-300 mb-2"></div>
              <div className="text-xs space-y-1">
                <div className="text-blue-600 font-bold">{invoiceData.approver_name}</div>
                <div className="text-gray-600 font-medium">{isRTL ? "المدير العام" : invoiceData.approver_title}</div>
                <div className="text-gray-500">{isRTL ? "التوقيع • Signature" : "Signature • التوقيع"}</div>
              </div>
            </div>

            {/* Company Stamp */}
            <div className="text-center">
              <div className="h-16 flex items-center justify-center mb-2">
                <div className="w-20 h-12 border border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50">
                  <span className="text-gray-400 text-xs">{isRTL ? "ختم الشركة" : "Company Stamp"}</span>
                </div>
              </div>
              <div className="text-xs space-y-1">
                <div className="text-gray-600 font-medium">
                  {isRTL ? "ختم الشركة الرسمي" : "Official Company Stamp"}
                </div>
                <div className="text-gray-500">{isRTL ? "الختم • Stamp" : "Stamp • الختم"}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center border-t border-gray-200 pt-2">
            <p className="text-xs text-gray-500 italic">
              {isRTL
                ? "هذه فاتورة ضريبية صادرة إلكترونياً وفقاً لأنظمة هيئة الزكاة والضريبة والجمارك"
                : "This is an electronically issued tax invoice in accordance with ZATCA regulations"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
