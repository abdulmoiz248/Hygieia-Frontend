'use client'

import { useRef, useState } from "react"
import { motion, Variants } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Mail, Phone, Calendar } from "lucide-react"
import { Venus, Mars, Transgender } from "lucide-react"
import {LabTechnicianProfile} from "@/store/lab-tech/userStore"
import { NutritionistProfile } from "@/store/nutritionist/userStore"

type Props = {
  profile: LabTechnicianProfile | NutritionistProfile
  isEditing: boolean
  itemVariants?: Variants
  onAvatarChange?: (file: File) => void
}

const LabTechnicianCard = ({
  profile,
  isEditing,
  itemVariants,
  onAvatarChange,
}: Props) => {
  const [avatarSrc, setAvatarSrc] = useState(profile?.img)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file)
      setAvatarSrc(imageUrl)
      onAvatarChange?.(file)
    }
  }

  const renderGenderIcon = (gender: string) => {
    switch (gender) {
      case "male":
        return <Mars className="w-5 h-5 text-soft-blue" />
      case "female":
        return <Venus className="w-5 h-5 text-soft-coral" />
      case "other":
        return <Transgender className="w-5 h-5 text-purple-500" />
      default:
        return null
    }
  }

  return (
    <motion.div
      className="border border-dark-slate-gray/20 rounded-3xl p-6 bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
      variants={itemVariants}
    >
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0 text-center">
          <div className="relative inline-block mb-6 group">
            <div className="rounded-full border-[6px] border-soft-blue/20 shadow-xl overflow-hidden w-36 h-36 mx-auto bg-gradient-to-br from-soft-blue/10 to-soft-coral/10 backdrop-blur-sm transition-all duration-300 group-hover:scale-105">
              <Avatar className="w-full h-full">
                <AvatarImage src={avatarSrc} sizes="144px" />
                <AvatarFallback className="text-3xl font-medium text-dark-slate-gray/70">
                  {profile?.name?.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            {isEditing && (
              <>
                <Button
                  size="icon"
                  onClick={handleAvatarClick}
                  className="absolute bottom-2 right-2 bg-white text-dark-slate-gray ring-1 ring-dark-slate-gray hover:bg-soft-blue/90 rounded-full w-10 h-10 shadow-md"
                  variant="outline"
                >
                  <Camera className="w-4 h-4" />
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </>
            )}
          </div>

          <h2 className="text-2xl font-bold text-dark-slate-gray mb-1 break-words">
            {profile?.name}
          </h2>

          <div className="flex items-center justify-center gap-2 text-base text-cool-gray mb-5">
            {renderGenderIcon(profile?.gender)}
            <span className="capitalize">{profile?.gender}</span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-center gap-2 text-dark-slate-gray/70 break-words">
              <Mail className="w-4 h-4 text-soft-blue" />
              <span>{profile?.email}</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-dark-slate-gray/70 break-words">
              <Phone className="w-4 h-4 text-soft-blue" />
              <span>{profile?.phone}</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-dark-slate-gray/70 break-words">
              <Calendar className="w-4 h-4 text-soft-blue" />
              <span>
                Born{" "}
                {profile?.dateofbirth
                  ? new Date(profile?.dateofbirth).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default LabTechnicianCard
