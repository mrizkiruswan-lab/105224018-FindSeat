
import KolomCatatan from "@/components/KolomCatatan";

export default function TemplateTempat({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <KolomCatatan label="Catatan di template" />
      </div>

      {children}
    </div>
  );
}
