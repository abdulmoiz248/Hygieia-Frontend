//@ts-nocheck
import { NutritionistProfile } from "@/store/nutritionist/userStore"
import { jsPDF } from "jspdf"

export const generateResume = (profile: NutritionistProfile) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  const colors = {
    primary: [23, 92, 104],      // Deep teal
    secondary: [88, 164, 176],   // Lighter teal
    accent: [232, 119, 34],      // Professional orange
    dark: [33, 37, 41],          // Near black
    mediumGray: [108, 117, 125], // Medium gray
    lightGray: [233, 236, 239],  // Light gray
    veryLight: [248, 249, 250],  // Very light gray
    white: [255, 255, 255],
    success: [40, 167, 69],      // Green for rating
  }

  const margin = 50
  const sidebarWidth = 200
  const contentX = margin + sidebarWidth + 40
  const contentWidth = pageWidth - contentX - margin

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  // Modern gradient-style header bar
  doc.setFillColor(...colors.primary)
  doc.rect(0, 0, pageWidth, 140, "F")
  
  // Accent stripe
  doc.setFillColor(...colors.accent)
  doc.rect(0, 135, pageWidth, 5, "F")

  // Sidebar background with subtle border
  doc.setFillColor(...colors.veryLight)
  doc.rect(0, 140, sidebarWidth + margin, pageHeight - 140, "F")
  doc.setDrawColor(...colors.lightGray)
  doc.setLineWidth(1)
  doc.line(sidebarWidth + margin, 140, sidebarWidth + margin, pageHeight)

  // Profile image with professional styling
  const imgCenterX = margin + sidebarWidth / 2
  const imgCenterY = 70
  const imgRadius = 45

  // White circle background for image
  doc.setFillColor(...colors.white)
  doc.circle(imgCenterX, imgCenterY, imgRadius + 3, "F")

  if (profile.img) {
    try {
      doc.saveGraphicsState()
      doc.setFillColor(...colors.white)
      doc.circle(imgCenterX, imgCenterY, imgRadius, "FD")
      doc.addImage(profile.img, "JPEG", imgCenterX - imgRadius, imgCenterY - imgRadius, imgRadius * 2, imgRadius * 2)
      doc.restoreGraphicsState()
    } catch {
      doc.setFillColor(...colors.secondary)
      doc.circle(imgCenterX, imgCenterY, imgRadius, "F")
      doc.setTextColor(...colors.white)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(32)
      doc.text(profile.name.charAt(0).toUpperCase(), imgCenterX, imgCenterY + 12, { align: "center" })
    }
  } else {
    doc.setFillColor(...colors.secondary)
    doc.circle(imgCenterX, imgCenterY, imgRadius, "F")
    doc.setTextColor(...colors.white)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(32)
    doc.text(profile.name.charAt(0).toUpperCase(), imgCenterX, imgCenterY + 12, { align: "center" })
  }

  // Border ring around image
  doc.setDrawColor(...colors.accent)
  doc.setLineWidth(2)
  doc.circle(imgCenterX, imgCenterY, imgRadius + 3, "S")

  let sideY = 170
  
  const addSidebarSection = (title: string, y: number) => {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    doc.setTextColor(...colors.primary)
    doc.text(title.toUpperCase(), margin + 10, y)
    
    // Underline with gradient effect
    doc.setDrawColor(...colors.secondary)
    doc.setLineWidth(2)
    doc.line(margin + 10, y + 4, margin + sidebarWidth - 10, y + 4)
    
    return y + 22
  }

  // Contact Information
  sideY = addSidebarSection("Contact", sideY)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor(...colors.mediumGray)

  const contactItems = [
    { icon: "✉", text: profile.email, y: sideY },
    { icon: "☎", text: profile.phone, y: sideY + 18 },
    { icon: "🎂", text: formatDate(profile.dateofbirth), y: sideY + 36 },
    { icon: "⚥", text: profile.gender, y: sideY + 54 }
  ]

  contactItems.forEach(item => {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.setTextColor(...colors.secondary)
    doc.text(item.icon, margin + 10, item.y)
    
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8.5)
    doc.setTextColor(...colors.mediumGray)
    const wrappedText = doc.splitTextToSize(item.text, sidebarWidth - 35)
    doc.text(wrappedText, margin + 26, item.y)
  })
  
  sideY += 82

  // Languages
  sideY = addSidebarSection("Languages", sideY)
  profile.languages.forEach((lang, idx) => {
    doc.setFillColor(...colors.secondary)
    doc.circle(margin + 14, sideY - 2, 2.5, "F")
    
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(...colors.mediumGray)
    doc.text(lang, margin + 24, sideY)
    sideY += 16
  })
  sideY += 10

  // Consultation Fee - Enhanced card style
  sideY = addSidebarSection("Fee", sideY)
  const feeBoxHeight = 55
  
  doc.setFillColor(...colors.white)
  doc.roundedRect(margin + 10, sideY - 10, sidebarWidth - 20, feeBoxHeight, 5, 5, "F")
  doc.setDrawColor(...colors.secondary)
  doc.setLineWidth(1.5)
  doc.roundedRect(margin + 10, sideY - 10, sidebarWidth - 20, feeBoxHeight, 5, 5, "S")
  
  doc.setFont("helvetica", "bold")
  doc.setFontSize(24)
  doc.setTextColor(...colors.primary)
  doc.text(`$${profile.consultationFee}`, margin + sidebarWidth / 2, sideY + 12, { align: "center" })
  
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(...colors.mediumGray)
  doc.text("Per Consultation", margin + sidebarWidth / 2, sideY + 28, { align: "center" })
  
  sideY += feeBoxHeight + 18

  // Rating - Professional style
  sideY = addSidebarSection("Rating", sideY)
  
  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.setTextColor(...colors.success)
  doc.text(`${profile.rating.toFixed(1)} / 5.0`, margin + sidebarWidth / 2, sideY + 8, { align: "center" })
  
  sideY += 24
  
  // Star rating
  const starY = sideY
  const startX = margin + (sidebarWidth - 70) / 2
  for (let i = 0; i < 5; i++) {
    if (i < Math.floor(profile.rating)) {
      doc.setFillColor(...colors.success)
    } else if (i < profile.rating) {
      doc.setFillColor(180, 220, 180)
    } else {
      doc.setFillColor(220, 220, 220)
    }
    doc.circle(startX + i * 14, starY, 4, "F")
  }

  // Main Content Header (in the colored header area)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(32)
  doc.setTextColor(...colors.white)
  doc.text(profile.name.toUpperCase(), contentX, 65)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(14)
  doc.setTextColor(240, 240, 240)
  doc.text(profile.specialization, contentX, 88)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(11)
  doc.setTextColor(220, 220, 220)
  doc.text(`${profile.experienceYears} Years of Professional Experience`, contentX, 108)

  // Main content sections
  let y = 175

  const addContentSection = (title: string, yPos: number) => {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(13)
    doc.setTextColor(...colors.primary)
    doc.text(title.toUpperCase(), contentX, yPos)
    
    doc.setDrawColor(...colors.accent)
    doc.setLineWidth(2.5)
    doc.line(contentX, yPos + 4, contentX + 80, yPos + 4)
    
    doc.setDrawColor(...colors.secondary)
    doc.setLineWidth(1)
    doc.line(contentX + 85, yPos + 4, contentX + contentWidth, yPos + 4)
    
    return yPos + 20
  }

  // Professional Summary
  y = addContentSection("Professional Summary", y)
  
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9.5)
  doc.setTextColor(...colors.mediumGray)
  doc.setLineHeightFactor(1.5)
  const bioLines = doc.splitTextToSize(profile.bio, contentWidth)
  doc.text(bioLines, contentX, y)
  y += bioLines.length * 14 + 22

  // Certifications
  y = addContentSection("Certifications", y)
  
  profile.certifications.forEach((cert, idx) => {
    doc.setFillColor(...colors.accent)
    doc.circle(contentX + 4, y - 2, 3, "F")
    
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9.5)
    doc.setTextColor(...colors.mediumGray)
    const certLines = doc.splitTextToSize(cert, contentWidth - 20)
    doc.text(certLines, contentX + 15, y)
    y += certLines.length * 14 + 8
  })
  y += 14

  // Education
  y = addContentSection("Education", y)
  
  profile.education.forEach((edu, idx) => {
    doc.setFillColor(...colors.accent)
    doc.circle(contentX + 4, y - 2, 3, "F")
    
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9.5)
    doc.setTextColor(...colors.mediumGray)
    const eduLines = doc.splitTextToSize(edu, contentWidth - 20)
    doc.text(eduLines, contentX + 15, y)
    y += eduLines.length * 14 + 8
  })
  y += 14

  // Availability Schedule
  y = addContentSection("Availability", y)
  
  profile.workingHours.forEach((schedule, idx) => {
    const bg = idx % 2 === 0 ? colors.white : colors.veryLight
    
    doc.setFillColor(...bg)
    doc.roundedRect(contentX, y - 12, contentWidth, 26, 4, 4, "F")
    
    doc.setDrawColor(...colors.lightGray)
    doc.setLineWidth(0.5)
    doc.roundedRect(contentX, y - 12, contentWidth, 26, 4, 4, "S")
    
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9.5)
    doc.setTextColor(...colors.primary)
    doc.text(schedule.day, contentX + 12, y + 2)
    
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(...colors.mediumGray)
    doc.text(`${schedule.start} - ${schedule.end}`, contentX + 120, y + 2)
    
    y += 28
  })

  // Professional Footer
  doc.setDrawColor(...colors.lightGray)
  doc.setLineWidth(0.5)
  doc.line(margin, pageHeight - 35, pageWidth - margin, pageHeight - 35)
  
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7.5)
  doc.setTextColor(...colors.mediumGray)
  doc.text("Generated by Hygieia Professional Healthcare Platform", pageWidth / 2, pageHeight - 20, {
    align: "center",
  })

  const fileName = `${profile.name.replace(/\s+/g, "_")}_Professional_Resume.pdf`
  doc.save(fileName)
}