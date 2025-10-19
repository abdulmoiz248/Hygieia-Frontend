"use client"
import Suggestions from '@/components/patient dashboard/profile/Suggestions'
import { useEffect, useState } from "react"
import { motion, Variants } from "framer-motion"
import { User,  Save, Edit,  Heart, AlertTriangle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import useNutritionistStore, { NutritionistProfile } from '@/store/nutritionist/userStore'
import WorkingHours from '@/components/nutritionist/profile/WorkingHours'
import LabTechnicianCard from '@/components/lab-tech/profile/profile'
import { uploadUserAvatar } from '@/helpers/UploadProfilePic'
import { generateBio } from '@/components/nutritionist/profile/GenerateBio'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants:Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function ProfilePage() {
  const {profile:reduxProfile, updateProfileField}=useNutritionistStore()
  const saveProfile=useNutritionistStore().setProfile
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<NutritionistProfile>(reduxProfile!)
  const [isSaving, setIsSaving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    setProfile(reduxProfile!)
  }, [reduxProfile])






  const handleSave = async () => {
    setIsSaving(true)
    try {
      setIsEditing(false)
      saveProfile(profile)
    } finally {
      setIsSaving(false)
    }
  }

  const handleGenerate=async()=>{
    setIsGenerating(true)
    try {
      const bio=await generateBio(profile)
      setProfile((prev) => ({ ...prev, bio: bio }))
    } finally {
      setIsGenerating(false)
    }
  }
  
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-soft-coral">Profile</h1>
          <p className="text-cool-gray">Manage your personal and medical information</p>
        </div>

   {/* <Button
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
        onClick={() => generateResume(profile)}
      >
        Download Resume
      </Button> */}
        <Button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={isEditing ? "bg-mint-green hover:bg-mint-green/90" : "bg-soft-blue hover:bg-soft-blue/90"}
          disabled={isSaving}
        >
          {isEditing ? (
            <>
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
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
        <LabTechnicianCard  profile={profile} isEditing={isEditing} itemVariants={itemVariants}
        onAvatarChange={(file) =>
    uploadUserAvatar<NutritionistProfile>(
      file,
      "nutritionist",
      profile.id,
      updateProfileField
    )
  }      />
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
                    value={profile?.name ?? ""}
                    onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex flex-col">
                  <Label className="pb-1 text-soft-blue" htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email}
                    onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-soft-blue">Gender</label>
                  <Select value={profile?.gender} disabled={!isEditing} onValueChange={(value) => setProfile((prev) => ({ ...prev, gender: value }))}>
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
                    value={profile?.phone}
                    onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex flex-col">
                  <Label className="pb-1 text-soft-blue" htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date" 
                    value={profile?.dateofbirth ? new Date(profile?.dateofbirth).toISOString().split('T')[0] : ''}
                    onChange={(e) => setProfile((prev) => ({ ...prev, dateofbirth: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Nutritionist Information */}
      <motion.div variants={itemVariants}>
        <WorkingHours
          value={profile?.workingHours}
          onChange={(newHours) => setProfile((prev) => ({ ...prev, workingHours: newHours }))}
          disabled={!isEditing}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-dark-slate-gray">
              <Heart className="w-5 h-5 text-soft-coral" />
              Nutritionist Information
            </CardTitle>
          </CardHeader>
        <CardContent>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
    {/* Column 1 */}
    <div className="flex flex-col gap-4">
      {/* Bio */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="bio" className="text-soft-coral">Bio</Label>
        <Textarea
          id="bio"
          value={profile?.bio}
          onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
          disabled={!isEditing}
          placeholder="Write a short professional bio..."
          rows={3}
        />
        {isEditing && (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="mt-2 px-3 py-1 bg-soft-coral text-white rounded-lg text-sm hover:bg-opacity-90 transition flex items-center justify-center gap-2"
          >
            {isGenerating && <Loader2 className="w-4 h-4 animate-spin" />}
            {isGenerating ? "Generating..." : "Generate with AI"}
          </button>
        )}
      </div>
      {/* Specialization */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="specialization" className="text-soft-coral">Specialization</Label>
        <Input
          id="specialization"
          value={profile?.specialization}
          onChange={(e) => setProfile((prev) => ({ ...prev, specialization: e.target.value }))}
          disabled={!isEditing}
          placeholder="e.g. Sports Nutrition, Weight Management"
        />
      </div>
      {/* Experience */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="experienceYears" className="text-soft-coral">Years of Experience</Label>
        <Input
          id="experienceYears"
          type="number"
          value={profile?.experienceYears}
          onChange={(e) => setProfile((prev) => ({ ...prev, experienceYears: Number(e.target.value) }))}
          disabled={!isEditing}
          placeholder="e.g. 5"
        />
      </div>
      {/* Certifications */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="certifications" className="text-soft-coral">Certifications</Label>
        <Textarea
          id="certifications"
          value={profile?.certifications?.join(", ")}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, certifications: e.target.value.split(",").map((s) => s.trim()) }))
          }
          disabled={!isEditing}
          placeholder="e.g. Certified Dietitian, Sports Nutritionist"
          rows={2}
        />
        {isEditing && (
          <Suggestions
            items={["Certified Dietitian", "Sports Nutritionist", "Clinical Nutrition"]}
            onSelect={(item) =>
              setProfile((prev) => ({
                ...prev,
                certifications: prev.certifications?.includes(item)
                  ? prev.certifications
                  : [...(prev.certifications ?? []), item],
              }))
            }
          />
        )}
      </div>
    </div>

    {/* Column 2 */}
    <div className="flex flex-col gap-4">
      {/* Languages */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="languages" className="text-soft-coral">Languages</Label>
        <Textarea
          id="languages"
          value={profile?.languages?.join(", ")}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, languages: e.target.value.split(",").map((s) => s.trim()) }))
          }
          disabled={!isEditing}
          placeholder="e.g. English, Urdu, Arabic"
          rows={2}
        />
        {isEditing && (
          <Suggestions
            items={["English", "Urdu", "Arabic", "Spanish"]}
            onSelect={(item) =>
              setProfile((prev) => ({
                ...prev,
                languages: prev.languages?.includes(item)
                  ? prev.languages
                  : [...(prev.languages ?? []), item],
              }))
            }
          />
        )}
      </div>
      {/* Education */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="education" className="text-soft-coral">Education</Label>
        <Textarea
          id="education"
          value={profile?.education?.join(", ")}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, education: e.target.value.split(",").map((s) => s.trim()) }))
          }
          disabled={!isEditing}
          placeholder="e.g. BSc Nutrition, MSc Dietetics"
          rows={2}
        />
        {isEditing && (
          <Suggestions
            items={["BSc Nutrition", "MSc Dietetics", "Public Health"]}
            onSelect={(item) =>
              setProfile((prev) => ({
                ...prev,
                education: prev.education?.includes(item)
                  ? prev.education
                  : [...(prev.education ?? []), item],
              }))
            }
          />
        )}
      </div>
      {/* Consultation Fee */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="consultationFee" className="text-soft-coral">Consultation Fee</Label>
        <Input
          id="consultationFee"
          type="number"
          value={profile?.consultationFee}
          onChange={(e) => setProfile((prev) => ({ ...prev, consultationFee: Number(e.target.value) }))}
          disabled={!isEditing}
          placeholder="Enter fee in PKR"
        />
      </div>
    </div>
  </div>

  {!isEditing && (
    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-medium text-yellow-800">Keep This Info Updated</h4>
          <p className="text-sm text-yellow-700 mt-1">
            Your specialization, certifications, and availability help clients choose the right nutritionist for their needs.
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
