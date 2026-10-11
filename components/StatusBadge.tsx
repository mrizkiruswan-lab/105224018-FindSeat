import type { SeatStatus } from "@/lib/types";

type StatusBadgeProps = {
  status: SeatStatus;
};

const statusStyles: Record<SeatStatus, string> = {
  tersedia: "bg-emerald-100 text-emerald-800",
  digunakan: "bg-red-100 text-red-800",
  ditinggalkan: "bg-amber-100 text-amber-800",
};

const statusLabels: Record<SeatStatus, string> = {
  tersedia: "Tersedia",
  digunakan: "Digunakan",
  ditinggalkan: "Ditinggalkan sementara",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}