"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { numberToWords } from "@/lib/numberToWords";

type Item = { qty: string; particulars: string; rate: string; amount: string };

const titles: Record<string, string> = {
  quotation: "QUOTATION",
  proforma: "PROFORMA-INVOICE",
  invoice: "INVOICE",
  receipt: "RECEIPT",
};

export default function CreateDocument() {
  const params = useParams();
  const type = params.type as string;

  const [profile, setProfile] = useState<any>({});
  const [clientName, setClientName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState<Item[]>([{ qty: "", particulars: "", rate: "", amount: "" }]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/profile/`, { credentials: "include" })
      .then((r) => r.json())
      .then(setProfile);
  }, []);

  function updateItem(index: number, field: keyof Item, value: string) {
    const updated = [...items];
    updated[index][field] = value;
    if (field === "qty" || field === "rate") {
      const qty = parseFloat(updated[index].qty) || 0;
      const rate = parseFloat(updated[index].rate) || 0;
      updated[index].amount = qty && rate ? (qty * rate).toString() : "";
    }
    setItems(updated);
  }

  function addItem() {
    setItems([...items, { qty: "", particulars: "", rate: "", amount: "" }]);
  }

  const total = items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
  const amountInWords = total ? `${numberToWords(total)} Shillings Only` : "";

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
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-8 shadow border">
        {/* Header: logo + company info */}
        <div className="flex justify-between items-start border-b pb-4 mb-4">
          <div>
            {profile.logo && <img src={profile.logo} className="h-16 mb-2" />}
            <p className="text-xl font-bold uppercase">{profile.company_name}</p>
            <p className="text-sm">{profile.tagline}</p>
          </div>
          <div className="text-right text-sm">
            <p>Tel: <strong>{profile.phone_1}</strong></p>
            <p><strong>{profile.phone_2}</strong></p>
            <p className="mt-1">{profile.address}</p>
          </div>
        </div>

        {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}

        {/* Two boxes: client info | doc title/number/date */}
        <div className="flex gap-4 mb-4">
          <div className="border p-3 w-1/2 flex flex-col gap-2">
            <input className="border-b outline-none" placeholder="M/s: Client / Company Name"
              value={clientName} onChange={(e) => setClientName(e.target.value)} />
            <input className="border-b outline-none" placeholder="Description of job"
              value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
            <input className="border-b outline-none" placeholder="Address"
              value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
          </div>
          <div className="border w-1/2">
            <p className="text-center font-bold text-lg border-b p-2">{titles[type] || type}</p>
            <div className="flex border-b">
              <p className="w-1/3 p-2 font-semibold border-r">No.</p>
              <p className="p-2 text-gray-500 italic">auto-generated</p>
            </div>
            <div className="flex">
              <p className="w-1/3 p-2 font-semibold border-r">Date</p>
              <input type="date" className="p-2 outline-none" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Items table */}
        <table className="w-full border-collapse mb-2">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2 w-16">QTY</th>
              <th className="border p-2">PARTICULARS</th>
              <th className="border p-2 w-32">RATE (UGX)</th>
              <th className="border p-2 w-32">AMOUNT (UGX)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td className="border p-1"><input className="w-full p-1 text-center" value={item.qty}
                  onChange={(e) => updateItem(idx, "qty", e.target.value)} /></td>
                <td className="border p-1"><input className="w-full p-1" value={item.particulars}
                  onChange={(e) => updateItem(idx, "particulars", e.target.value)} /></td>
                <td className="border p-1"><input className="w-full p-1 text-right" value={item.rate}
                  onChange={(e) => updateItem(idx, "rate", e.target.value)} /></td>
                <td className="border p-1 text-right pr-2">{item.amount && Number(item.amount).toLocaleString()}</td>
              </tr>
            ))}
            <tr>
              <td className="border p-2 font-semibold" colSpan={3}>E.&O.E — TOTAL</td>
              <td className="border p-2 text-right font-semibold">{total.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <button type="button" onClick={addItem} className="text-blue-600 text-sm mb-4">+ Add row</button>

        <p className="text-center font-semibold mb-4">Accounts are due on demand</p>

        <p className="mb-6"><strong>Amount in words:</strong> <span className="italic">{amountInWords}</span></p>

        {/* Footer: signature */}
        <div className="flex justify-end text-right">
          <div>
            {profile.signature && <img src={profile.signature} className="h-12 mb-1" />}
            <p>For & on behalf of <strong>{profile.company_name}</strong></p>
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white rounded p-2 font-semibold mt-6">
          Save & Download PDF
        </button>
      </form>
    </div>
  );
}