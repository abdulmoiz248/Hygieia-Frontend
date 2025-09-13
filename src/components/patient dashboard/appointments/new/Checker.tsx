import { Checkbox } from "@/components/ui/checkbox"

type ShareDataCheckboxProps = {
  checked: boolean
  onChange: (value: boolean) => void
}

export default function ShareDataCheckbox({ checked, onChange }: ShareDataCheckboxProps) {
  return (
    <div className="flex items-center gap-2 py-2">
      <Checkbox
        id="share"
        checked={checked}
        onCheckedChange={(val) => onChange(!!val)}
        className="w-4 h-4 border-gray-400 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
      />
      <label
        htmlFor="share"
        className="text-sm text-gray-700 cursor-pointer select-none hover:text-soft-blue transition-colors"
      >
        Share data with doctor
      </label>
    </div>
  )
}
