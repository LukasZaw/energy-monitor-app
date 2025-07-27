import React, { useEffect, useState } from "react";
import { useAuth } from "~/auth/useAuth";
import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import axiosInstance from "~/lib/axios";

export default function ProfilePage() {
  const { user } = useAuth();
  const [energyCostPerKwh, setEnergyCostPerKwh] = useState("");

  useEffect(() => {
    const fetchEnergyCost = async () => {
      try {
        const response = await axiosInstance.get("/users/me");
        setEnergyCostPerKwh(response.data.energyCostPerKwh);
      } catch (error) {
        console.error("Error fetching energy cost:", error);
      }
    };

    fetchEnergyCost();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedData = {
      username: formData.get("name"),
      email: formData.get("email"),
    };

    try {
      await axiosInstance.put("/users/me", updatedData);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const energyCostPerKwh = formData.get("energy_cost_per_kwh");

    try {
      await axiosInstance.put(`/users/set-energy-cost?energyCostPerKwh=${energyCostPerKwh}`);
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings.");
    }
  };

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="container mx-auto p-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-2xl">User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="flex justify-center gap-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                  <div className="flex flex-col items-center gap-6">
                    <Avatar className="h-28 w-28 rounded-lg bg-gray-200 flex items-center justify-center text-4xl font-bold">
                      <AvatarImage src={user?.avatar} alt={user?.name || "User Avatar"} />
                      <AvatarFallback className="rounded-lg">
                        {user?.name ? user.name[0].toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h2 className="text-xl font-semibold">{user?.name || "User Name"}</h2>
                      <p className="text-muted-foreground">{user?.email || "user@example.com"}</p>
                    </div>
                  </div>
                  <Separator className="my-6" />
                  <form className="space-y-6" onSubmit={handleProfileSubmit}>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" type="text" defaultValue={user?.name || ""} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" defaultValue={user?.email || ""} />
                    </div>
                    <Button type="submit" className="w-full">
                      Save Changes
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="settings">
                  <form className="space-y-6" onSubmit={handleSettingsSubmit}>
                    <div>
                      <Label htmlFor="energy_cost_per_kwh">Energy Cost per kWh</Label>
                      <Input
                        id="energy_cost_per_kwh"
                        name="energy_cost_per_kwh"
                        type="number"
                        step="0.01"
                        placeholder="Enter cost per kWh"
                        value={energyCostPerKwh}
                        onChange={(e) => setEnergyCostPerKwh(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Save Settings
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
