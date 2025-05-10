
import { Card, CardContent } from "@/components/ui/card";
import UsersTable from "@/components/admin/UsersTable";

const AdminUsers = () => {
  return (
    <Card>
      <CardContent className="p-0">
        <UsersTable />
      </CardContent>
    </Card>
  );
};

export default AdminUsers;
