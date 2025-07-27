'use client'

import { useRef, useState } from "react"
import { motion, Variants } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Mail, Phone, Calendar } from "lucide-react"
import { Venus, Mars,  Transgender } from "lucide-react"


type PatientProfile = {
  name: string
  email: string
  phone: string
  avatar: string
  dateOfBirth?: string
  gender:string
}

type Props = {
  profile: PatientProfile
  isEditing: boolean
  itemVariants?: Variants
  onAvatarChange?: (file: File) => void
}

const PatientProfileCard = ({
  profile,
  isEditing,
  itemVariants,
  onAvatarChange,
}: Props) => {
  const [avatarSrc, setAvatarSrc] = useState(profile.avatar)
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
  switch (gender.toLowerCase()) {
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
      className="border rounded-2xl border-dark-slate-gray/30 p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
      variants={itemVariants}
    >
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0 text-center">
          <div className="relative inline-block mb-6">
            <Avatar className="w-36 h-36  shadow-md overflow-hidden">
              <AvatarImage src={avatarSrc} sizes="144px" />
              <AvatarFallback className="text-3xl tracking-wide">
                {profile.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            {isEditing && (
              <>
                <Button
                  size="icon"
                  onClick={handleAvatarClick}
                  className="absolute bottom-2 right-2 bg-transparent text-dark-slate-gray  ring-dark-slate-gray hover:bg-soft-blue/90 rounded-full w-10 h-10"
                  variant="outline"
                >
                  <Camera className="w-4 h-4 " />
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

          <h2 className="text-2xl font-semibold text-soft-coral mb-1 break-words">
            {profile.name}
          </h2>
        <div className="flex items-center justify-center gap-2 text-sm text-cool-gray mb-4">
  {renderGenderIcon(profile.gender)}
  <span className="capitalize">{profile.gender}</span>
</div>


          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-center gap-2 text-cool-gray break-words">
              <Mail className="w-4 h-4 text-soft-blue" />
              <span>{profile.email}</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-cool-gray break-words">
              <Phone className="w-4 h-4 text-soft-blue" />
              <span>{profile.phone}</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-cool-gray break-words">
              <Calendar className="w-4 h-4 text-soft-blue" />
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
  )
}

export default PatientProfileCard
