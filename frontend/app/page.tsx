"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const docTypes = [
  { type: "quotation", label: "Quotation" },
  { type: "proforma", label: "Proforma Invoice" },
  { type: "invoice", label: "Invoice" },
  { type: "receipt", label: "Receipt" },
];

export default function Home() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    apiFetch("/documents/profile/")
      .then((response) => {
        if (response.ok) setReady(true);
      })
      .catch(() => {
        // apiFetch redirects unauthenticated users to /login.
      });
  }, []);

  if (!ready) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-600">Checking login...</div>;
  }

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
      <Link href="/settings" className="text-blue-600 text-sm">Company Settings</Link>
    </div>
  );
}
