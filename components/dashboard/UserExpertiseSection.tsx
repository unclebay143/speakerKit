import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  useCurrentUser,
  useUpdateCurrentUser,
} from "@/lib/hooks/useCurrentUser";
import { useExpertise, useTopics } from "@/lib/hooks/useExpertiseAndTopics";
import { CITY_OPTIONS } from "@/lib/utils";
import { useEffect } from "react";
import { Controller, useForm, useFormState } from "react-hook-form";
import { toast } from "sonner";

export function UserExpertiseSection() {
  const { data: user } = useCurrentUser();
  const updateUser = useUpdateCurrentUser();

  const { expertise: expertiseOptions, createExpertise } = useExpertise();

  const { topics: topicOptions, createTopic } = useTopics();
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      expertise: [],
      topics: [],
      location: "",
    },
    mode: "onChange",
  });
  const { isDirty, isValid } = useFormState({ control });

  useEffect(() => {
    if (user) {
      // Only reset if the loaded values are different from the current form values
      const current = watch();
      if (
        JSON.stringify(current.expertise) !==
          JSON.stringify(user.expertise || []) ||
        JSON.stringify(current.topics) !== JSON.stringify(user.topics || []) ||
        current.location !== (user.location || "")
      ) {
        reset({
          expertise: user.expertise || [],
          topics: user.topics || [],
          location: user.location || "",
        });
      }
    }
  }, [user, reset, watch]);

  const onSubmit = async (values: any) => {
    try {
      await updateUser.mutateAsync({
        expertise: values.expertise,
        topics: values.topics,
        location: values.location,
      });
      toast("Expertise and topics updated!");
      reset(values); // Reset dirty state
    } catch (e) {
      toast("Failed to update expertise", { description: "Please try again." });
    }
  };

  return (
    <Card className='bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 shadow-sm'>
      <CardHeader>
        <CardTitle className='text-gray-900 dark:text-white'>
          Expertise & Topics
        </CardTitle>
        <CardDescription className='text-gray-600 dark:text-gray-400'>
          Select your areas of expertise, topics of interest, and location.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-6'>
          <div>
            <Label className='block mb-2 text-gray-900 dark:text-white'>
              Area of Expertise
            </Label>
            <Controller
              control={control}
              name='expertise'
              render={({ field }) => (
                <MultiSelect
                  options={expertiseOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder='Select your areas of expertise'
                  onCreateOption={async (label) => {
                    try {
                      const newOpt = await createExpertise.mutateAsync(label);
                      field.onChange([...(field.value || []), newOpt.label]);
                    } catch (e) {}
                  }}
                />
              )}
            />
          </div>
          <div>
            <Label className='block mb-2 text-gray-900 dark:text-white'>
              Topics of Interest
            </Label>
            <Controller
              control={control}
              name='topics'
              render={({ field }) => (
                <MultiSelect
                  options={topicOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder='Select topics you are interested in'
                  onCreateOption={async (label) => {
                    try {
                      const newOpt = await createTopic.mutateAsync(label);
                      field.onChange([...(field.value || []), newOpt.label]);
                    } catch (e) {}
                  }}
                />
              )}
            />
          </div>
          <div>
            <Label className='block mb-2 text-gray-900 dark:text-white'>
              Location
            </Label>
            <Controller
              control={control}
              name='location'
              render={({ field }) => (
                <Input
                  list='city-list'
                  value={field.value}
                  onChange={field.onChange}
                  placeholder='Type your city or town'
                />
              )}
            />
            <datalist id='city-list'>
              {CITY_OPTIONS.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </div>
          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={!isDirty || !isValid}
              className='bg-purple-600 hover:bg-purple-700 text-white'
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
