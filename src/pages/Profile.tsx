
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { User, Download, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  cscId: z.string().min(3, { message: "CSC ID must be at least 3 characters" }),
  cscName: z.string().min(3, { message: "CSC Name must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  bio: z.string().optional(),
});

// Mock data
const mockUser = {
  id: "user123",
  name: "Rajesh Kumar",
  cscId: "CSC123456",
  cscName: "Digital Seva Kendra",
  email: "rajesh@example.com",
  phone: "9876543210",
  address: "123, Main Street, Village Nagar, District City, State - 123456",
  bio: "Providing digital services to rural areas since 2018.",
  avatarUrl: "",
};

const mockDownloads = [
  { id: "1", title: "PM Kisan Scheme", date: "2023-05-10", category: "Government Schemes" },
  { id: "2", title: "Digital Banking Services", date: "2023-05-08", category: "Banking" },
  { id: "3", title: "Aadhaar Card Services", date: "2023-05-05", category: "Digital Services" },
];

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: mockUser.name,
      cscId: mockUser.cscId,
      cscName: mockUser.cscName,
      email: mockUser.email,
      phone: mockUser.phone,
      address: mockUser.address,
      bio: mockUser.bio,
    },
  });

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    // This would be replaced with an actual API call
    console.log("Updated profile:", values);
    setTimeout(() => {
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">My Profile</h1>
            {!isEditing && (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-brand-purple hover:bg-brand-darkPurple"
              >
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="downloads" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Download History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={mockUser.avatarUrl} />
                      <AvatarFallback className="bg-brand-purple text-white text-lg">
                        {mockUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      {mockUser.name}
                      <CardDescription>{mockUser.cscName} (ID: {mockUser.cscId})</CardDescription>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cscId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CSC ID</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cscName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CSC Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Textarea rows={2} {...field} />
                              </FormControl>
                              <FormDescription>
                                This address will appear on your poster footers.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea rows={3} {...field} />
                              </FormControl>
                              <FormDescription>
                                Briefly describe your CSC services.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end space-x-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            className="bg-brand-purple hover:bg-brand-darkPurple"
                          >
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium text-sm text-gray-500">Email Address</h3>
                          <p>{mockUser.email}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-gray-500">Phone Number</h3>
                          <p>{mockUser.phone}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-sm text-gray-500">Address</h3>
                        <p>{mockUser.address}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-sm text-gray-500">Bio</h3>
                        <p>{mockUser.bio}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-sm text-gray-500">Footer Preview</h3>
                        <div className="mt-2 p-3 border rounded-md bg-gray-50">
                          <div className="text-center text-sm">
                            <p className="font-semibold">{mockUser.cscName}</p>
                            <p>ID: {mockUser.cscId} | {mockUser.name}</p>
                            <p>{mockUser.address}</p>
                            <p>Contact: {mockUser.phone}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">This is how your details will appear on downloaded posters.</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="downloads">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Downloads</CardTitle>
                  <CardDescription>
                    Your recently downloaded marketing materials.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {mockDownloads.map((item) => (
                      <div key={item.id} className="py-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            Downloaded on {new Date(item.date).toLocaleDateString()}
                          </p>
                          <Button variant="link" size="sm" className="text-brand-purple p-0">
                            Download Again
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
