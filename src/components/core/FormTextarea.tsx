import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useId } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface FormTextareaProps {
    name: string;
    label?: string;
    description?: string;
    descriptionTop?: string;
    optional?: boolean;
}

export function FormTextarea({
    name,
    label,
    description,
    descriptionTop,
    optional = false,
    ...rest
}: FormTextareaProps & React.ComponentProps<typeof Textarea>) {
    const id = useId();
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field>
                    <FieldLabel htmlFor={id}>
                        {label}
                        {optional && (
                            <span className="text-muted-foreground">(Optional)</span>
                        )}
                    </FieldLabel>
                    {descriptionTop && (
                        <FieldDescription>{descriptionTop}</FieldDescription>
                    )}
                    <Textarea id={id} {...rest} {...field} />
                    {description && <FieldDescription>{description}</FieldDescription>}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
}
