"use client";

import { useId, useState } from "react";

export default function KolomCatatan({
  label,
}: {
  label: string;
}) {
  const id = useId();
  const [catatan, setCatatan] = useState("");

  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-3 text-sm">
      <label
        htmlFor={id}
        className="font-medium text-slate-800"
      >
        {label}
      </label>

      <input
        id={id}
        type="text"
        value={catatan}
        onChange={(event) => setCatatan(event.target.value)}
        placeholder="Ketik catatan pengujian..."
        className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
