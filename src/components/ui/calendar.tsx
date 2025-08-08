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
        "rounded-3xl bg-white/40 backdrop-blur-xl p-6 border border-white/50 shadow-2xl transition-all duration-300",
        "hover:shadow-[0_0_25px_rgba(0,0,0,0.15)]",
        "max-w-[380px]",
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("flex gap-8 flex-col md:flex-row relative", defaultClassNames.months),
        month: cn("flex flex-col w-full gap-5", defaultClassNames.month),
        nav: cn("flex items-center gap-2 w-full absolute top-0 inset-x-0 justify-between", defaultClassNames.nav),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-[--cell-size] p-0 select-none rounded-xl bg-white/50 backdrop-blur-md shadow hover:scale-105 hover:bg-gradient-to-br hover:from-soft-blue hover:to-soft-coral text-dark-slate-gray transition-all duration-200",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-[--cell-size] p-0 select-none rounded-xl bg-white/50 backdrop-blur-md shadow hover:scale-105 hover:bg-gradient-to-br hover:from-soft-blue hover:to-soft-coral text-dark-slate-gray transition-all duration-200",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-[--cell-size] w-full px-[--cell-size] text-dark-slate-gray font-extrabold text-xl tracking-wide",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-semibold justify-center h-[--cell-size] gap-2 text-soft-coral",
          defaultClassNames.dropdowns
        ),
        table: "w-full border-collapse space-y-1",
        weekdays: cn("flex mb-2", defaultClassNames.weekdays),
        weekday: cn(
          "text-soft-coral rounded-xl flex-1 font-bold text-sm select-none py-3 text-center uppercase tracking-wider",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2 gap-1", defaultClassNames.week),
        day: cn("group/day relative aspect-square select-none", defaultClassNames.day),
        today: cn(
          "bg-gradient-to-br from-soft-coral/40 to-soft-blue/40 text-dark-slate-gray font-bold rounded-2xl shadow-lg ring-2 ring-soft-coral/40",
          defaultClassNames.today
        ),
        outside: cn("text-cool-gray/50", defaultClassNames.outside),
        disabled: cn("text-cool-gray/30 opacity-40", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className={cn("size-5 text-soft-coral", className)} {...props} />
          }
          if (orientation === "right") {
            return <ChevronRightIcon className={cn("size-5 text-soft-coral", className)} {...props} />
          }
          return <ChevronDownIcon className={cn("size-5 text-dark-slate-gray", className)} {...props} />
        },
        DayButton: ThemedCalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center text-cool-gray font-medium rounded-lg hover:bg-cool-gray/10 transition-colors">
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
        "flex aspect-square w-full min-w-[--cell-size] items-center justify-center font-medium text-dark-slate-gray rounded-2xl transition-all duration-200 relative overflow-hidden",
        "bg-white/50 backdrop-blur-md hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-mint-green/40 hover:to-soft-blue/40",
        "data-[selected-single=true]:bg-gradient-to-br data-[selected-single=true]:from-soft-blue data-[selected-single=true]:to-soft-coral data-[selected-single=true]:text-white data-[selected-single=true]:font-bold",
        "data-[range-middle=true]:bg-soft-blue/20 data-[range-start=true]:bg-soft-blue data-[range-end=true]:bg-soft-blue",
        "group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-soft-blue/40",
        defaultClassNames.day,
        className
      )}
      {...props}
    >
      {day.date.getDate()}
      {modifiers.appointment && (
        <span className="absolute bottom-1 w-2 h-2 rounded-full bg-soft-coral shadow-md" />
      )}
    </Button>
  )
}

export { CalendarComponent, ThemedCalendarDayButton }