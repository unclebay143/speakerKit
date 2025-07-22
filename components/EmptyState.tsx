import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
  showUpgrade?: boolean;
  onUpgrade?: () => void;
  upgradeMessage?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
    showUpgrade = false,
  onUpgrade,
  upgradeMessage = "Upgrade to Pro for more",
}: EmptyStateProps) {
  return (
    <Card
      className={`bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 border-dashed ${className}`}
    >
      <CardContent className="p-8 text-center">
        <div className="flex flex-col items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Icon className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <p className="text-gray-900 dark:text-white font-medium">{title}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {description}
            </p>
            {showUpgrade && (
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                {upgradeMessage}
              </p>
            )}
          </div>
        </div>
        {showUpgrade ? (
          <Button
            onClick={onUpgrade}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Upgrade to Pro
          </Button>
        ) : action ? (
          <>
            {action.href ? (
              <Link href={action.href}>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  {action.label}
                </Button>
              </Link>
            ) : (
              <Button
                onClick={action.onClick}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {action.label}
              </Button>
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}