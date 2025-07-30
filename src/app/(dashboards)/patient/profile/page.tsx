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
    {/* Column 1 */}
    <div className="flex flex-col gap-4">
      {/* Blood Type */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="bloodType" className="text-soft-coral">Blood Type</Label>
        <Select
          value={profile.bloodType}
          onValueChange={(value) => setProfile((prev) => ({ ...prev, bloodType: value }))}
          disabled={!isEditing}
        >
          <SelectTrigger className="text-soft-coral border-dark-slate-gray">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-snow-white">
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
              <SelectItem key={type} value={type} className="hover:bg-mint-green hover:text-snow-white">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Allergies */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="allergies" className="text-soft-coral">Allergies</Label>
        <Textarea
          id="allergies"
          value={profile.allergies}
          onChange={(e) => setProfile((prev) => ({ ...prev, allergies: e.target.value }))}
          disabled={!isEditing}
          placeholder="Food, medicine, environment, etc."
          rows={3}
        />
      </div>

      {/* Vaccines */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="vaccines" className="text-soft-coral">Vaccinations</Label>
        <Textarea
          id="vaccines"
          value={profile.vaccines}
          onChange={(e) => setProfile((prev) => ({ ...prev, vaccines: e.target.value }))}
          disabled={!isEditing}
          placeholder="e.g. COVID-19, Hepatitis, Tetanus, Flu"
          rows={2}
        />
      </div>

      {/* Ongoing Medications */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="ongoingMedications" className="text-soft-coral">Current Medications</Label>
        <Textarea
          id="ongoingMedications"
          value={profile.ongoingMedications}
          onChange={(e) => setProfile((prev) => ({ ...prev, ongoingMedications: e.target.value }))}
          disabled={!isEditing}
          placeholder="Daily meds, supplements, treatment courses"
          rows={2}
        />
      </div>

      {/* Lifestyle */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="lifestyle" className="text-soft-coral">Lifestyle Habits</Label>
        <Textarea
          id="lifestyle"
          value={profile.lifestyle}
          onChange={(e) => setProfile((prev) => ({ ...prev, lifestyle: e.target.value }))}
          disabled={!isEditing}
          placeholder="Smoking, alcohol, diet, physical activity"
          rows={2}
        />
      </div>

      {/* Disabilities / Aids */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="disabilities" className="text-soft-coral">Disabilities / Mobility Aids</Label>
        <Textarea
          id="disabilities"
          value={profile.disabilities}
          onChange={(e) => setProfile((prev) => ({ ...prev, disabilities: e.target.value }))}
          disabled={!isEditing}
          placeholder="e.g. wheelchair, hearing aid, visual impairment"
          rows={2}
        />
      </div>
    </div>

    {/* Column 2 */}
    <div className="flex flex-col gap-4">
      {/* Conditions */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="conditions" className="text-soft-coral">Medical Conditions</Label>
        <Textarea
          id="conditions"
          value={profile.conditions}
          onChange={(e) => setProfile((prev) => ({ ...prev, conditions: e.target.value }))}
          disabled={!isEditing}
          placeholder="Diabetes, asthma, heart disease, etc."
          rows={3}
        />
      </div>

      {/* Mental Health */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="mentalHealth" className="text-soft-coral">Mental Health</Label>
        <Textarea
          id="mentalHealth"
          value={profile.mentalHealth}
          onChange={(e) => setProfile((prev) => ({ ...prev, mentalHealth: e.target.value }))}
          disabled={!isEditing}
          placeholder="e.g. Anxiety, depression, therapy, etc."
          rows={2}
        />
      </div>

      {/* Surgery History */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="surgeryHistory" className="text-soft-coral">Surgical History</Label>
        <Textarea
          id="surgeryHistory"
          value={profile.surgeryHistory}
          onChange={(e) => setProfile((prev) => ({ ...prev, surgeryHistory: e.target.value }))}
          disabled={!isEditing}
          placeholder="List any major past surgeries"
          rows={2}
        />
      </div>

      {/* Implants / Devices */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="implants" className="text-soft-coral">Implants / Devices</Label>
        <Textarea
          id="implants"
          value={profile.implants}
          onChange={(e) => setProfile((prev) => ({ ...prev, implants: e.target.value }))}
          disabled={!isEditing}
          placeholder="Pacemaker, stents, contraceptive implants, etc."
          rows={2}
        />
      </div>

      {/* Family History */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="familyHistory" className="text-soft-coral">Family Medical History</Label>
        <Textarea
          id="familyHistory"
          value={profile.familyHistory}
          onChange={(e) => setProfile((prev) => ({ ...prev, familyHistory: e.target.value }))}
          disabled={!isEditing}
          placeholder="e.g. cancer, heart disease, mental illness"
          rows={2}
        />
      </div>

      {/* Organ Donor / DNR */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="organDonor" className="text-soft-coral">Organ Donor / DNR</Label>
        <Textarea
          id="organDonor"
          value={profile.organDonor}
          onChange={(e) => setProfile((prev) => ({ ...prev, organDonor: e.target.value }))}
          disabled={!isEditing}
          placeholder="e.g. Yes - donor, No - DNR preferences, etc."
          rows={2}
        />
      </div>

      {/* Female-specific fields */}
      {profile.gender?.toLowerCase() === "female" && (
        <>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pregnancyStatus" className="text-soft-coral">Are you currently pregnant?</Label>
            <Select
              value={profile.pregnancyStatus}
              onValueChange={(value) => setProfile((prev) => ({ ...prev, pregnancyStatus: value }))}
              disabled={!isEditing}
            >
              <SelectTrigger className="text-soft-coral border-dark-slate-gray">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="bg-snow-white">
                <SelectItem value="yes" className="hover:bg-mint-green hover:text-snow-white">Yes</SelectItem>
                <SelectItem value="no" className="hover:bg-mint-green hover:text-snow-white">No</SelectItem>
                <SelectItem value="preferNotToSay" className="hover:bg-mint-green hover:text-snow-white">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="menstrualCycle" className="text-soft-coral">Menstrual / Reproductive Health</Label>
            <Textarea
              id="menstrualCycle"
              value={profile.menstrualCycle}
              onChange={(e) => setProfile((prev) => ({ ...prev, menstrualCycle: e.target.value }))}
              disabled={!isEditing}
              placeholder="e.g. PCOS, irregular periods, contraceptives"
              rows={2}
            />
          </div>
        </>
      )}
    </div>
  </div>

  {!isEditing && (
    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-medium text-yellow-800">Keep This Info Updated</h4>
          <p className="text-sm text-yellow-700 mt-1">
            Medical history, medications, mental health and allergies are vital in emergencies and for personalized treatment.
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
