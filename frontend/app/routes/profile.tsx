import React from "react";
import { useAuth } from "~/auth/useAuth";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <span className="sr-only">User Avatar</span>
            </Avatar>
            <div className="text-center">
              <h2 className="text-lg font-semibold">{user?.name || "User Name"}</h2>
              <p className="text-muted-foreground">{user?.email || "user@example.com"}</p>
            </div>
          </div>
          <Separator className="my-4" />
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" defaultValue={user?.name || ""} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email || ""} />
            </div>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
