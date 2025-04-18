import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useMobile } from "@/hooks/use-mobile";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const settingsFormSchema = z.object({
  refreshInterval: z.enum(["never", "daily", "weekly", "monthly"]),
  apiKey: z.string().optional(),
  openaiApiKey: z.string().optional(),
  emailNotifications: z.boolean(),
  dataExportFormat: z.enum(["csv", "json", "excel"]),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isMobile } = useMobile();
  const { toast } = useToast();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      refreshInterval: "weekly",
      apiKey: "",
      openaiApiKey: "",
      emailNotifications: true,
      dataExportFormat: "csv",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: SettingsFormValues) {
    try {
      setIsSubmitting(true);

      // Handle OpenAI API key update if provided
      if (data.openaiApiKey) {
        toast({
          title: "Updating API key",
          description: "Saving your OpenAI API key...",
        });
        
        const response = await fetch("/api/settings/openai-key", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ openaiApiKey: data.openaiApiKey }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update OpenAI API key");
        }
      }
      
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved successfully.",
      });
      console.log(data);
      
      // Clear the OpenAI API key from the form for security
      form.setValue("openaiApiKey", "");
      
      // After a brief delay, redirect back to the dashboard
      setTimeout(() => {
        // Redirect to dashboard to try the fresh API key
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Settings update failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-64 h-full">
            <Sidebar />
          </div>
        </div>
      )}
      
      {/* Desktop sidebar */}
      {!isMobile && <Sidebar />}
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />
        
        <main className="flex-1 overflow-y-auto bg-youtube-light-gray p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-youtube-black">Settings</h1>
            <p className="text-youtube-gray">Configure your YouTube niche analysis preferences</p>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>
                Manage your analysis preferences and notification settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="refreshInterval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Refresh Interval</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select refresh interval" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="never">Never (Manual only)</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          How often should we refresh your niche analysis data
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube API Key (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your YouTube API key" {...field} />
                        </FormControl>
                        <FormDescription>
                          Provide your own YouTube API key for enhanced analysis
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="openaiApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OpenAI API Key</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter your OpenAI API key" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Add your OpenAI API key to enable AI-powered niche analysis
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Email Notifications</FormLabel>
                          <FormDescription>
                            Receive email notifications when niche trends change significantly
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dataExportFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Export Format</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select export format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Default format when exporting niche analysis data
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="bg-youtube-red hover:bg-red-700 text-white w-36"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Settings"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your account details and usage statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Account Type</span>
                  <span>Free Plan</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Analytics Refreshes</span>
                  <span>3 of 5 used this month</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Last Analysis</span>
                  <span>Today, 10:45 AM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Next Scheduled Analysis</span>
                  <span>June 23, 2024</span>
                </div>
                
                <div className="mt-8">
                  <Button variant="outline" className="mr-2">Upgrade Plan</Button>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
