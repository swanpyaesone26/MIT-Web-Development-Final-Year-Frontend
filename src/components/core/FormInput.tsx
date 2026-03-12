import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useId } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface FormInputProps {
    name: string;
    label?: string;
    description?: string;
    descriptionTop?: string;
    optional?: boolean;
}

export function FormInput({
    name,
    label,
    description,
    descriptionTop,
    optional = false,
    ...rest
}: FormInputProps & React.ComponentProps<typeof Input>) {
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
                    <Input id={id} {...rest} {...field} />
                    {description && <FieldDescription>{description}</FieldDescription>}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
}
