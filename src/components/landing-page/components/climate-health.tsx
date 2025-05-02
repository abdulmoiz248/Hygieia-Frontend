"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cloud, CloudRain, Sun, Thermometer, Snowflake, Wind, AlertTriangle, Droplets, Umbrella } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const weatherIcons = {
  Clear: <Sun className="w-10 h-10" />,
  Clouds: <Cloud className="w-10 h-10" />,
  Rain: <CloudRain className="w-10 h-10" />,
  Snow: <Snowflake className="w-10 h-10" />,
  Thunderstorm: <AlertTriangle className="w-10 h-10" />,
  Drizzle: <Droplets className="w-10 h-10" />,
  Mist: <Wind className="w-10 h-10" />,
  Fog: <Wind className="w-10 h-10" />,
  Haze: <Wind className="w-10 h-10" />,
  Dust: <Wind className="w-10 h-10" />,
  Smoke: <Wind className="w-10 h-10" />,
  default: <Thermometer className="w-10 h-10" />,
}

const weatherAdvice = {
  Clear: {
    general: "Perfect day for outdoor exercise! Don't forget sunscreen.",
    health: "UV exposure is high - protect your skin with SPF 30+ and wear sunglasses to prevent eye damage.",
    activity: "Great day for vitamin D production - spend 15-20 minutes in morning sun for natural vitamin boost.",
  },
  Clouds: {
    general: "Great day for a walk! Moderate UV exposure.",
    health: "Diffused sunlight reduces eye strain while still providing vitamin D benefits.",
    activity: "Ideal conditions for outdoor activities without overheating.",
  },
  Rain: {
    general: "Stay Dry! Book a Teleconsult instead of visiting in person.",
    health: "Damp conditions can aggravate joint pain and respiratory issues.",
    activity: "Focus on indoor exercises like yoga or strength training today.",
  },
  Snow: {
    general: "Be careful of icy conditions! Keep warm to prevent illness.",
    health: "Cold exposure increases risk of hypothermia and frostbite.",
    activity: "Ensure proper layering before any outdoor activity.",
  },
  Thunderstorm: {
    general: "Stay indoors! Reschedule non-urgent appointments.",
    health: "Barometric pressure changes may trigger migraines or joint pain.",
    activity: "Practice stress-reduction techniques if storm anxiety occurs.",
  },
  Drizzle: {
    general: "Light rain - bring an umbrella for appointments.",
    health: "Slightly increased risk of slipping - wear appropriate footwear.",
    activity: "Light indoor cardio recommended today.",
  },
  Mist: {
    general: "Reduced visibility - take care when traveling.",
    health: "High humidity can affect those with respiratory conditions.",
    activity: "Good day for gentle stretching and breathing exercises.",
  },
  Fog: {
    general: "Drive carefully! Consider rescheduling if visibility is poor.",
    health: "Fog can trap pollutants - those with asthma should take precautions.",
    activity: "Focus on indoor mind-body exercises like tai chi.",
  },
  Haze: {
    general: "Air quality may be affected. Consider a mask if sensitive.",
    health: "Increased risk of respiratory irritation - stay hydrated.",
    activity: "Limit strenuous outdoor exercise duration.",
  },
  Dust: {
    general: "Cover nose and mouth when outside to protect your lungs.",
    health: "Dust particles can trigger allergies and asthma.",
    activity: "Indoor air-filtered environments recommended for exercise.",
  },
  Smoke: {
    general: "Air quality alert! Stay indoors if you have respiratory issues.",
    health: "Smoke inhalation can cause both short and long-term health problems.",
    activity: "Postpone outdoor activities until air quality improves.",
  },
  default: {
    general: "Monitor your health and stay hydrated!",
    health: "Maintain regular health routines regardless of weather.",
    activity: "Adapt your activities to your current health status.",
  },
}

