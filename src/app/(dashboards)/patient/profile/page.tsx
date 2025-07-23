"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Camera, Save, Edit, Phone, Mail, Calendar, Heart, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getUser } from "@/lib/data"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
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
     <motion.div className="border-1 rounded border-dark-slate-gray p-5 bg-white" variants={itemVariants}>
  <Card className="border-0 shadow-none">
    <CardContent className="p-6 text-center">
      <div className="relative inline-block mb-4">
        <Avatar className="w-32 h-32">
          <AvatarImage src={profile.avatar} sizes="128px" />
          <AvatarFallback className="text-2xl">
            {profile.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        {isEditing && (
          <Button
            size="icon"
            className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0"
            variant="outline"
          >
            <Camera className="w-4 h-4" />
          </Button>
        )}
      </div>

      <h2 className="text-xl font-semibold text-dark-slate-gray mb-1 break-words">{profile.name}</h2>
      <p className="text-cool-gray mb-4 text-sm">Patient ID: #12345</p>

      <div className="space-y-2 text-sm">
       <div className="inline-flex items-center gap-2 text-cool-gray break-words">
  <Mail className="w-4 h-4" />
  <span>{profile.email}</span>
</div>

        <div className="flex items-center justify-center gap-2 text-cool-gray">
          <Phone className="w-4 h-4" />
          <span>{profile.phone}</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-cool-gray">
          <Calendar className="w-4 h-4" />
          <span>
            Born{" "}
            {profile.dateOfBirth
              ? new Date(profile.dateOfBirth).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
</motion.div>


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
      <Label className="pb-1" htmlFor="name">Full Name</Label>
      <Input
        id="name"
        value={profile.name}
        onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
        disabled={!isEditing}
      />
    </div>
    <div className="flex flex-col">
      <Label className="pb-1" htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        value={profile.email}
        onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
        disabled={!isEditing}
      />
    </div>
    <div className="flex flex-col">
      <Label className="pb-1" htmlFor="phone">Phone Number</Label>
      <Input
        id="phone"
        value={profile.phone}
        onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
        disabled={!isEditing}
      />
    </div>
    <div className="flex flex-col">
      <Label className="pb-1" htmlFor="dob">Date of Birth</Label>
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
    <Label className="pb-1" htmlFor="address">Address</Label>
    <Textarea
      id="address"
      value={profile.address}
      onChange={(e) => setProfile((prev) => ({ ...prev, address: e.target.value }))}
      disabled={!isEditing}
      rows={2}
    />
  </div>

  <div className="flex flex-col">
    <Label className="pb-1" htmlFor="emergency">Emergency Contact</Label>
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
      <CardTitle className="flex items-center gap-2 text-soft-coral">
        <Heart className="w-5 h-5 text-soft-coral" />
        Medical Information
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="bloodType" className="">Blood Type</Label>
            {isEditing ? (
              <Select
                value={profile.bloodType}
                onValueChange={(value) => setProfile((prev) => ({ ...prev, bloodType: value }))}
              >
                <SelectTrigger className="text-soft-coral">
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
            ) : (
              <div className="flex items-center gap-2">
                <Badge className="bg-soft-coral text-white">{profile.bloodType}</Badge>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="allergies">Allergies</Label>
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
            <Label htmlFor="conditions">Medical Conditions</Label>
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
