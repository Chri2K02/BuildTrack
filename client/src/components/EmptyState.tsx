import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 mb-3">
        {icon}
      </div>
      <h3 className="text-gray-800 font-semibold text-sm mb-1">{title}</h3>
      <p className="text-gray-400 text-sm max-w-xs leading-relaxed">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