const bodyFacts = [
  {
    part: "Brain",
    fact: "Learning New Skills Creates New Neural Pathways",
    position: { top: "10%", left: "50%" },
    details:
      "Your brain forms approximately 700 new neural connections every second. Mental exercises like puzzles, learning new languages, or playing instruments can increase brain plasticity at any age.",
    healthTip: "Try to learn something new for 30 minutes daily to maintain cognitive health.",
  },
  {
    part: "Heart",
    fact: "Regular Exercise Can Lower Heart Disease Risk by 50%",
    position: { top: "25%", left: "50%" },
    details:
      "Your heart beats about 100,000 times per day, pumping 2,000 gallons of blood. Just 30 minutes of moderate exercise 5 times a week can dramatically improve heart health.",
    healthTip: "Incorporate heart-healthy foods like fatty fish, nuts, and berries into your diet.",
  },
  {
    part: "Lungs",
    fact: "Deep Breathing Can Reduce Stress Hormones",
    position: { top: "30%", left: "50%" },
    details:
      "Your lungs contain about 600 million alveoli, creating a surface area roughly the size of a tennis court. Proper breathing techniques can activate your parasympathetic nervous system.",
    healthTip: "Practice the 4-7-8 breathing technique: inhale for 4 seconds, hold for 7, exhale for 8.",
  },
  {
    part: "Liver",
    fact: "80% of Liver Diseases Are Preventable!",
    position: { top: "40%", left: "40%" },
    details:
      "Your liver performs over 500 vital functions and can regenerate itself even when up to 75% is damaged. It filters 1.4 liters of blood every minute.",
    healthTip: "Limit alcohol consumption and maintain a balanced diet to support liver health.",
  },
  {
    part: "Stomach",
    fact: "Gut Health Affects Your Mood and Immune System",
    position: { top: "45%", left: "50%" },
    details:
      "Your gut contains over 100 trillion bacteria and produces about 95% of your body's serotonin, the 'happiness hormone'. The gut-brain connection influences mental health significantly.",
    healthTip: "Include fermented foods like yogurt, kefir, and sauerkraut to support gut microbiome diversity.",
  },
]

interface WeatherData {
  main: {
    temp: number
    humidity: number
    pressure: number
    feels_like: number
  }
  weather: {
    main: string
    description: string
    icon: string
  }[]
  name: string
  wind: {
    speed: number
  }
  sys: {
    country: string
  }
}

