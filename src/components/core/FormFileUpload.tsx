import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import { Controller, useFormContext } from "react-hook-form";
import { FileUpload } from "./FileUpload";

interface FormFileUploadProps {
    name: string;
    label?: string;
    description?: string;
    descriptionTop?: string;
    optional?: boolean;
}

export function FormFileUpload({
    name,
    label,
    description,
    descriptionTop,
    optional = false,
    ...rest
}: FormFileUploadProps & React.ComponentProps<typeof FileUpload>) {
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
                    <FileUpload {...rest} {...field} />
                    {description && <FieldDescription>{description}</FieldDescription>}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
}