import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputWithPrefix } from "@/components/ui/input-with-prefix";
import { Label } from "@/components/ui/label";
import {
  useCurrentUser,
  useUpdateCurrentUser,
} from "@/lib/hooks/useCurrentUser";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UpgradeModal } from "../modals/upgrade-modal";

function ProfileInfoSection() {
  const { data: user, isLoading: refetch } = useCurrentUser();
  const updateUser = useUpdateCurrentUser();
  const [isInitialized, setIsInitialized] = useState(false);
  const { register, handleSubmit, formState, setValue } = useForm({
    mode: "onChange",
  });

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const canEditSlug = user?.plan === "pro" || user?.plan === "lifetime";

  useEffect(() => {
    if (user && !isInitialized) {
      setValue("fullName", user.name || "");
      setValue("slug", user.slug || "");
      // setValue("username", user.username || "");
      setValue("email", user.email || "");
      setIsInitialized(true);
    }
  }, [user, isInitialized, setValue]);

  const onSubmit = async (values: any) => {
    try {
      const updateData: any = {
        name: values.fullName,
      };

      if (canEditSlug && values.slug !== user?.slug) {
        updateData.slug = values.slug;
      }

      await updateUser.mutateAsync(updateData);

      toast("Profile information updated successfully!");
    } catch (error) {
      toast("Failed to update profile information", {
        description: "Please try again.",
      });
    }
  };

  return (
    <Card className='bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 shadow-sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
          Account Information
        </CardTitle>
        <CardDescription className='text-gray-600 dark:text-gray-400'>
          Update your personal information
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-4'>
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label
                htmlFor='fullName'
                className='text-gray-900 dark:text-white'
              >
                Full Name
              </Label>
              <Input
                id='fullName'
                {...register("fullName", { required: true })}
              />
            </div>
            <div className='space-y-2'>
              <Label
                htmlFor='slug'
                className='text-gray-900 dark:text-white flex items-center relative'
              >
                Profile URL
                <button
                  type='button'
                  className='ml-2 px-2 py-0.5 absolute left-[4.5rem] rounded-full text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-yellow-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition'
                  onClick={() => setShowUpgradeModal(true)}
                  title='Upgrade to Pro to unlock this feature'
                >
                  PRO
                </button>
              </Label>
              {canEditSlug ? (
                <InputWithPrefix
                  id='slug'
                  prefix='speakerkit.com/'
                  {...register("slug", {
                    required: true,
                    minLength: 3,
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message:
                        "Slug can only contain lowercase letters, numbers, and hyphens",
                    },
                  })}
                />
              ) : (
                <InputWithPrefix
                  id='slug'
                  prefix='speakerkit.com/'
                  value={user?.slug || ""}
                  readOnly
                  disabled
                />
              )}
              {!canEditSlug && (
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                  Upgrade to Pro or Lifetime plan to customize your profile URL.
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email' className='text-gray-900 dark:text-white'>
              Email Address
            </Label>
            <Input id='email' {...register("email")} readOnly disabled />
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
      {/* Render the upgrade modal for profile URL */}
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        currentCount={0}
        limit={0}
        isPro={user?.isPro === "pro"}
      />
    </Card>
  );
}

export default ProfileInfoSection;
