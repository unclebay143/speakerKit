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
import { Controller, useForm } from "react-hook-form";

const EXPERTISE_OPTIONS = [
  { value: "agriculture", label: "Agriculture, Food & Forestry" },
  { value: "arts", label: "Arts" },
  { value: "business", label: "Business & Management" },
  { value: "consumer", label: "Consumer Goods & Services" },
  { value: "energy", label: "Energy & Basic Resources" },
  { value: "environment", label: "Environment & Cleantech" },
  { value: "finance", label: "Finance & Banking" },
  { value: "government", label: "Government, Social Sector & Education" },
  { value: "health", label: "Health & Medical" },
  { value: "humanities", label: "Humanities & Social Sciences" },
  { value: "ict", label: "Information & Communications Technology" },
  { value: "law", label: "Law & Regulation" },
  { value: "manufacturing", label: "Manufacturing & Industrial Materials" },
  { value: "media", label: "Media & Information" },
  { value: "sciences", label: "Physical & Life Sciences" },
  { value: "realestate", label: "Real Estate & Architecture" },
  { value: "region", label: "Region & Country" },
  { value: "transport", label: "Transports & Logistics" },
  { value: "travel", label: "Travel & Tourism" },
];
const TOPIC_OPTIONS = [
  { value: "react", label: "React" },
  { value: "graphql", label: "GraphQL" },
  { value: "leadership", label: "Leadership" },
  { value: "web3", label: "Web3" },
  { value: "typescript", label: "TypeScript" },
  { value: "testing", label: "Testing" },
];
const CITY_OPTIONS = [
  "Lagos",
  "London",
  "New York",
  "San Francisco",
  "Berlin",
  "Nairobi",
  "Paris",
];

export function UserExpertiseSection() {
  const { control, handleSubmit, formState, reset } = useForm({
    defaultValues: {
      expertise: [],
      topics: [],
      location: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: any) => {
    // TODO: Save to backend
    // For now, just log
    console.log("Expertise form values:", values);
    reset(values); // Reset dirty state
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
                  options={EXPERTISE_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder='Select your areas of expertise'
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
                  options={TOPIC_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder='Select topics you are interested in'
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
              disabled={!formState.isDirty || !formState.isValid}
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