export default function ClimateHealth() {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null)
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null)
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
      setLocationPermission(false)
      return
    }

    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocationPermission(true)
        try {
          const { latitude, longitude } = position.coords

          const apiKey = process.env.WEATHER_API_KEY || "fd11e81de35b7639af57673fd7b7b71c";

          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`,
          )
          const data = await response.json()

          setWeatherData(data)
        } catch (err) {
          setError("Failed to fetch weather data")
          console.error(err)
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        setLocationPermission(false)
        setError("Location permission denied")
        setLoading(false)
        console.error(err)
      },
    )
  }, [])

  // Get weather type and icon
  const weatherType = weatherData?.weather?.[0]?.main || "default"
  const weatherIcon = weatherIcons[weatherType as keyof typeof weatherIcons] || weatherIcons.default
  const advice = weatherAdvice[weatherType as keyof typeof weatherAdvice] || weatherAdvice.default

  const getWeatherColor = (weatherType: string): string => {
    switch (weatherType) {
      case "Clear":
        return "soft-blue" // Using your theme color
      case "Clouds":
        return "cool-gray"
      case "Rain":
      case "Drizzle":
        return "soft-blue"
      case "Snow":
        return "mint-green"
      case "Thunderstorm":
        return "soft-coral"
      default:
        return "soft-coral"
    }
  }

  const weatherColor = getWeatherColor(weatherType)


  const handleBodyPartClick = (part: string) => {
    if (selectedBodyPart === part) {
      setSelectedBodyPart(null)
    } else {
      setSelectedBodyPart(part)
    }
  }

  const selectedPartData = bodyFacts.find((item) => item.part === selectedBodyPart)




 
  return (
    <section className="py-20 px-4 md:px-10 bg-gradient-to-b from-snow-white to-mint-green">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark-slate-gray mb-4">Climate & Health Connection</h2>
          <p className="text-lg text-cool-gray max-w-3xl mx-auto">
            Discover how environmental factors affect your health and get personalized recommendations
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Weather Banner */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2"
          >
            <Card className="overflow-hidden border-0 shadow-lg">
              {locationPermission === false ? (
                <div className="p-8 bg-snow-white/50">
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-soft-coral mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-dark-slate-gray mb-2">Location Access Required</h3>
                    <p className="text-cool-gray mb-4">
                      Please enable location access to get personalized weather-based health recommendations.
                    </p>
                    <Button
                      onClick={() => window.location.reload()}
                      className="bg-soft-blue hover:bg-soft-blue/90 text-snow-white"
                    >
                      Enable Location Access
                    </Button>
                  </div>
                </div>
              ) : loading ? (
                <div className="p-8 bg-snow-white/50 flex items-center justify-center" style={{ minHeight: "300px" }}>
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-soft-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-cool-gray">Fetching weather data...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="p-8 bg-snow-white/50">
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-soft-coral mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-dark-slate-gray mb-2">Couldn&apos;t Load Weather Data</h3>
                    <p className="text-cool-gray">{error}</p>
                  </div>
                </div>
              ) : weatherData ? (
                <div className="p-8 relative overflow-hidden bg-snow-white">
                  {/* Weather Header */}
                  <div className="flex items-center mb-6">
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center mr-4 bg-${weatherColor}/20 text-${weatherColor}`}
                    >
                      {weatherIcon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-dark-slate-gray">
                        {weatherData.weather[0].main} • {Math.round(weatherData.main.temp)}°C
                      </h3>
                      <p className="text-cool-gray">
                        {weatherData.name}, {weatherData.sys.country} • Feels like{" "}
                        {Math.round(weatherData.main.feels_like)}°C
                      </p>
                    </div>
                  </div>

                  {/* Weather Details */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-snow-white/80 p-3 rounded-lg text-center shadow-sm border border-cool-gray/10">
                      <Droplets className="w-5 h-5 mx-auto mb-1 text-soft-blue" />
                      <div className="text-sm text-cool-gray">Humidity</div>
                      <div className="font-semibold text-dark-slate-gray">{weatherData.main.humidity}%</div>
                    </div>
                    <div className="bg-snow-white/80 p-3 rounded-lg text-center shadow-sm border border-cool-gray/10">
                      <Wind className="w-5 h-5 mx-auto mb-1 text-mint-green" />
                      <div className="text-sm text-cool-gray">Wind</div>
                      <div className="font-semibold text-dark-slate-gray">{weatherData.wind.speed} m/s</div>
                    </div>
                    <div className="bg-snow-white/80 p-3 rounded-lg text-center shadow-sm border border-cool-gray/10">
                      <Umbrella className="w-5 h-5 mx-auto mb-1 text-soft-coral" />
                      <div className="text-sm text-cool-gray">Pressure</div>
                      <div className="font-semibold text-dark-slate-gray">{weatherData.main.pressure} hPa</div>
                    </div>
                  </div>

                  {/* Health Recommendations */}
                  <div className="bg-snow-white p-6 rounded-xl shadow-sm mb-6 border border-cool-gray/10">
                    <h4 className="text-xl font-bold text-dark-slate-gray mb-4">Health Recommendations</h4>

                    <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid grid-cols-3 mb-4 bg-cool-gray/10">
                        <TabsTrigger
                          value="general"
                          className="data-[state=active]:bg-soft-blue data-[state=active]:text-snow-white"
                        >
                          General
                        </TabsTrigger>
                        <TabsTrigger
                          value="health"
                          className="data-[state=active]:bg-soft-blue data-[state=active]:text-snow-white"
                        >
                          Health
                        </TabsTrigger>
                        <TabsTrigger
                          value="activity"
                          className="data-[state=active]:bg-soft-blue data-[state=active]:text-snow-white"
                        >
                          Activity
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="general" className="space-y-4">
                        <div className="flex items-start">
                          <div className={`text-3xl mr-3 text-${weatherColor}`}>{weatherIcon}</div>
                          <p className="text-cool-gray">{advice.general}</p>
                        </div>
                      </TabsContent>
                      <TabsContent value="health" className="space-y-4">
                        <div className="flex items-start">
                          <div className={`text-3xl mr-3 text-${weatherColor}`}>
                            <Thermometer className="w-8 h-8" />
                          </div>
                          <p className="text-cool-gray">{advice.health}</p>
                        </div>
                      </TabsContent>
                      <TabsContent value="activity" className="space-y-4">
                        <div className="flex items-start">
                          <div className={`text-3xl mr-3 text-${weatherColor}`}>
                            <Sun className="w-8 h-8" />
                          </div>
                          <p className="text-cool-gray">{advice.activity}</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Weather Impact Gauge */}
                
                 
                </div>
              ) : null}
            </Card>
          </motion.div>

          {/* Body Reveal Facts */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2"
          >
            <Card className="overflow-hidden border-0 shadow-lg h-full">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-dark-slate-gray mb-6">Explore Your Body</h3>

                <div className="relative h-[400px] bg-snow-white/50 rounded-xl overflow-hidden border border-cool-gray/10">
                  {/* Body outline */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="200" height="350" viewBox="0 0 200 350" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Simple body outline */}
                      <path
                        d="M100 20 C130 20 150 40 150 70 C150 100 130 130 130 160 C130 190 150 220 150 250 C150 280 130 310 100 330 C70 310 50 280 50 250 C50 220 70 190 70 160 C70 130 50 100 50 70 C50 40 70 20 100 20"
                        stroke="oklch(0.55 0.15 210)" // soft-blue
                        strokeWidth="2"
                        fill="oklch(0.55 0.15 210 / 0.1)" // soft-blue with opacity
                      />

                      {/* Interactive body parts */}
                      {bodyFacts.map((item, index) => (
                        <motion.circle
                          key={index}
                          cx={
                            item.part === "Brain"
                              ? 100
                              : item.part === "Heart"
                                ? 100
                                : item.part === "Lungs"
                                  ? 100
                                  : item.part === "Liver"
                                    ? 80
                                    : 100
                          }
                          cy={
                            item.part === "Brain"
                              ? 40
                              : item.part === "Heart"
                                ? 90
                                : item.part === "Lungs"
                                  ? 110
                                  : item.part === "Liver"
                                    ? 140
                                    : 180
                          }
                          r="15"
                          fill={
                            selectedBodyPart === item.part
                              ? "oklch(0.72 0.11 178)" // mint-green
                              : hoveredPart === item.part
                                ? "oklch(0.72 0.11 178 / 0.8)" // mint-green with opacity
                                : "oklch(0.72 0.11 178 / 0.4)" // mint-green with more opacity
                          }
                          stroke={
                            selectedBodyPart === item.part || hoveredPart === item.part
                              ? "oklch(0.72 0.11 178)" // mint-green
                              : "none"
                          }
                          strokeWidth="2"
                          onMouseEnter={() => setHoveredPart(item.part)}
                          onMouseLeave={() => setHoveredPart(null)}
                          onClick={() => handleBodyPartClick(item.part)}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          style={{ cursor: "pointer" }}
                        />
                      ))}
                    </svg>
                  </div>

                  {/* Hover tooltips */}
                  {hoveredPart && hoveredPart !== selectedBodyPart && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className="absolute bg-snow-white p-3 rounded-lg shadow-md max-w-xs z-10"
                      style={{
                        top:
                          hoveredPart === "Brain"
                            ? "15%"
                            : hoveredPart === "Heart"
                              ? "35%"
                              : hoveredPart === "Lungs"
                                ? "45%"
                                : hoveredPart === "Liver"
                                  ? "55%"
                                  : "70%",
                        left: hoveredPart === "Liver" ? "30%" : "50%",
                        transform: "translateX(-50%)",
                      }}
                    >
                      <h4 className="font-bold text-dark-slate-gray mb-1">{hoveredPart}</h4>
                      <p className="text-xs text-cool-gray">
                        {bodyFacts.find((item) => item.part === hoveredPart)?.fact}
                      </p>
                      <p className="text-xs text-mint-green mt-1">Click to learn more</p>
                    </motion.div>
                  )}

                  {/* Instructions */}
                  {!hoveredPart && !selectedBodyPart && (
                    <div className="absolute bottom-4 left-0 right-0 text-center text-cool-gray text-sm">
                      Hover over body parts to reveal health facts
                    </div>
                  )}
                </div>

                {/* Detailed body part information */}
                <AnimatePresence>
                  {selectedPartData && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 overflow-hidden"
                    >
                      <Card className="p-6 border border-mint-green/30 bg-mint-green/5">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-mint-green/20 flex items-center justify-center mr-3">
                            <div className="text-mint-green font-bold">{selectedPartData.part.charAt(0)}</div>
                          </div>
                          <h4 className="text-xl font-bold text-dark-slate-gray">{selectedPartData.part}</h4>
                        </div>

                        <p className="text-cool-gray mb-4">{selectedPartData.details}</p>

                        <div className="bg-snow-white p-4 rounded-lg border border-cool-gray/10">
                          <h5 className="font-semibold text-dark-slate-gray mb-2">Health Tip</h5>
                          <p className="text-cool-gray">{selectedPartData.healthTip}</p>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <Button
                            onClick={() => setSelectedBodyPart(null)}
                            variant="outline"
                            className="text-mint-green border-mint-green"
                          >
                            Close
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
