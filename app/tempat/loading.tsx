
export default function LoadingTempat() {
  return (
    <section
      className="mx-auto min-h-[70vh] max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      role="status"
      aria-live="polite"
    >
      <div className="animate-pulse">
        <div className="h-4 w-40 rounded bg-[#dce8e2]" />

        <div className="mt-4 h-10 w-72 max-w-full rounded bg-[#dce8e2]" />

        <div className="mt-4 h-5 max-w-2xl rounded bg-[#dce8e2]" />

        <p className="mt-6 text-sm text-[#61736d]">
          Memuat informasi tempat...
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-48 rounded-2xl border border-[#dce8e2] bg-white p-5"
            >
              <div className="h-5 w-2/3 rounded bg-[#dce8e2]" />
              <div className="mt-4 h-4 w-full rounded bg-[#eaf1ed]" />
              <div className="mt-2 h-4 w-4/5 rounded bg-[#eaf1ed]" />
              <div className="mt-6 h-9 w-28 rounded-xl bg-[#dce8e2]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
