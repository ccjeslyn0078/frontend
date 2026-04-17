import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const isLast = (index: number) => index === items.length - 1;

  return (
    <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
          {item.to && !isLast(index) ? (
            <Link
              to={item.to}
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={`${
                isLast(index)
                  ? "text-gray-900 font-medium"
                  : "text-gray-600"
              }`}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
