
import { useState, useEffect } from "react";
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
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  cscId: z.string().min(3, { message: "CSC ID must be at least 3 characters" }),
  cscName: z.string().min(3, { message: "CSC Name must be at least 3 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  bio: z.string().optional(),
});

interface Download {
  id: string;
  title: string;
  date: string;
  category: string;
}

// Mock data for download history
const mockDownloads: Download[] = [
  { id: "1", title: "PM Kisan Scheme", date: "2023-05-10", category: "Government Schemes" },
  { id: "2", title: "Digital Banking Services", date: "2023-05-08", category: "Banking" },
  { id: "3", title: "Aadhaar Card Services", date: "2023-05-05", category: "Digital Services" },
];

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, profile } = useAuth();
  const [downloads, setDownloads] = useState<Download[]>(mockDownloads);
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      cscId: profile?.csc_id || "",
      cscName: profile?.csc_name || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      bio: "",
    },
  });

  // Update form when profile data changes
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        cscId: profile.csc_id || "",
        cscName: profile.csc_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        bio: "",
      });
    }
  }, [profile, form]);

  // Fetch real download history (if available)
  useEffect(() => {
    const fetchDownloads = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('downloads')
          .select('id, poster_id, downloaded_at')
          .eq('user_id', user.id)
          .order('downloaded_at', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // For now, we'll continue using mock data
          // In a real app, you'd fetch poster details based on poster_id
          console.log("User downloads:", data);
        }
      } catch (error) {
        console.error("Error fetching downloads:", error);
      }
    };
    
    fetchDownloads();
  }, [user]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: values.name,
          csc_id: values.cscId,
          csc_name: values.cscName,
          phone: values.phone,
          address: values.address,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
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
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-brand-purple text-white text-lg">
                        {profile?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      {profile?.name || "User"}
                      <CardDescription>
                        {profile?.csc_name ? `${profile.csc_name} (ID: ${profile.csc_id})` : "Complete your profile"}
                      </CardDescription>
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
                                <Textarea rows={3} {...field} value={field.value || ""} />
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
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium text-sm text-gray-500">Email Address</h3>
                          <p>{user?.email || "Not set"}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-gray-500">Phone Number</h3>
                          <p>{profile?.phone || "Not set"}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-sm text-gray-500">Address</h3>
                        <p>{profile?.address || "Not set"}</p>
                      </div>
                      
                      {profile?.address && profile?.csc_name && (
                        <div>
                          <h3 className="font-medium text-sm text-gray-500">Footer Preview</h3>
                          <div className="mt-2 p-3 border rounded-md bg-gray-50">
                            <div className="text-center text-sm">
                              <p className="font-semibold">{profile.csc_name}</p>
                              <p>ID: {profile.csc_id} | {profile.name}</p>
                              <p>{profile.address}</p>
                              <p>Contact: {profile.phone}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">This is how your details will appear on downloaded posters.</p>
                        </div>
                      )}
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
                  {downloads.length > 0 ? (
                    <div className="divide-y">
                      {downloads.map((item) => (
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
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">You haven't downloaded any posters yet.</p>
                      <Button 
                        variant="link" 
                        className="text-brand-purple mt-2"
                        onClick={() => window.location.href = "/dashboard"}
                      >
                        Browse Available Posters
                      </Button>
                    </div>
                  )}
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
