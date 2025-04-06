import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserInfoInputs, userInfoSchema, preExistingConditionOptions, symptomDurationOptions, genderOptions } from "@/data/symptomCheckerSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface UserInfoFormProps {
  onSubmit: (data: UserInfoInputs) => void;
  onBack: () => void;
  hasSelectedSymptoms: boolean;
}

export function UserInfoForm({ onSubmit, onBack, hasSelectedSymptoms }: UserInfoFormProps) {
  const [expanded, setExpanded] = useState(false);
  
  const form = useForm<UserInfoInputs>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      age: "",
      gender: "not_specified",
      preExistingConditions: [],
      symptomDuration: "not_specified",
      additionalInfo: ""
    }
  });

  const handleSubmit = (data: UserInfoInputs) => {
    onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information (Optional)</CardTitle>
        <CardDescription>
          Provide more details to improve the accuracy of your results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter your age" 
                        {...field} 
                        min={0}
                        max={120}
                        aria-label="Age"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      aria-label="Gender"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genderOptions.map(option => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="symptomDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symptom Duration</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    aria-label="Symptom Duration"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="How long have you had these symptoms?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {symptomDurationOptions.map(option => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel htmlFor="preExistingConditions">Pre-existing Conditions</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {preExistingConditionOptions.map(option => (
                  <FormField
                    key={option.value}
                    control={form.control}
                    name="preExistingConditions"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            id={option.value}
                            checked={field.value?.includes(option.value)}
                            onCheckedChange={(checked) => {
                              const updatedValues = checked 
                                ? [...field.value, option.value]
                                : field.value.filter(value => value !== option.value);
                              field.onChange(updatedValues);
                            }}
                            aria-label={option.label}
                          />
                        </FormControl>
                        <FormLabel htmlFor={option.value} className="text-sm font-normal cursor-pointer">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any other details you'd like to share..." 
                      {...field} 
                      className="min-h-[100px]"
                      aria-label="Additional Information"
                    />
                  </FormControl>
                  <FormDescription>
                    Include any other symptoms or concerns not listed in the checklist.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between space-x-4 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                aria-label="Back to symptoms selection"
              >
                Back to Symptoms
              </Button>
              <Button 
                type="submit"
                disabled={!hasSelectedSymptoms}
                aria-label="Analyze symptoms and additional information"
              >
                Analyze My Symptoms
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}