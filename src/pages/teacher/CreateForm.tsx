import * as z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { FieldGroup } from "@/components/ui/field";
import { useAssignmentMutation } from "@/queries/teacher.query";
import { FormInput } from "@/components/core/FormInput";
import { FormDatePicker } from "@/components/core/FormDatePicker";
import { useState } from "react";

const assignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string({ message: "Description is required" }),
  dueDate: z.string({ message: "Due date is required" }),
});

export type AssignmentForm = z.infer<typeof assignmentSchema>;

export function AddAssignmentDialog() {
  const { mutate, isPending } = useAssignmentMutation();
  const [open, setOpen] = useState(false);


  const form = useForm<AssignmentForm>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: undefined,
    },
  });


  const onSubmit = (data: AssignmentForm) => {
    mutate(data, {
      onSuccess: () => {
        form.reset()
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus /> Add Assignment
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="mb-3">
              <DialogTitle>Add New Assignment</DialogTitle>
              <DialogDescription>
                Fill out the assignment details below and click create.
              </DialogDescription>
            </DialogHeader>

            <FieldGroup className="mb-6">
              <FormInput
                name="title"
                placeholder="Enter title"
                label="Title"
              />
              <FormInput
                name="description"
                placeholder="Enter description"
                label="Description"
              />

              <FormDatePicker
                name="dueDate"
                label="Due Date"
                disabled={[{ before: new Date() }]}
                endMonth={new Date(new Date().getFullYear() + 10, 11)}
              />
            </FieldGroup>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{isPending ? "Creating..." : "Create"}</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
