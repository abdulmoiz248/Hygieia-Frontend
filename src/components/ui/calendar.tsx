"use client"
import * as React from "react"
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { type DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function CalendarComponent({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "rounded-2 bg-white group/calendar p-4  border border-cool-gray/20 shadow-sm [--cell-size:--spacing(10)] [[data-slot=card-content]_&]:bg-white [[data-slot=popover-content]_&]:bg-white",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("flex gap-6 flex-col md:flex-row relative", defaultClassNames.months),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn("flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between", defaultClassNames.nav),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-[--cell-size] aria-disabled:opacity-50 p-0 select-none hover:bg-mint-green/20 text-dark-slate-gray",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-[--cell-size] aria-disabled:opacity-50 p-0 select-none hover:bg-mint-green/20 text-dark-slate-gray",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex items-center justify-center h-[--cell-size] w-full px-[--cell-size] text-dark-slate-gray font-semibold",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-[--cell-size] gap-1.5 text-soft-coral",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "relative has-focus:border-soft-blue border border-cool-gray/30 shadow-xs has-focus:ring-soft-blue/30 has-focus:ring-[3px] rounded-md bg-snow-white",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          "absolute bg-snow-white inset-0 opacity-0 border border-cool-gray/20 rounded-md",
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          "select-none font-medium text-dark-slate-gray",
          captionLayout === "label"
            ? "text-sm"
            : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-cool-gray [&>svg]:size-3.5 hover:bg-mint-green/10",
          defaultClassNames.caption_label,
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-soft-coral  rounded-md flex-1 font-bold text-[0.8rem] select-none py-2",
          defaultClassNames.weekday,
        ),
        week: cn("flex w-full mt-1", defaultClassNames.week),
        week_number_header: cn("select-none w-[--cell-size] text-cool-gray", defaultClassNames.week_number_header),
        week_number: cn("text-[0.8rem] select-none text-cool-gray", defaultClassNames.week_number),
        day: cn(
          "relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          defaultClassNames.day,
        ),
        range_start: cn("rounded-l-md bg-soft-blue/20", defaultClassNames.range_start),
        range_middle: cn("rounded-none bg-soft-blue/10", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-soft-blue/20", defaultClassNames.range_end),
        today: cn(
          "bg-soft-coral/20 text-dark-slate-gray rounded-md data-[selected=true]:rounded-none font-semibold",
          defaultClassNames.today,
        ),
        outside: cn("text-cool-gray/60 aria-selected:text-cool-gray/60", defaultClassNames.outside),
        disabled: cn("text-cool-gray/40 opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className={cn("size-4 text-soft-coral", className)} {...props} />
          }
          if (orientation === "right") {
            return <ChevronRightIcon className={cn("size-4 text-soft-coral", className)} {...props} />
          }
          return <ChevronDownIcon className={cn("size-4 text-dark-slate-gray", className)} {...props} />
        },
        DayButton: ThemedCalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center text-cool-gray">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function ThemedCalendarDayButton({ className, day, modifiers, ...props }: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()
  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        // Base styles
        "flex aspect-square size-auto w-full min-w-[--cell-size] flex-col gap-1 leading-none font-normal text-dark-slate-gray",
        // Hover states
        "hover:bg-mint-green/20 hover:text-dark-slate-gray",
        // Selected single day
        "data-[selected-single=true]:bg-soft-blue data-[selected-single=true]:text-snow-white data-[selected-single=true]:font-semibold",
        // Range styles
        "data-[range-middle=true]:bg-soft-blue/15 data-[range-middle=true]:text-dark-slate-gray",
        "data-[range-start=true]:bg-soft-blue data-[range-start=true]:text-snow-white data-[range-start=true]:font-semibold",
        "data-[range-end=true]:bg-soft-blue data-[range-end=true]:text-snow-white data-[range-end=true]:font-semibold",
        // Focus styles
        "group-data-[focused=true]/day:border-soft-blue group-data-[focused=true]/day:ring-soft-blue/30",
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px]",
        // Border radius for ranges
        "data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md",
        "data-[range-middle=true]:rounded-none",
        "data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md",
        // Additional text styling
        "[&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  )
}

export { CalendarComponent, ThemedCalendarDayButton }
