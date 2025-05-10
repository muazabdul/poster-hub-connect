
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import CategoriesTable from "@/components/admin/CategoriesTable";
import PostersTable from "@/components/admin/PostersTable";
import CategoryForm from "@/components/admin/CategoryForm";
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
  const navigate = useNavigate();
  const [addPosterOpen, setAddPosterOpen] = useState(false);
  const [addPlanOpen, setAddPlanOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleViewAllUsers = () => {
    setActiveTab("users");
  };

  const handleViewAllPosters = () => {
    setActiveTab("posters");
  };

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
                        isActive={activeTab === "categories"} 
                        onClick={() => setActiveTab("categories")}
                      >
                        <FolderIcon className="mr-2 h-4 w-4" />
                        <span>Categories</span>
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
                      <SidebarMenuButton
                        isActive={activeTab === "general"} 
                        onClick={() => setActiveTab("general")}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>General</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "appearance"} 
                        onClick={() => setActiveTab("appearance")}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Appearance</span>
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
                
                {activeTab === "categories" && (
                  <Dialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-brand-purple hover:bg-brand-darkPurple">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px]">
                      <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                        <DialogDescription>
                          Create a new category for posters.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="my-4">
                        <CategoryForm onSuccess={() => setAddCategoryOpen(false)} />
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
                      <Button variant="outline" size="sm" onClick={handleViewAllUsers}>View All</Button>
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
                      <Button variant="outline" size="sm" onClick={handleViewAllPosters}>View All</Button>
                    </CardFooter>
                  </Card>
                </div>
              </>
            )}
            
            {activeTab === "posters" && (
              <Card>
                <CardContent className="p-0">
                  <PostersTable />
                </CardContent>
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
                <CardContent className="p-0">
                  <CategoriesTable />
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
            
            {activeTab === "general" && (
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Manage payment gateway and other general settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Payment Gateway Integration</h3>
                      <div className="bg-gray-50 p-4 rounded-md border">
                        <div className="grid gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Payment Gateway
                              </label>
                              <select className="w-full rounded-md border border-gray-300 p-2">
                                <option value="razorpay">Razorpay</option>
                                <option value="stripe">Stripe</option>
                                <option value="paypal">PayPal</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                API Key
                              </label>
                              <input type="text" placeholder="Enter API Key" className="w-full rounded-md border border-gray-300 p-2" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                API Secret
                              </label>
                              <input type="password" placeholder="Enter API Secret" className="w-full rounded-md border border-gray-300 p-2" />
                            </div>
                          </div>
                          <div>
                            <label className="inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
                              <span className="ml-3 text-sm font-medium text-gray-700">Enable Test Mode</span>
                            </label>
                          </div>
                          <Button className="bg-brand-purple hover:bg-brand-darkPurple w-auto">
                            Save Payment Settings
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "appearance" && (
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>Manage website appearance and pages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Page Management</h3>
                      <div className="overflow-x-auto border rounded-md">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page Name</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="px-4 py-3 text-sm">Home</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">Published</span>
                              </td>
                              <td className="px-4 py-3 text-sm">2023-05-10</td>
                              <td className="px-4 py-3 text-right text-sm">
                                <Button variant="ghost" size="sm" className="h-8 text-brand-purple">Edit</Button>
                                <Button variant="ghost" size="sm" className="h-8 text-gray-500" disabled>Delete</Button>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm">Pricing</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">Draft</span>
                              </td>
                              <td className="px-4 py-3 text-sm">2023-05-08</td>
                              <td className="px-4 py-3 text-right text-sm">
                                <Button variant="ghost" size="sm" className="h-8 text-brand-purple">Edit</Button>
                                <Button variant="ghost" size="sm" className="h-8 text-red-500">Delete</Button>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm">Contact</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">Draft</span>
                              </td>
                              <td className="px-4 py-3 text-sm">2023-05-05</td>
                              <td className="px-4 py-3 text-right text-sm">
                                <Button variant="ghost" size="sm" className="h-8 text-brand-purple">Edit</Button>
                                <Button variant="ghost" size="sm" className="h-8 text-red-500">Delete</Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <Button className="mt-4 bg-brand-purple hover:bg-brand-darkPurple">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Page
                      </Button>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-2">Header & Footer</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-md border">
                          <h4 className="font-medium mb-3">Header Settings</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                              <div className="flex items-center">
                                <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center mr-3">
                                  <Image className="h-6 w-6 text-gray-500" />
                                </div>
                                <Button variant="outline" size="sm">Upload</Button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Navigation Links
                              </label>
                              <div className="space-y-2">
                                <div className="flex items-center">
                                  <input type="text" value="Home" className="flex-grow rounded-md border border-gray-300 p-1 mr-2" />
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                                <div className="flex items-center">
                                  <input type="text" value="Dashboard" className="flex-grow rounded-md border border-gray-300 p-1 mr-2" />
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                                <Button variant="outline" size="sm" className="mt-2">
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Link
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-md border">
                          <h4 className="font-medium mb-3">Footer Settings</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Copyright Text
                              </label>
                              <input type="text" value="© 2023 CSC Portal. All rights reserved." className="w-full rounded-md border border-gray-300 p-2" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Social Media Links
                              </label>
                              <div className="space-y-2">
                                <div className="flex items-center">
                                  <select className="w-24 rounded-md border border-gray-300 p-1 mr-2">
                                    <option>Facebook</option>
                                    <option>Twitter</option>
                                    <option>Instagram</option>
                                  </select>
                                  <input type="text" placeholder="URL" className="flex-grow rounded-md border border-gray-300 p-1 mr-2" />
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                                <Button variant="outline" size="sm" className="mt-2">
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Social Link
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button className="mt-4 bg-brand-purple hover:bg-brand-darkPurple">
                        Save Appearance Settings
                      </Button>
                    </div>
                  </div>
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
