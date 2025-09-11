"use client"
import { useEffect, useState } from "react"
import { motion, Variants } from "framer-motion"
import { User,  Save, Edit,  } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import useLabTechnicianStore from "@/store/lab-tech/userStore"
import {LabTechnicianProfile} from "@/store/lab-tech/userStore"
import LabTechnicianCard from "@/components/lab-tech/profile/profile"
import { useLabStore } from "@/store/lab-tech/labTech"
import { uploadUserAvatar } from "@/helpers/UploadProfilePic"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants:Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}



export default function ProfilePage() {

  const reduxProfile=useLabTechnicianStore().profile
  const saveProfile=useLabTechnicianStore().setProfile
  const updateField=useLabTechnicianStore().updateProfileField
   const setactiveTab = useLabStore((state) => state.setActiveTab)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<LabTechnicianProfile>(reduxProfile!)

  useEffect(() => {
  setProfile(reduxProfile!)
  setactiveTab('')
}, [reduxProfile])

  const handleSave = () => {
    setIsEditing(false)
    saveProfile(profile)
    
  }






  
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 p-6 bg-snow-white">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-soft-coral">Profile</h1>
          <p className="text-cool-gray">Manage your personal and medical information</p>
        </div>

        <Button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={isEditing ? "bg-mint-green hover:bg-mint-green/90" : "bg-soft-blue hover:bg-soft-blue/90"}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        {/* Profile Picture & Basic Info */}
<LabTechnicianCard
  profile={profile}
  isEditing={isEditing}
  itemVariants={itemVariants}
  onAvatarChange={(file) =>
    uploadUserAvatar<LabTechnicianProfile>(
      file,
      "lab-technician",
      profile.id,
      updateField
    )
  }
/>




        {/* Personal Information */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="py-15">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-soft-blue" />
                Personal Information
              </CardTitle>
            </CardHeader>
           <CardContent className="space-y-4 px-4 md:px-6 py-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="flex flex-col">
      <Label className="pb-1 text-soft-blue" htmlFor="name">Full Name</Label>
      <Input
        id="name"
        value={profile.name}
        onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
        disabled={!isEditing}
      />
    </div>
    <div className="flex flex-col">
      <Label className="pb-1 text-soft-blue" htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        value={profile.email}
        onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
        disabled={!isEditing}
      />
    </div>
     <div>
              <label className="text-sm font-medium text-soft-blue">Gender</label>
           <Select value={profile.gender}  disabled={!isEditing}  onValueChange={(value) => setProfile((prev) => ({ ...prev, gender: value }))}>
  <SelectTrigger>
    <SelectValue placeholder="Select gender" />
  </SelectTrigger>
  <SelectContent className='bg-snow-white'>
    <SelectItem className='hover:bg-mint-green hover:text-snow-white' value="male">Male</SelectItem>
    <SelectItem className='hover:bg-mint-green hover:text-snow-white' value="female">Female</SelectItem>
    <SelectItem className='hover:bg-mint-green hover:text-snow-white' value="other">Other</SelectItem>
  </SelectContent>
</Select>

            </div>
    <div className="flex flex-col">
      <Label className="pb-1 text-soft-blue" htmlFor="phone">Phone Number</Label>
      <Input
        id="phone"
        value={profile.phone}
        onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
        disabled={!isEditing}
      />
    </div>
    <div className="flex flex-col">
      <Label className="pb-1 text-soft-blue" htmlFor="dob">Date of Birth</Label>
    <Input
  id="dob"
  type="date"
  value={profile.dateofbirth ? new Date(profile.dateofbirth).toISOString().split('T')[0] : ''}
  onChange={(e) => setProfile((prev) => ({ ...prev, dateofbirth: new Date(e.target.value) }))}
  disabled={!isEditing}
/>

    </div>
  </div>

</CardContent>

          </Card>
        </motion.div>
      </div>



    </motion.div>
  )
}
