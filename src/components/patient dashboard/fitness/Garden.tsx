"use client"

import {  useEffect, useState } from "react"
import { motion } from "framer-motion"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Progress } from "@/components/ui/progress"

import React from 'react'



import { useSelector } from "react-redux";
import type { RootState } from "@/store/patient/store";

export default function Garden() {
      const user = useSelector((state: RootState) => state.profile);
 
      const healthScore=user.healthscore

       
  const getTreeHealth = (score: number) => {
    if (score === 0) return { emoji: "🪴", status: "Just Starting", color: "text-gray-500" }
    if (score >= 80) return { emoji: "🌳", status: "Thriving", color: "text-mint-green" }
    if (score >= 60) return { emoji: "🌲", status: "Growing", color: "text-yellow-600" }
    if (score >= 40) return { emoji: "🌱", status: "Sprouting", color: "text-orange-500" }
    if (score >= 20) return { emoji: "🌿", status: "Budding", color: "text-blue-500" }
    return { emoji: "🥀", status: "Needs Care", color: "text-soft-coral" }
  }

  const getMotivationalMessage = (score: number) => {
    if (score === 0) return "Start your health journey today! Every small step counts."
    if (score < 20) return "Don't give up! Small consistent actions lead to big changes."
    if (score < 40) return "You're making progress! Keep building those healthy habits."
    if (score < 60) return "Great momentum! You're on the right track."
    if (score < 80) return "Excellent progress! You're almost at your peak health."
    return "Outstanding! You're a health champion!"
  }

  const treeHealth = getTreeHealth(healthScore)
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}


  return (
  <>
   <motion.div variants={itemVariants}>
           <Card className="bg-gradient-to-br from-mint-green/10 to-soft-blue/10">
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <span className="text-2xl">🌿</span>
                 Your Health Garden
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-center space-y-4">
                 <div className="text-8xl">{treeHealth.emoji}</div>
                 <div>
                   <h3 className={`text-2xl font-bold ${treeHealth.color}`}>{treeHealth.status}</h3>
                   <p className="text-cool-gray">Health Score: {healthScore}/100</p>
                 </div>
                 <Progress value={healthScore} className="w-full max-w-md mx-auto h-3" />
                 <p className="text-sm text-cool-gray max-w-md mx-auto">{getMotivationalMessage(healthScore)}</p>
                 {healthScore === 0 && (
                   <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg max-w-md mx-auto">
                     <p className="text-sm text-blue-800 font-medium">🌱 Ready to start your health journey?</p>
                     <p className="text-xs text-blue-600 mt-1">
                       Log your first activity, track your meals, or set a fitness goal to begin growing your health tree!
                     </p>
                   </div>
                 )}
               </div>
             </CardContent>
           </Card>
         </motion.div>
  </>
        
  )
}
