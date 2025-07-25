import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useCurrentUser,
  useUpdateCurrentUser,
} from "@/lib/hooks/useCurrentUser";
import { Eye, Lock, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

function VisibilitySection() {
  const { data: user, refetch } = useCurrentUser();
  const updateUser = useUpdateCurrentUser();
  const [isInitialized, setIsInitialized] = useState(false);
  const { control, handleSubmit, formState, setValue, watch } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    if (user && !isInitialized) {
      setValue("isPublic", user.isPublic !== false);
      setIsInitialized(true);
    }
  }, [user, isInitialized, setValue]);

  const isPublic = watch("isPublic");

  const onSubmit = async (values: any) => {
    try {
      await updateUser.mutateAsync({ isPublic: values.isPublic });
      toast(
        `Profile visibility ${
          values.isPublic ? "enabled" : "disabled"
        } successfully!`
      );
      refetch();
    } catch (error) {
      toast("Failed to update profile visibility", {
        description: "Please try again.",
      });
    }
  };

  return (
    <Card className='bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 shadow-sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
          <Shield className='w-5 h-5' />
          Account Visibility
        </CardTitle>
        <CardDescription className='text-gray-600 dark:text-gray-400'>
          Control who can view your profiles
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-6'>
          <div className='flex flex-col sm:flex-row gap-4 sm:items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10'>
            <div className='flex items-center gap-3'>
              {isPublic ? (
                <Eye className='w-5 h-5 text-green-400 hidden sm:block' />
              ) : (
                <Lock className='w-5 h-5 text-orange-400 hidden sm:block' />
              )}
              <div>
                <Label className='text-gray-900 dark:text-white'>
                  Profile Visibility
                </Label>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {isPublic
                    ? "Your profiles are publicly accessible"
                    : "Your profiles are private and hidden from public view"}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Badge
                variant={isPublic ? "default" : "secondary"}
                className={
                  isPublic
                    ? "bg-purple-100 dark:bg-purple-600/20 text-purple-800 dark:text-purple-400 border-purple-200 dark:border-purple-500/30"
                    : "bg-gray-100 dark:bg-gray-600/20 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-500/30"
                }
              >
                {isPublic ? "Visible" : "Hidden"}
              </Badge>
              <Controller
                name='isPublic'
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                )}
              />
            </div>
          </div>
          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={
                !formState.isDirty || !formState.isValid || updateUser.isPending
              }
              className='bg-purple-600 hover:bg-purple-700 text-white'
            >
              {updateUser.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}

export default VisibilitySection;
