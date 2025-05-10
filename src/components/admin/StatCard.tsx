
import { ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
}

const StatCard = ({ title, value, icon, change }: StatCardProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value.toLocaleString()}</h3>
            {change && (
              <p className={`text-xs flex items-center mt-1 ${change.isPositive ? 'text-green-600' : 'text-muted-foreground'}`}>
                {change.isPositive && <ArrowUp className="h-3 w-3 mr-1" />}
                <span>{change.label}</span>
              </p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
