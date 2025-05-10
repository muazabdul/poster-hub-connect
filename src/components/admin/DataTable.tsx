
import { Button } from "@/components/ui/button";

interface DataTableProps {
  title: string;
  description: string;
  columns: string[];
  data: any[];
  statusKey?: string;
  onViewAll: () => void;
}

const DataTable = ({ 
  title, 
  description, 
  columns, 
  data, 
  statusKey, 
  onViewAll 
}: DataTableProps) => {
  const renderStatus = (status: string) => {
    if (status === "Active") {
      return (
        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
          {status}
        </span>
      );
    } else if (status === "Pending") {
      return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
          {status}
        </span>
      );
    }
    return status;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="border-t flex-grow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex < data.length - 1 ? "border-b" : ""}>
                {Object.keys(row).map((key, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3 text-sm">
                    {key === statusKey ? renderStatus(row[key]) : row[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between border-t p-4 mt-auto">
        <Button variant="outline" size="sm" onClick={onViewAll}>View All</Button>
      </div>
    </div>
  );
};

export default DataTable;
