
import KolomCatatan from "@/components/KolomCatatan";

export default function LayoutTempat({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <aside
        aria-label="Panel pengujian layout"
        className="mb-6 max-w-md space-y-3 rounded-xl border border-[#dce8e2] bg-[#f7faf8] p-4"
      >
        <h2 className="font-semibold text-[#163b32]">
          Panel Pengujian Modul 4
        </h2>

        <p className="text-sm text-[#61736d]">
          Panel ini digunakan untuk menguji apakah state tetap
          bertahan ketika berpindah dari daftar tempat ke detail
          tempat.
        </p>

        <KolomCatatan label="Catatan di layout" />
      </aside>

      {children}
    </div>
  );
}
