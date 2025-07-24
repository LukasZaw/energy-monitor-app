import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "~/lib/axios";
import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { toast } from "sonner"; // Import Sonner toast

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { IconEdit, IconTrash } from "@tabler/icons-react";

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({ name: "", type: "", powerWatt: 0, dailyUsageHours: 0 });
  const [editingDevice, setEditingDevice] = useState(null); // State for the device being edited

  useEffect(() => {
    async function fetchDevices() {
      try {
        const response = await axiosInstance.get("/devices/user/me");
        setDevices(response.data);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    }
    fetchDevices();
  }, []);

  async function handleAddDevice(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/devices", newDevice);
      setDevices((prev) => [...prev, response.data]);
      setNewDevice({ name: "", type: "", powerWatt: 0, dailyUsageHours: 0 });
      toast.success("Device added successfully!");
    } catch (error) {
      console.error("Error adding device:", error);
      toast.error("Failed to add device.");
    }
  }

  async function handleEditDeviceSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/devices/${editingDevice.id}`, editingDevice);
      setDevices((prev) =>
        prev.map((device) => (device.id === editingDevice.id ? response.data : device))
      );
      setEditingDevice(null);
      toast.success("Device updated successfully!");
    } catch (error) {
      console.error("Error updating device:", error);
      toast.error("Failed to update device.");
    }
  }

  async function handleDeleteDevice(deviceId: number) {
    try {
      await axiosInstance.delete(`/devices/${deviceId}`);
      setDevices((prev) => prev.filter((device) => device.id !== deviceId));
      toast.success("Device deleted successfully!");
    } catch (error) {
      console.error("Error deleting device:", error);
      toast.error("Failed to delete device.");
    }
  }
  //TODO: Nie wyswietla sie popup o usunieciu, trzeba to poprawic
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="relative flex flex-1 flex-col p-4 md:p-6 lg:p-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="sm"
                className="absolute top-4 right-4 flex items-center gap-2"
              >
                <Plus className="size-4" />
                <span>Add Device</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Adding new device</SheetTitle>
                <SheetDescription>
                  <form onSubmit={handleAddDevice} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                      <Label htmlFor="device-name">Device Name</Label>
                      <Input
                        id="device-name"
                        type="text"
                        placeholder="Device Name"
                        value={newDevice.name}
                        onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label htmlFor="device-type">Device Type</Label>
                      <Input
                        id="device-type"
                        type="text"
                        placeholder="Device Type"
                        value={newDevice.type}
                        onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label htmlFor="device-power">Power (W)</Label>
                      <Input
                        id="device-power"
                        type="number"
                        placeholder="Power (W)"
                        value={newDevice.powerWatt}
                        onChange={(e) => setNewDevice({ ...newDevice, powerWatt: Number(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label htmlFor="device-usage">Daily Usage Hours</Label>
                      <Input
                        id="device-usage"
                        type="number"
                        placeholder="Daily Usage Hours"
                        value={newDevice.dailyUsageHours}
                        onChange={(e) => setNewDevice({ ...newDevice, dailyUsageHours: Number(e.target.value) })}
                        required
                      />
                    </div>
                    <Button type="submit" className="btn btn-primary">
                      Add Device
                    </Button>
                  </form>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          {/* Edit Device Sheet */}
          {editingDevice && (
            <Sheet open={!!editingDevice} onOpenChange={() => setEditingDevice(null)}>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Edit Device</SheetTitle>
                  <SheetDescription>
                    <form onSubmit={handleEditDeviceSubmit} className="flex flex-col gap-4">
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="edit-device-name">Device Name</Label>
                        <Input
                          id="edit-device-name"
                          type="text"
                          placeholder="Device Name"
                          value={editingDevice.name}
                          onChange={(e) =>
                            setEditingDevice({ ...editingDevice, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="edit-device-type">Device Type</Label>
                        <Input
                          id="edit-device-type"
                          type="text"
                          placeholder="Device Type"
                          value={editingDevice.type}
                          onChange={(e) =>
                            setEditingDevice({ ...editingDevice, type: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="edit-device-power">Power (W)</Label>
                        <Input
                          id="edit-device-power"
                          type="number"
                          placeholder="Power (W)"
                          value={editingDevice.powerWatt}
                          onChange={(e) =>
                            setEditingDevice({
                              ...editingDevice,
                              powerWatt: Number(e.target.value),
                            })
                          }
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="edit-device-usage">Daily Usage Hours</Label>
                        <Input
                          id="edit-device-usage"
                          type="number"
                          placeholder="Daily Usage Hours"
                          value={editingDevice.dailyUsageHours}
                          onChange={(e) =>
                            setEditingDevice({
                              ...editingDevice,
                              dailyUsageHours: Number(e.target.value),
                            })
                          }
                          required
                        />
                      </div>
                      <Button type="submit" className="btn btn-primary">
                        Save Changes
                      </Button>
                    </form>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          )}

          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {devices.map((device) => (
                    <Card key={device.id} className="@container/card">
                      <CardHeader>
                        <CardDescription>{device.type}</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                          {device.name}
                        </CardTitle>
                        <CardAction>
                          <Badge variant="outline">
                            <span>{device.powerWatt} W</span>
                          </Badge>
                        </CardAction>
                      </CardHeader>
                      <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                          Daily Usage: {device.dailyUsageHours} hours
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => setEditingDevice(device)}
                          >
                            <IconEdit className="size-4" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleDeleteDevice(device.id)}
                          >
                            <IconTrash className="size-4" />
                            Delete
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
