
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Image, Plus, FolderIcon, User, CreditCard, LayoutDashboard, ArrowUp, ArrowDown, Settings } from "lucide-react";
import PosterForm from "@/components/admin/PosterForm";
import PlansTable from "@/components/admin/PlansTable";
import UsersTable from "@/components/admin/UsersTable";
import DashboardMetrics from "@/components/admin/DashboardMetrics";
import PlanForm from "@/components/admin/PlanForm";
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const Admin = () => {
  const [addPosterOpen, setAddPosterOpen] = useState(false);
  const [addPlanOpen, setAddPlanOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Layout className="p-0" fullWidth>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <Sidebar className="border-r border-border/40">
            <SidebarHeader>
              <div className="px-2 py-4">
                <h2 className="text-lg font-bold flex items-center">
                  <LayoutDashboard className="mr-2 h-5 w-5 text-brand-purple" />
                  Admin Panel
                </h2>
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Overview</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "dashboard"} 
                        onClick={() => setActiveTab("dashboard")}
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel>Management</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        isActive={activeTab === "posters"} 
                        onClick={() => setActiveTab("posters")}
                      >
                        <Image className="mr-2 h-4 w-4" />
                        <span>Posters</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        isActive={activeTab === "plans"} 
                        onClick={() => setActiveTab("plans")}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Plans</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        isActive={activeTab === "categories"} 
                        onClick={() => setActiveTab("categories")}
                      >
                        <FolderIcon className="mr-2 h-4 w-4" />
                        <span>Categories</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        isActive={activeTab === "users"} 
                        onClick={() => setActiveTab("users")}
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Users</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel>Settings</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>General</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter>
              <div className="px-4 py-4 text-xs text-muted-foreground">
                Admin Panel v1.0
              </div>
            </SidebarFooter>
          </Sidebar>
          
          <div className="flex-1 p-6 overflow-auto">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                <p className="text-muted-foreground">Manage your {activeTab} efficiently</p>
              </div>
              
              <div className="flex gap-2">
                {activeTab === "posters" && (
                  <Dialog open={addPosterOpen} onOpenChange={setAddPosterOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-brand-purple hover:bg-brand-darkPurple">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Poster
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px]">
                      <DialogHeader>
                        <DialogTitle>Add New Poster</DialogTitle>
                        <DialogDescription>
                          Upload a new poster to make available for CSC owners.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="my-4">
                        <PosterForm onSuccess={() => setAddPosterOpen(false)} />
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                
                {activeTab === "plans" && (
                  <Dialog open={addPlanOpen} onOpenChange={setAddPlanOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-brand-purple hover:bg-brand-darkPurple">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Plan
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Add New Plan</DialogTitle>
                        <DialogDescription>
                          Create a new subscription plan for CSC owners.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="my-4">
                        <PlanForm onSuccess={() => setAddPlanOpen(false)} />
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
            
            {activeTab === "dashboard" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card className="overflow-hidden border-none shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                          <h3 className="text-2xl font-bold mt-1">1,274</h3>
                          <p className="text-xs flex items-center mt-1 text-green-600">
                            <ArrowUp className="h-3 w-3 mr-1" /> 
                            <span>12% from last month</span>
                          </p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                          <Users className="h-6 w-6 text-brand-purple" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden border-none shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Posters</p>
                          <h3 className="text-2xl font-bold mt-1">349</h3>
                          <p className="text-xs flex items-center mt-1 text-green-600">
                            <ArrowUp className="h-3 w-3 mr-1" /> 
                            <span>8% from last month</span>
                          </p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <Image className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden border-none shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Downloads</p>
                          <h3 className="text-2xl font-bold mt-1">12,345</h3>
                          <p className="text-xs flex items-center mt-1 text-green-600">
                            <ArrowUp className="h-3 w-3 mr-1" /> 
                            <span>15% from last month</span>
                          </p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-6 w-6 text-green-600"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" x2="12" y1="15" y2="3" />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden border-none shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Active Plans</p>
                          <h3 className="text-2xl font-bold mt-1">3</h3>
                          <p className="text-xs flex items-center mt-1 text-muted-foreground">
                            <span>All plans active</span>
                          </p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mb-6">
                  <DashboardMetrics />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Users</CardTitle>
                      <CardDescription>Latest user registrations</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="border-t">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Email</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="px-4 py-3 text-sm">John Smith</td>
                              <td className="px-4 py-3 text-sm">john.smith@example.com</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">Active</span>
                              </td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-3 text-sm">Emma Wilson</td>
                              <td className="px-4 py-3 text-sm">emma@example.com</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">Active</span>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm">Dave Robertson</td>
                              <td className="px-4 py-3 text-sm">dave@example.com</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">Pending</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t p-4">
                      <Button variant="outline" size="sm">View All</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Popular Posters</CardTitle>
                      <CardDescription>Most downloaded posters</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="border-t">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Poster</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Category</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Downloads</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="px-4 py-3 text-sm">PM Kisan Scheme</td>
                              <td className="px-4 py-3 text-sm">Government Schemes</td>
                              <td className="px-4 py-3 text-sm font-medium">1,245</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-3 text-sm">Digital Banking Services</td>
                              <td className="px-4 py-3 text-sm">Banking</td>
                              <td className="px-4 py-3 text-sm font-medium">892</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm">Aadhaar Card Services</td>
                              <td className="px-4 py-3 text-sm">Digital Services</td>
                              <td className="px-4 py-3 text-sm font-medium">567</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t p-4">
                      <Button variant="outline" size="sm">View All</Button>
                    </CardFooter>
                  </Card>
                </div>
              </>
            )}
            
            {activeTab === "posters" && (
              <Card>
                <CardContent className="p-0">
                  <div className="rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-muted/50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Poster
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Added On
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Downloads
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 mr-3">
                                <div className="h-10 w-10 rounded-sm bg-gray-200"></div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  PM Kisan Scheme
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Government Schemes</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">May 10, 2023</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">1,245</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="destructive" size="sm">Delete</Button>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 mr-3">
                                <div className="h-10 w-10 rounded-sm bg-gray-200"></div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  Digital Banking Services
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Banking</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">May 8, 2023</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">892</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="destructive" size="sm">Delete</Button>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 mr-3">
                                <div className="h-10 w-10 rounded-sm bg-gray-200"></div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  Aadhaar Card Services
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Digital Services</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">May 5, 2023</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">567</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="destructive" size="sm">Delete</Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4 border-t">
                  <Button variant="outline">Previous</Button>
                  <Button variant="outline">Next</Button>
                </CardFooter>
              </Card>
            )}
            
            {activeTab === "plans" && (
              <Card>
                <CardContent className="p-0">
                  <PlansTable />
                </CardContent>
              </Card>
            )}
            
            {activeTab === "categories" && (
              <Card>
                <CardHeader>
                  <CardTitle>Categories Management</CardTitle>
                  <CardDescription>
                    Create and manage poster categories.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Categories management content goes here.</p>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "users" && (
              <Card>
                <CardContent className="p-0">
                  <UsersTable />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SidebarProvider>
    </Layout>
  );
};

export default Admin;
