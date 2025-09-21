"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  UserProfile,
  SignOutButton,
  useUser,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

export default function DevTools() {
  const { user } = useUser();
  return (
    <div className="container fixed bottom-0 right-1/2 translate-x-1/2 z-50 w-full max-h-[100px] hover:max-h-screen transition-all duration-300 overflow-y-scroll p-4">
      <Card>
        <CardHeader>
          <CardTitle>DevTools</CardTitle>
          <hr className="my-2" />
          <CardContent>
            <div className="mb-2">
              <span className="text-sm text-muted-foreground">Clerk Auth</span>
            </div>
            {user && (
              <div className="border rounded-md p-2 border-accent flex gap-2">
                <div className="flex-1">
                  <UserProfile routing="hash" />
                </div>
                <div className="flex-shrink-0">
                  <SignOutButton>
                    <Button variant="destructive">Sign Out</Button>
                  </SignOutButton>
                </div>
              </div>
            )}

            {!user && (
              <div className="border rounded-md p-2 border-accent flex gap-2">
                <div className="">
                  <SignInButton>
                    <Button>Sign In</Button>
                  </SignInButton>
                </div>
                <div className="">
                  <SignUpButton>
                    <Button variant="outline">Sign Up</Button>
                  </SignUpButton>
                </div>
              </div>
            )}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
