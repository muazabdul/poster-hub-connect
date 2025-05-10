
import { Card } from "@/components/ui/card";
import DataTable from "@/components/admin/DataTable";

interface RecentDataProps {
  onViewUsers: () => void;
  onViewPosters: () => void;
}

const RecentData = ({ onViewUsers, onViewPosters }: RecentDataProps) => {
  const usersData = [
    { name: "John Smith", email: "john.smith@example.com", status: "Active" },
    { name: "Emma Wilson", email: "emma@example.com", status: "Active" },
    { name: "Dave Robertson", email: "dave@example.com", status: "Pending" }
  ];

  const postersData = [
    { poster: "PM Kisan Scheme", category: "Government Schemes", downloads: "1,245" },
    { poster: "Digital Banking Services", category: "Banking", downloads: "892" },
    { poster: "Aadhaar Card Services", category: "Digital Services", downloads: "567" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="flex flex-col">
        <DataTable
          title="Recent Users"
          description="Latest user registrations"
          columns={["Name", "Email", "Status"]}
          data={usersData}
          statusKey="status"
          onViewAll={onViewUsers}
        />
      </Card>
      
      <Card className="flex flex-col">
        <DataTable
          title="Popular Posters"
          description="Most downloaded posters"
          columns={["Poster", "Category", "Downloads"]}
          data={postersData}
          onViewAll={onViewPosters}
        />
      </Card>
    </div>
  );
};

export default RecentData;
