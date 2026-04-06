import { Badge } from "@/components/ui/badge";

type TriageLevel = "emergency" | "seek_doctor" | "monitor" | "self_care" | string;

export function TriageBadge({ level, className = "" }: { level: TriageLevel; className?: string }) {
  let label = "Unknown";
  let variantClass = "bg-gray-100 text-gray-800 border-gray-200";

  switch (level.toLowerCase()) {
    case "emergency":
      label = "Go to Emergency";
      variantClass = "bg-red-100 text-red-800 border-red-200";
      break;
    case "seek_doctor":
      label = "See a Doctor Soon";
      variantClass = "bg-amber-100 text-amber-800 border-amber-200";
      break;
    case "monitor":
      label = "Monitor Symptoms";
      variantClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
      break;
    case "self_care":
      label = "Self-Care Recommended";
      variantClass = "bg-emerald-100 text-emerald-800 border-emerald-200";
      break;
  }

  return (
    <Badge variant="outline" className={`font-medium px-2.5 py-0.5 rounded-full ${variantClass} ${className}`}>
      {label}
    </Badge>
  );
}
