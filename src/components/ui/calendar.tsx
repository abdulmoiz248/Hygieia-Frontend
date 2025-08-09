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
        "rounded-3xl bg-white backdrop-blur-xl p-4 sm:p-6 border border-gray-200 shadow-xl transition-all duration-300",
        "hover:shadow-2xl",
        "w-full max-w-full mx-auto",
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-full", defaultClassNames.root),
        months: cn(
          "grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 relative",
          defaultClassNames.months
        ),
        month: cn("flex flex-col w-full gap-4 sm:gap-5", defaultClassNames.month),
        nav: cn("flex items-center gap-2 w-full absolute top-0 inset-x-0 justify-between", defaultClassNames.nav),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-9 w-9 sm:h-10 sm:w-10 p-0 select-none rounded-xl bg-white/80 backdrop-blur-md shadow-md hover:scale-105 hover:bg-rose-100 hover:shadow-lg text-gray-700 transition-all duration-200 border border-gray-200/50",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-9 w-9 sm:h-10 sm:w-10 p-0 select-none rounded-xl bg-white/80 backdrop-blur-md shadow-md hover:scale-105 hover:bg-rose-100 hover:shadow-lg text-gray-700 transition-all duration-200 border border-gray-200/50",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex items-center justify-center h-8 sm:h-10 w-full px-6 sm:px-10 text-gray-800 font-bold text-base sm:text-lg tracking-wide mb-2",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "w-full flex items-center text-xs sm:text-sm font-semibold justify-center h-8 sm:h-10 gap-2 text-rose-500",
          defaultClassNames.dropdowns,
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex mb-1 sm:mb-2", defaultClassNames.weekdays),
        weekday: cn(
          "text-rose-500 flex-1 font-bold text-[10px] sm:text-xs select-none py-1 sm:py-2 text-center uppercase tracking-wider",
          defaultClassNames.weekday,
        ),
        week: cn("flex w-full gap-0", defaultClassNames.week),
        day: cn("group/day relative flex-1 aspect-square select-none p-0.5", defaultClassNames.day),
        today: cn(
          "bg-gradient-to-br from-rose-100 to-blue-100 text-gray-800 font-bold rounded-2xl shadow-md ",
          defaultClassNames.today,
        ),
        outside: cn("text-gray-400/60", defaultClassNames.outside),
        disabled: cn("text-gray-300 opacity-40", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className={cn("size-4 sm:size-5 text-rose-500", className)} {...props} />
          }
          if (orientation === "right") {
            return <ChevronRightIcon className={cn("size-4 sm:size-5 text-rose-500", className)} {...props} />
          }
          return <ChevronDownIcon className={cn("size-4 sm:size-5 text-gray-700", className)} {...props} />
        },
        DayButton: ThemedCalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-8 sm:size-10 items-center justify-center text-center text-gray-500 font-medium rounded-lg hover:bg-gray-100 transition-colors">
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
      className={cn(
        "h-8 w-8 sm:h-10 sm:w-10 p-0 flex items-center justify-center font-medium text-gray-700 rounded-xl transition-all duration-200 relative overflow-hidden",
        "hover:scale-105 hover:shadow-md hover:bg-gradient-to-br hover:from-emerald-50 hover:to-blue-50 hover:text-gray-800",
        "data-[selected-single=true]:bg-gradient-to-br data-[selected-single=true]:from-rose-400 data-[selected-single=true]:to-pink-500 data-[selected-single=true]:text-white data-[selected-single=true]:font-bold data-[selected-single=true]:shadow-lg data-[selected-single=true]:scale-105",
        "data-[range-middle=true]:bg-blue-100 data-[range-start=true]:bg-blue-500 data-[range-start=true]:text-white data-[range-end=true]:bg-blue-500 data-[range-end=true]:text-white",
        "group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-blue-300",
        modifiers.outside && "text-gray-400",
        modifiers.today && "bg-gradient-to-br from-rose-100 to-blue-100 font-bold ring-2 ring-rose-400 ring-offset-2 ring-offset-white",
        defaultClassNames.day,
        className,
      )}
      {...props}
    >
      <span className="text-xs sm:text-sm font-medium">{day.date.getDate()}</span>
      {modifiers.appointment && (
        <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-rose-400 shadow-sm" />
      )}
    </Button>
  )
}

export { CalendarComponent, ThemedCalendarDayButton }
