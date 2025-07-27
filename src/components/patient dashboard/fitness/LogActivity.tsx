import {

  Plus,
 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function LogActivity({showLogActivity,setShowLogActivity}:{showLogActivity:boolean,setShowLogActivity:(str:boolean)=>void}) {
  return (
         <Dialog open={showLogActivity} onOpenChange={setShowLogActivity}>
            <DialogTrigger asChild>
              <Button className="bg-mint-green hover:bg-mint-green/90 text-snow-white">
                <Plus className="w-4 h-4 mr-2" />
                Log Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-snow-white">
              <DialogHeader className="text-soft-coral font-bold">
                <DialogTitle className="text-soft-coral text-bold ">Log New Activity</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-soft-blue">Activity Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity" />
                    </SelectTrigger>
                    <SelectContent className="bg-snow-white">
                      <SelectItem className="hover:bg-mint-green hover:text-snow-white"  value="walking">Walking</SelectItem>
                      <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="running">Running</SelectItem>
                      <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="cycling">Cycling</SelectItem>
                      <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="swimming">Swimming</SelectItem>
                      <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="gym">Gym Workout</SelectItem>
                      <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="yoga">Yoga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-soft-blue">Duration (minutes)</label>
                  <Input type="number" placeholder="30" min={0}  required/>
                </div>
                <div>
                  <label className="text-sm font-medium text-soft-blue">Intensity</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select intensity" />
                    </SelectTrigger>
                    <SelectContent className="bg-snow-white">
                      <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="low">Low</SelectItem>
                      <SelectItem className="hover:bg-mint-green hover:text-snow-white"value="moderate">Moderate</SelectItem>
                      <SelectItem className="hover:bg-mint-green hover:text-snow-white"value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full bg-soft-blue text-snow-white hover:bg-soft-blue/90">Log Activity</Button>
              </div>
            </DialogContent>
          </Dialog>

        
        
      
  )
}
