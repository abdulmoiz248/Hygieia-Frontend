'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calculator } from 'lucide-react'

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/patient/store"
import { updateProfile as ProfileUpdate } from "@/types/patient/profileSlice"

const getBMICategory = (bmi: number, gender: string) => {
  if (gender === 'female') {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-yellow-500' }
    if (bmi < 24) return { category: 'Normal weight', color: 'text-green-500' }
    if (bmi < 29) return { category: 'Overweight', color: 'text-orange-500' }
    return { category: 'Obese', color: 'text-red-500' }
  } else {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-yellow-500' }
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-500' }
    if (bmi < 30) return { category: 'Overweight', color: 'text-orange-500' }
    return { category: 'Obese', color: 'text-red-500' }
  }
}

export default function HealthDataModal({
  showDialog,
  setShowDialog,
}: {
  showDialog: boolean
  setShowDialog: (value: boolean) => void
}) {
  const dispatch = useDispatch()
  const user =useSelector((state: RootState) => state.profile)

  const [weight, setWeight] = useState<number>(user.weight || 0)
  const [height, setHeight] = useState<number>(user.height || 0)
  const [originalWeight, setOriginalWeight] = useState<number>(user.weight || 0)
  const [originalHeight, setOriginalHeight] = useState<number>(user.height || 0)
  const gender = user.gender || 'male'

  const [bmi, setBmi] = useState<number>(0)

  useEffect(() => {
    if (weight && height) {
      const hMeters = height / 100
      const calculatedBmi = weight / (hMeters * hMeters)
      setBmi(Number(calculatedBmi.toFixed(1)))
    } else {
      setBmi(0)
    }
  }, [weight, height])

  const isModified = weight !== originalWeight || height !== originalHeight

  const handleSave = () => {
    setOriginalWeight(weight)
    setOriginalHeight(height)
    setShowDialog(false)
      dispatch(ProfileUpdate({height,weight}))
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-mint-green hover:text-snow-white hover:bg-mint-green">
          <Calculator className="w-4 h-4 mr-2" />
          Health Info
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-snow-white">
        <DialogHeader>
          <DialogTitle className="text-soft-coral">Update Health Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-soft-blue">Weight (kg)</label>
              <Input
                type="number"
                placeholder="70"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-soft-blue">Height (cm)</label>
              <Input
                type="number"
                placeholder="175"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-soft-blue font-bold">BMI</span>
              <span className="font-semibold text-soft-coral">{bmi || '--'}</span>
            </div>
            {bmi > 0 && (
              <div className="text-center font-medium mt-2">
                <span className={getBMICategory(bmi, gender).color}>
                  {getBMICategory(bmi, gender).category}
                </span>
              </div>
            )}
          </div>
          {isModified && (
            <div className="flex justify-end">
              <Button className="bg-soft-blue text-snow-white hover:bg-soft-blue/90" onClick={handleSave}>
                Update
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
