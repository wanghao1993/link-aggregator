"use client";

import { useParams, useRouter } from "next/navigation";
import { LogOut, User as UserIcon, Settings } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface User {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface UserButtonProps {
  user: User | null;
}

export default function UserButton({ user }: UserButtonProps) {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  if (!user) {
    return (
      <Button onClick={() => router.push(`/${locale}/auth/signin`)} size="sm">
        Sign In
      </Button>
    );
  }

  const handleSignOut = async () => {
    const response = await fetch("/api/auth/signout", {
      method: "POST",
    });
    if (response.ok) {
      router.push(`/${locale}`);
      router.refresh();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.image || undefined}
              alt={user.name || "User"}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {(user.name || user.email || "U")[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(`/${locale}/me`)}>
          <UserIcon />
          My Page
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/${locale}/settings`)}>
          <Settings />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <LogOut />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
