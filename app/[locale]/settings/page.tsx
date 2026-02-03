"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Camera, Save, User } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// 表单验证模式
const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const t = useTranslations("settings");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // 初始化表单
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
  });

  // 加载用户数据
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          reset({ name: data.user.name || "" });
          setAvatarPreview(data.user.image);
        } else {
          toast.error("Failed to load user profile");
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast.error("Failed to load user profile");
      }
    };

    fetchUserProfile();
  }, [reset, toast]);

  // 处理头像上传
  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(t("errors.fileTypeNotAllowed"));
      return;
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("errors.fileTooLarge"));
      return;
    }

    // 预览图片
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 上传文件
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/user/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        // 更新用户资料中的头像URL
        const updateResponse = await fetch("/api/user/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: data.fileUrl }),
        });

        if (updateResponse.ok) {
          toast.success(t("avatarUpdated"));
          // 更新本地用户状态
          setUser((prev) => (prev ? { ...prev, image: data.fileUrl } : null));
        } else {
          throw new Error("Failed to update profile");
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload avatar"
      );
      // 恢复之前的预览
      setAvatarPreview(user?.image || null);
    } finally {
      setIsUploading(false);
      // 清空文件输入，允许重新选择同一文件
      event.target.value = "";
    }
  };

  // 处理表单提交
  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: data.name }),
      });

      if (response.ok) {
        toast.success(t("profileUpdated"));
        // 更新本地用户状态
        setUser((prev) => (prev ? { ...prev, name: data.name } : null));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

        <div className="grid gap-8">
          {/* 头像设置卡片 */}
          <Card>
            <CardHeader>
              <CardTitle>{t("profilePicture")}</CardTitle>
              <CardDescription>
                {t("profilePictureDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage
                      src={avatarPreview || undefined}
                      alt={user.name || "User"}
                    />
                    <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                      {user.name ? (
                        user.name[0].toUpperCase()
                      ) : (
                        <User className="h-16 w-16" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {isUploading && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-full">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto"
                        disabled={isUploading}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        {isUploading ? t("uploading") : t("uploadNewPicture")}
                      </Button>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                        disabled={isUploading}
                      />
                    </label>
                    <p className="text-sm text-muted-foreground mt-2">
                      {t("clickToSelect")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 个人信息卡片 */}
          <Card>
            <CardHeader>
              <CardTitle>{t("personalInformation")}</CardTitle>
              <CardDescription>
                {t("personalInformationDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-sm font-medium mb-2 block"
                    >
                      {t("displayName")}
                    </label>
                    <Input
                      id="name"
                      placeholder={t("enterDisplayName")}
                      {...register("name")}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-medium mb-2 block"
                    >
                      {t("emailAddress")}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("emailCannotBeChanged")}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("saving")}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t("saveChanges")}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
