"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/documents/profile/")
      .then(async (r) => {
        if (!r.ok) {
          setError(`Could not load profile (status ${r.status}). Are you logged in?`);
          return;
        }
        setProfile(await r.json());
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);

    const form = new FormData();
    form.append("company_name", profile.company_name || "");
    form.append("tagline", profile.tagline || "");
    form.append("phone_1", profile.phone_1 || "");
    form.append("phone_2", profile.phone_2 || "");
    form.append("address", profile.address || "");
    if (logoFile) form.append("logo", logoFile);
    if (signatureFile) form.append("signature", signatureFile);

    const res = await apiFetch("/documents/profile/", {
      method: "PATCH",
      body: form,
    });

    if (!res.ok) {
      const body = await res.text();
      setError(`Save failed (status ${res.status}): ${body}`);
      return;
    }

    setProfile(await res.json());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <form
        onSubmit={handleSave}
        className="max-w-md mx-auto bg-white p-6 rounded-lg shadow flex flex-col gap-3"
      >
        <h1 className="text-xl font-bold mb-2">Company Settings</h1>
        {saved && <p className="text-green-600 text-sm">Saved!</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <input
          className="border rounded p-2"
          placeholder="Company Name"
          value={profile.company_name || ""}
          onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Tagline"
          value={profile.tagline || ""}
          onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Phone 1"
          value={profile.phone_1 || ""}
          onChange={(e) => setProfile({ ...profile, phone_1: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Phone 2"
          value={profile.phone_2 || ""}
          onChange={(e) => setProfile({ ...profile, phone_2: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Address"
          value={profile.address || ""}
          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
        />

        <label className="text-sm font-semibold mt-2">Logo</label>
        {profile.logo && <img src={profile.logo} className="h-16 mb-1" />}
        <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />

        <label className="text-sm font-semibold mt-2">Signature</label>
        {profile.signature && <img src={profile.signature} className="h-12 mb-1" />}
        <input type="file" accept="image/*" onChange={(e) => setSignatureFile(e.target.files?.[0] || null)} />

        <button className="bg-blue-600 text-white rounded p-2 font-semibold mt-3">Save</button>
        <Link href="/">
          <button type="button" className="w-full bg-gray-200 text-gray-900 rounded p-2 font-semibold mt-1">
            Back
          </button>
        </Link>
      </form>
    </div>
  );
}