"use client"
import { useMemo, useRef, useState, useEffect, useCallback } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from "@/components/ui/command"
import { X, Check, ChevronsUpDown } from "lucide-react" // Added Check and ChevronsUpDown for visual feedback
import { cn } from "@/lib/utils" // For conditional class names
import { Doctor } from "@/types"
import { NutritionistProfile } from "@/store/nutritionist/userStore"


type DoctorSelectorProps = {
  doctors: Doctor[] | NutritionistProfile[]
  value: string // The currently selected doctor's name (or typed value)
  onChange: (value: string) => void // Callback to update the parent state
  placeholder?: string
}

export default function DoctorSelector({
  doctors,
  value,
  onChange,
  placeholder = "Type or select a doctor",
}: DoctorSelectorProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value) // Internal state for CommandInput
  const inputRef = useRef<HTMLInputElement>(null) // Ref for the CommandInput element

  // Filter doctors based on inputValue
  const filteredDoctors = useMemo(() => {
    const trimmed = inputValue.trim().toLowerCase()
    if (trimmed === "") return doctors // Show all doctors if input is empty

    return doctors.filter(
      (doc) => doc.name.toLowerCase().includes(trimmed) || doc.specialization.toLowerCase().includes(trimmed),
    )
  }, [inputValue, doctors])

  // Update internal inputValue when external value prop changes
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Handle selection of a doctor from the list
  const handleSelect = useCallback(
    (doctorName: string) => {
      onChange(doctorName) // Update parent state
      setInputValue(doctorName) // Update internal input state
      setOpen(false) // Close the popover
      // Focus the input after selection to allow immediate further interaction
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    },
    [onChange],
  )

  // Handle clearing the input
  const handleClear = useCallback(() => {
    onChange("") // Clear parent state
    setInputValue("") // Clear internal input state
    setOpen(false) // Close popover
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }, [onChange])

  return (
    <div className="space-y-2">
      <label htmlFor="doctor-combobox" className="text-sm text-soft-blue  font-medium">
        Select  Doctor
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {/* The button acts as the visual trigger and displays the current value */}
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-controls="doctor-suggestions"
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {doctors.find((d) => d.id === value)?.name || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-snow-white" align="start">
          <Command>
            {/* CommandInput handles the actual typing and filtering */}
            <CommandInput
              ref={inputRef} // Attach ref to CommandInput
              placeholder={placeholder}
              value={doctors.find((d) => d.id === inputValue)?.name } // Bind to internal inputValue
              onValueChange={(currentValue) => {
                setInputValue(currentValue) // Update internal state
                onChange(currentValue) // Also update parent state as user types
                setOpen(true) // Keep popover open while typing
              }}
              id="doctor-combobox" // Link to label
              aria-label="Search for a doctor"
            />
            <CommandList id="doctor-suggestions">
              {/* Show all doctors if input is empty, otherwise show filtered */}
              {filteredDoctors.length === 0 && inputValue.trim() !== "" ? (
                <CommandEmpty className="py-2 px-4 text-sm text-soft-coral">No doctor found.</CommandEmpty>
              ) : (
                filteredDoctors.map((doctor) => (
                  <CommandItem
                    key={doctor.id}
                    value={doctor.name} // Value for CommandItem search
                    onSelect={() => handleSelect(doctor.id)}
                    className="cursor-pointer hover:bg-mint-green hover:text-snow-white"
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === doctor.name ? "opacity-100" : "opacity-0")} />
                    <div className="flex flex-col w-full">
                      <span className="font-medium text-sm truncate">{doctor.name}</span>
                      <span className="text-xs text-muted-foreground truncate">{doctor.specialization}</span>
                    </div>
                  </CommandItem>
                ))
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-[calc(2rem+1px)] -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear selected doctor"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
