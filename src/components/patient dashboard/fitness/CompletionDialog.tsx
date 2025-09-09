"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { WorkoutRoutine } from "@/types/patient/workoutSlice"


type Props = {
  open: boolean
  onClose: () => void
  routine: WorkoutRoutine | null
}

export default function CompletionDialog({ open, onClose, routine }: Props) {
 
  

    // useEffect(()=>{
    //   dispatch(addCalories({ 
    //     type:'burned', 
    //     amount: routine?.totalCalories || 0, 
    //     carbs: 0, 
    //     protein: 0, 
    //     fat: 0
    //   }))

    // },[routine]) 

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-snow-white text-center py-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-mint-green">
            Workout Completed 🎉
          </DialogTitle>
        </DialogHeader>
        {routine && (
          <div className="space-y-4">
            <p className="text-lg text-soft-blue">
              You finished <span className="font-semibold">{routine.name}</span>
            </p>
            <p className="text-cool-gray">
              Burned <span className="font-bold">{routine.totalCalories}</span> calories in{" "}
              <span className="font-bold">{routine.totalDuration}</span> minutes 🚀
            </p>
            <Button className="bg-soft-blue text-white" onClick={onClose}>
              Awesome!
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
