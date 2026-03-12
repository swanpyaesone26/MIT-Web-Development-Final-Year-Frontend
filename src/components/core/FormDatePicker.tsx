import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import { Controller, useFormContext } from "react-hook-form";
import { DatePicker } from "./DatePicker";

interface FormDatePickerProps {
    name: string;
    label?: string;
    description?: string;
    descriptionTop?: string;
    optional?: boolean;
}

export function FormDatePicker({
    name,
    label,
    description,
    descriptionTop,
    optional = false,
    ...rest
}: FormDatePickerProps & React.ComponentProps<typeof DatePicker>) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field>
                    <FieldLabel>
                        {label}
                        {optional && (
                            <span className="text-muted-foreground">(Optional)</span>
                        )}
                    </FieldLabel>
                    {descriptionTop && (
                        <FieldDescription>{descriptionTop}</FieldDescription>
                    )}
                    <DatePicker {...rest} {...field} />
                    {description && <FieldDescription>{description}</FieldDescription>}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
}
