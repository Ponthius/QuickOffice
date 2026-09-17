"use client";
import { useState } from "react";
import { useParams } from "next/navigation";

type Item = { qty: string; particulars: string; rate: string; amount: string };

const titles: Record<string, string> = {
  quotation: "Quotation",
  proforma: "Proforma Invoice",
  invoice: "Invoice",
  receipt: "Receipt",
};

export default function CreateDocument() {
  const params = useParams();
  const type = params.type as string;

  const [clientName, setClientName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState<Item[]>([
    { qty: "", particulars: "", rate: "", amount: "" },
  ]);
  const [error, setError] = useState("");

  function updateItem(index: number, field: keyof Item, value: string) {
    const updated = [...items];
    updated[index][field] = value;
    // auto-calc amount = qty * rate
    if (field === "qty" || field === "rate") {
      const qty = parseFloat(updated[index].qty) || 0;
      const rate = parseFloat(updated[index].rate) || 0;
      updated[index].amount = (qty * rate).toString();
    }
    setItems(updated);
  }

  function addItem() {
    setItems([...items, { qty: "", particulars: "", rate: "", amount: "" }]);
  }

  const total = items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/create/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doc_type: type.toUpperCase(),
        client_name: clientName,
        job_description: jobDescription,
        client_address: clientAddress,
        date,
        items: items.map((i) => ({
          qty: parseInt(i.qty) || 0,
          particulars: i.particulars,
          rate: parseFloat(i.rate) || 0,
          amount: parseFloat(i.amount) || 0,
        })),
      }),
    });

    if (!res.ok) {
      setError("Failed to create document. Check you're logged in.");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}.pdf`;
    a.click();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-4">{titles[type] || type}</h1>
        {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="border rounded p-2"
            placeholder="Client / Company Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
          <input
            className="border rounded p-2"
            placeholder="Job Description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <input
            className="border rounded p-2"
            placeholder="Client Address"
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
          />
          <input
            type="date"
            className="border rounded p-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <table className="w-full border-collapse mt-2">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2">QTY</th>
                <th className="border p-2">Particulars</th>
                <th className="border p-2">Rate (UGX)</th>
                <th className="border p-2">Amount (UGX)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td className="border p-1">
                    <input
                      className="w-full p-1"
                      value={item.qty}
                      onChange={(e) => updateItem(idx, "qty", e.target.value)}
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      className="w-full p-1"
                      value={item.particulars}
                      onChange={(e) => updateItem(idx, "particulars", e.target.value)}
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      className="w-full p-1"
                      value={item.rate}
                      onChange={(e) => updateItem(idx, "rate", e.target.value)}
                    />
                  </td>
                  <td className="border p-1 text-right pr-2">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            type="button"
            onClick={addItem}
            className="text-blue-600 text-sm self-start"
          >
            + Add row
          </button>

          <p className="font-semibold text-right">
            Total: UGX {total.toLocaleString()}
          </p>

          <button className="bg-blue-600 text-white rounded p-2 font-semibold mt-2">
            Save & Download PDF
          </button>
        </form>
      </div>
    </div>
  );
}