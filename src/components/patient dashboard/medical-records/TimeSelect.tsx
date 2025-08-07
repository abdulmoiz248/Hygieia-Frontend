'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const times = [
  { label: '8:00 AM', value: '08:00' },
  { label: '9:00 AM', value: '09:00' },
  { label: '10:00 AM', value: '10:00' },
  { label: '11:00 AM', value: '11:00' },
  { label: '12:00 PM', value: '12:00' },
  { label: '2:00 PM', value: '14:00' },
  { label: '3:00 PM', value: '15:00' },
  { label: '4:00 PM', value: '16:00' },
]

export default function TimeSelect({ selectedTime, setSelectedTime }:{selectedTime:string,setSelectedTime:(str:string )=>void}) {
  return (
    <Select value={selectedTime} onValueChange={setSelectedTime}>
      <SelectTrigger className="w-full bg-snow-white border border-gray-300 focus:ring-2 focus:ring-soft-blue rounded-md">
        <SelectValue placeholder="Select time" />
      </SelectTrigger>
      <SelectContent className="bg-snow-white">
        {times.map((time) => (
          <SelectItem
            key={time.value}
            value={time.value}
            className="hover:bg-mint-green hover:text-snow-white cursor-pointer"
          >
            {time.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
