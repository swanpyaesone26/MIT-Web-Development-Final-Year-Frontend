import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useId, useState } from "react";

interface DatePickerProps {
  isDisabled?: boolean;
  value?: Date | string;
  className?: string;
  defaultValue?: string;
  isClearable?: boolean;
  onChange?: (date?: string) => void;
}

export function DatePicker({
  value,
  className,
  defaultValue,
  isClearable,
  onChange,
  isDisabled,
  ...rest
}: DatePickerProps & React.ComponentProps<typeof Calendar>) {
  const id = useId();
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value) : defaultValue ? new Date(defaultValue) : undefined,
  );

  const [open, setOpen] = useState(false);

  const handleChange = (val?: Date) => {
    setDate(val);
    if (val) {
      setOpen(false);
    }
    if (onChange) {
      onChange(val?.toISOString());
    }
  };

  const handleClear = () => {
    setDate(undefined);
    if (onChange) onChange(undefined);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={isDisabled}
          id={id}
          variant="outline"
          className={cn(
            "group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal",
            className
          )}
        >
          <span className={cn("truncate", !date && "text-muted-foreground")}>
            {date ? format(date, "dd/MM/yyyy") : "pick-a-date"}
          </span>

          <CalendarIcon
            size={16}
            className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-2" align="start">
        <Calendar
          {...rest}
          mode="single"
          selected={date}
          onSelect={handleChange}
          captionLayout="dropdown"
        />

        {isClearable && (
          <Button variant="outline" className="w-full mt-2" onClick={handleClear}>
            Clear
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
