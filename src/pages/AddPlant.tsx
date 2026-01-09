import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { MainLayout } from "@/components/layout/MainLayout";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

const formSchema = z.object({
  scientific_name: z.string()
    .trim()
    .min(3, { message: "Scientific name must be at least 3 characters" })
    .max(100, { message: "Scientific name must be less than 100 characters" })
    .nonempty({ message: "Scientific name is required" }),
  price: z.union([
    z.string().transform(val => val === '' ? undefined : parseFloat(val)),
    z.number()
  ])
    .optional()
    .refine(val => val === undefined || val > 0, { 
      message: "Price must be a positive number" 
    })
});

type FormData = z.infer<typeof formSchema>;

export default function AddPlant() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scientific_name: "",
      price: undefined
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    // Show immediate feedback that submission is in progress
    toast.info("Submitting plant...", { id: "plant-submit" });

    try {
      const response = await fetch("https://jordaandigi.app.n8n.cloud/webhook/text_input", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scientific_name: data.scientific_name,
          price: data.price
        })
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      const result = await response.json();

      form.reset();

      // Show success and navigate to the new plant
      const plantName = result.plant?.common_name || result.plant?.scientific_name || "Plant";
      toast.success(`${plantName} added to your collection!`, { id: "plant-submit" });

      if (result.plant?.id) {
        navigate(`/plant/${result.plant.id}`);
      } else {
        navigate("/");
      }
      
    } catch (error) {
      toast.error("Failed to submit plant. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto w-full">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Add New Plant" },
          ]}
          className="mb-6"
        />

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-woodland-text-main">
            Add New Plant
          </h1>
          <p className="text-woodland-text-muted mt-2">
            Enter the scientific name to add a new plant to your collection.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-woodland-border-light p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="scientific_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-woodland-text-main">Scientific Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Quercus robur"
                        {...field}
                        disabled={isSubmitting}
                        className="border-woodland-border-light focus:border-woodland-primary focus:ring-woodland-primary/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-woodland-text-main">Price (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="e.g., 15.99"
                        {...field}
                        disabled={isSubmitting}
                        className="border-woodland-border-light focus:border-woodland-primary focus:ring-woodland-primary/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-woodland-primary hover:bg-woodland-primary/90 text-white"
                >
                  {isSubmitting && (
                    <MaterialIcon name="progress_activity" className="mr-2 animate-spin" size="sm" />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit Plant"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  disabled={isSubmitting}
                  className="border-woodland-border-light text-woodland-text-main hover:bg-woodland-background-light"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </MainLayout>
  );
}
