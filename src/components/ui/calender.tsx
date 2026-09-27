import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  DayButton,
  DayPicker,
  getDefaultClassNames,
  type DayPickerProps,
} from "react-day-picker";

import { cn } from "../../lib/utils";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: DayPickerProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("flex flex-col", defaultClassNames.months),
        month: cn("space-y-4", defaultClassNames.month),

        month_caption: cn(
          "flex h-8 items-center justify-center",
          defaultClassNames.month_caption
        ),

        caption_label: cn(
          "text-sm font-medium",
          defaultClassNames.caption_label
        ),

        nav: cn(
          "flex items-center gap-1",
          defaultClassNames.nav
        ),

        button_previous: cn(
          "h-8 w-8 rounded-md p-0 hover:bg-accent hover:text-accent-foreground",
          defaultClassNames.button_previous
        ),

        button_next: cn(
          "h-8 w-8 rounded-md p-0 hover:bg-accent hover:text-accent-foreground",
          defaultClassNames.button_next
        ),

        month_grid: cn(
          "w-full border-collapse",
          defaultClassNames.month_grid
        ),

        weekdays: cn(
          "flex",
          defaultClassNames.weekdays
        ),

        weekday: cn(
          "flex-1 text-center text-xs font-normal text-muted-foreground",
          defaultClassNames.weekday
        ),

        week: cn(
          "mt-2 flex w-full",
          defaultClassNames.week
        ),

        day: cn(
          "flex-1 p-0 text-center",
          defaultClassNames.day
        ),

        day_button: cn(
          "h-9 w-9 rounded-md p-0 font-normal hover:bg-accent hover:text-accent-foreground",
          defaultClassNames.day_button
        ),

        selected: cn(
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          defaultClassNames.selected
        ),

        today: cn(
          "bg-accent text-accent-foreground",
          defaultClassNames.today
        ),

        outside: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.outside
        ),

        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),

        hidden: cn(
          "invisible",
          defaultClassNames.hidden
        ),

        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className="h-4 w-4" />;
          }

          if (orientation === "right") {
            return <ChevronRightIcon className="h-4 w-4" />;
          }

          return <ChevronDownIcon className="h-4 w-4" />;
        },

        DayButton: CalendarDayButton,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus();
    }
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "h-9 w-9 rounded-md p-0 text-sm font-normal",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring",
        defaultClassNames.day_button,
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };