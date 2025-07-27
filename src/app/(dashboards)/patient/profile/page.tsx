"use client"

import { useState } from "react"
import { motion, Variants } from "framer-motion"
import { User,  Save, Edit,  Heart, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


import { getUser } from "@/lib/data"
import PatientProfileCard from "@/components/patient dashboard/profile/Profile"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants:Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}



export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(getUser())

  const handleSave = () => {
    setIsEditing(false)
    // Save logic here
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
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
  <PatientProfileCard  profile={profile} isEditing={isEditing} itemVariants={itemVariants}  
  onAvatarChange={(file) => {
    console.log("Selected avatar file:", file)
    // upload to server or update profile
  }} />


        {/* Personal Information */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
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
           <Select value={profile.gender.toLowerCase()}  disabled={!isEditing}  onValueChange={(value) => setProfile((prev) => ({ ...prev, gender: value }))}>
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
        value={profile.dateOfBirth}
        onChange={(e) => setProfile((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
        disabled={!isEditing}
      />
    </div>
  </div>

  <div className="flex flex-col">
    <Label className="pb-1 text-soft-blue" htmlFor="address">Address</Label>
    <Textarea
      id="address"
      value={profile.address}
      onChange={(e) => setProfile((prev) => ({ ...prev, address: e.target.value }))}
      disabled={!isEditing}
      rows={2}
    />
  </div>

  <div className="flex flex-col">
    <Label className="pb-1  text-soft-blue" htmlFor="emergency">Emergency Contact</Label>
    <Input
      id="emergency"
      value={profile.emergencyContact}
      onChange={(e) => setProfile((prev) => ({ ...prev, emergencyContact: e.target.value }))}
      disabled={!isEditing}
      placeholder="Name - Phone Number"
    />
  </div>
</CardContent>

          </Card>
        </motion.div>
      </div>

      {/* Medical Information */}
     <motion.div variants={itemVariants}>
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-dark-slate-gray">
        <Heart className="w-5 h-5 text-soft-coral" />
        Medical Information
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="bloodType" className=" text-soft-coral">Blood Type</Label>
         
              <Select
                value={profile.bloodType}
                onValueChange={(value) => setProfile((prev) => ({ ...prev, bloodType: value }))}
                  disabled={!isEditing}
              >
                <SelectTrigger className="text-soft-coral border-dark-slate-gray">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-snow-white">
                  <SelectItem  className="hover:bg-mint-green hover:text-snow-white" value="A+">A+</SelectItem>
                  <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="A-">A-</SelectItem>
                  <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="B+">B+</SelectItem>
                  <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="B-">B-</SelectItem>
                  <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="AB+">AB+</SelectItem>
                  <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="AB-">AB-</SelectItem>
                  <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="O+">O+</SelectItem>
                  <SelectItem  className="hover:bg-mint-green hover:text-snow-white"value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
          
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="allergies" className=" text-soft-coral">Allergies</Label>
            <Textarea
              id="allergies"
              value={profile.allergies}
              onChange={(e) => setProfile((prev) => ({ ...prev, allergies: e.target.value }))}
              disabled={!isEditing}
              placeholder="List any known allergies..."
              rows={3}
            />
            {profile.allergies && !isEditing && (
              <div className="flex items-center gap-2 mt-1">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-600">Allergy Alert</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="conditions" className=" text-soft-coral">Medical Conditions</Label>
            <Textarea
              id="conditions"
              value={profile.conditions}
              onChange={(e) => setProfile((prev) => ({ ...prev, conditions: e.target.value }))}
              disabled={!isEditing}
              placeholder="List any medical conditions..."
              rows={3}
            />
          </div>

         
        </div>
      </div>

      {!isEditing && (
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-medium text-yellow-800">Important Medical Information</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Keep your medical information up to date. This information is crucial for healthcare providers in case
                of emergencies.
              </p>
            </div>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
</motion.div>

    </motion.div>
  )
}
