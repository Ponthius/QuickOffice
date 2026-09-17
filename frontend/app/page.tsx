import Link from "next/link";

const docTypes = [
  { type: "quotation", label: "Quotation" },
  { type: "proforma", label: "Proforma Invoice" },
  { type: "invoice", label: "Invoice" },
  { type: "receipt", label: "Receipt" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold text-gray-900">QuickOffice</h1>
      <p className="text-gray-600">What would you like to create?</p>
      <div className="grid grid-cols-2 gap-4 w-80">
        {docTypes.map((d) => (
          <Link
            key={d.type}
            href={`/create/${d.type}`}
            className="bg-white border rounded-lg p-6 text-center font-semibold text-gray-900 shadow hover:bg-blue-50"
          >
            {d.label}
          </Link>
        ))}
      </div>
    </div>
  );
}