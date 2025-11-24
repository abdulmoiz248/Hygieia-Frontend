
"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, AlertCircle, FileText, TestTube, Home, Building2, Map, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { bookLabTest, fetchLabTests } from "@/types/patient/labTestsSlice"
import { CalendarComponent } from "@/components/ui/calendar"
import TimeSelect from "@/components/patient dashboard/medical-records/TimeSelect"
import { patientSuccess } from "@/toasts/PatientToast"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function BookLabTestPage() {
  const params = useParams()
  const router = useRouter()
  const testId = Array.isArray(params.id) ? params.id[0] : params.id || ""
  
  const dispatch = useAppDispatch()
  const profile = useAppSelector((state) => state.profile)
  const { availableTests } = useAppSelector((state) => state.labTests)
  
  const test = availableTests.find((t) => t.id === testId)

  useEffect(() => {
    if (!availableTests || availableTests.length === 0) {
      dispatch(fetchLabTests())
    }
  }, [dispatch, availableTests])

  const [selectedDate, setSelectedDate] = useState<Date>(new Date(Date.now() + 86400 * 1000))
  const [selectedTime, setSelectedTime] = useState("")
  const [locationType, setLocationType] = useState<"home" | "branch">("branch")
  const [location, setLocation] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("")
  const [manualAddress, setManualAddress] = useState("")
  const [showMapModal, setShowMapModal] = useState(false)
  const [mapAddress, setMapAddress] = useState("")
  const [locationError, setLocationError] = useState("")
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [notes, setNotes] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Available branches
  const branches = [
    "Main Lab - Floor 2, Medical Center",
    "Downtown Branch - Street 15, Block A",
    "North Branch - Plaza Center, 3rd Floor",
    "South Branch - Healthcare Complex, Wing B",
  ]

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    setSelectedDate(normalizedDate)
  }

  // Update location string based on type
  useEffect(() => {
    if (locationType === "home") {
      if (manualAddress) {
        setLocation(`Home Sampling - ${manualAddress}`)
      } else if (mapAddress) {
        setLocation(`Home Sampling - ${mapAddress}`)
      } else {
        setLocation("")
      }
    } else {
      setLocation(selectedBranch)
    }
  }, [locationType, selectedBranch, manualAddress, mapAddress])

  // Load Keyless Google Maps Script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (typeof window !== "undefined" && !window.google) {
        const script = document.createElement("script")
        script.src = "https://cdn.jsdelivr.net/gh/somanchiu/Keyless-Google-Maps-API@v7.1/mapsJavaScriptAPI.js"
        script.async = true
        script.defer = true
        document.head.appendChild(script)
      }
    }
    loadGoogleMaps()
  }, [])

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      // Use Nominatim (OpenStreetMap) for reverse geocoding - free alternative
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`,
        {
          headers: {
            'User-Agent': 'Hygieia-Frontend'
          }
        }
      )
      const data = await response.json()
      
      if (data.address) {
        // Build a detailed address from components
        const addressParts = []
        
        // House number and road
        if (data.address.house_number) addressParts.push(data.address.house_number)
        if (data.address.road) addressParts.push(data.address.road)
        
        // Neighborhood/suburb
        if (data.address.neighbourhood) addressParts.push(data.address.neighbourhood)
        else if (data.address.suburb) addressParts.push(data.address.suburb)
        
        // City/town
        if (data.address.city) addressParts.push(data.address.city)
        else if (data.address.town) addressParts.push(data.address.town)
        else if (data.address.village) addressParts.push(data.address.village)
        
        // State/province
        if (data.address.state) addressParts.push(data.address.state)
        
        // Postal code
        if (data.address.postcode) addressParts.push(data.address.postcode)
        
        // Country
        if (data.address.country) addressParts.push(data.address.country)
        
        // If we have specific address parts, use them; otherwise fall back to display_name
        if (addressParts.length > 0) {
          return addressParts.join(', ')
        } else if (data.display_name) {
          return data.display_name
        }
      } else if (data.display_name) {
        return data.display_name
      }
      
      return `Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`
    } catch (error) {
      console.error("Geocoding error:", error)
      return `Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`
    }
  }

  const initializeMap = (mapContainer: HTMLDivElement, initialLat?: number, initialLng?: number) => {
    if (!window.google || !mapContainer) return

    const mapOptions: google.maps.MapOptions = {
      zoom: 15,
      center: initialLat && initialLng ? { lat: initialLat, lng: initialLng } : { lat: 0, lng: 0 },
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    }

    const newMap = new google.maps.Map(mapContainer, mapOptions)

    const newMarker = new google.maps.Marker({
      map: newMap,
      position: initialLat && initialLng ? { lat: initialLat, lng: initialLng } : undefined,
      draggable: true,
    })

    // Update address when marker is dragged
    newMarker.addListener("dragend", async () => {
      const position = newMarker.getPosition()
      if (position) {
        const address = await getAddressFromCoordinates(position.lat(), position.lng())
        setMapAddress(address)
      }
    })

    // Add click listener to map
    newMap.addListener("click", async (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        newMarker.setPosition(e.latLng)
        const address = await getAddressFromCoordinates(e.latLng.lat(), e.latLng.lng())
        setMapAddress(address)
      }
    })

    // Add double-click listener to auto-confirm
    newMap.addListener("dblclick", async (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        newMarker.setPosition(e.latLng)
        const address = await getAddressFromCoordinates(e.latLng.lat(), e.latLng.lng())
        setMapAddress(address)
        
        // Auto-confirm and close modal after getting address
        setTimeout(() => {
          setManualAddress("")
          setShowMapModal(false)
        }, 300)
      }
    })
  }

  const handleOpenMap = () => {
    setLocationError("")
    setIsLoadingLocation(true)
    setShowMapModal(true)
    
    // Request user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          
          // Get address from coordinates
          const address = await getAddressFromCoordinates(lat, lng)
          setMapAddress(address)
          
          setIsLoadingLocation(false)
          
          // Initialize map with user location
          setTimeout(() => {
            const mapContainer = document.getElementById("google-map") as HTMLDivElement
            if (mapContainer) {
              initializeMap(mapContainer, lat, lng)
            }
          }, 100)
        },
        (error) => {
          setIsLoadingLocation(false)
          let errorMessage = "Location access denied. "
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Please enable location permissions in your browser settings to use this feature."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable."
              break
            case error.TIMEOUT:
              errorMessage += "Location request timed out."
              break
            default:
              errorMessage += "An unknown error occurred."
          }
          
          setLocationError(errorMessage)
          console.error("Geolocation error:", error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      setIsLoadingLocation(false)
      setLocationError("Geolocation is not supported by your browser.")
    }
  }

  const handleMapConfirm = () => {
    if (mapAddress) {
      setManualAddress("") // Clear manual address when using map
      setShowMapModal(false)
    }
  }

  const handleBookTest = () => {
    if (!selectedDate || !selectedTime || !test) return

    dispatch(
      bookLabTest({
        testName: test.name,
        testId: test.id,
        patientId: profile.id,
        scheduledDate: selectedDate?.toLocaleDateString(),
        scheduledTime: selectedTime,
        location,
        instructions: [notes],
      }),
    )

    patientSuccess(`${test.name} Booked Successfully`)
    setShowConfirmation(true)
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-0 bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl">
          <CardContent className="p-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-soft-coral/20 text-soft-coral flex items-center justify-center text-3xl font-bold">
                !
              </div>
              <h2 className="text-3xl font-semibold text-soft-coral tracking-tight">Test Not Found</h2>
              <p className="text-cool-gray text-base leading-relaxed text-center">
                We couldn&apos;t find the lab test you&apos;re looking for
                <br />
              
              </p>
              <Button
                onClick={() => router.push("/patient/lab-tests")}
                className="mt-4 bg-soft-blue hover:bg-soft-blue/90 text-white"
              >
                View All Tests
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div>
          <h1 className="text-3xl font-bold text-soft-coral">Book Lab Test</h1>
          <p className="text-cool-gray">Schedule your lab test appointment</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          {/* Test Details Card */}
          <Card className="mb-3 bg-white/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5 text-soft-coral" />
                Test Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-cool-gray/10 rounded-lg p-5">
                <h3 className="font-semibold text-soft-coral text-xl mb-2">{test.name}</h3>
                <p className="text-dark-slate-gray mb-3">{test.description}</p>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-soft-coral" />
                    {test.duration}
                  </span>
                  <span className="font-semibold text-cool-gray">Rs.{test.price}</span>
                </div>
              </div>

              {/* Preparation Instructions */}
              {test.preparation_instructions && (
                <div className="bg-soft-blue text-snow-white rounded-lg p-5 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-black" />
                    <h4 className="font-semibold text-black">Preparation Instructions</h4>
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {test.preparation_instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Calendar Card */}
          <Card className="mb-3 bg-white/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-mint-green" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-5 border-0 w-full max-w-[450px] mx-auto"
                disabled={(date: Date) => date < new Date()}
                showOutsideDays={false}
                today={selectedDate}
              />
            </CardContent>
          </Card>

          {/* Booking Details Card */}
          <Card className="bg-white/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-soft-blue" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Time Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-soft-blue">Select Time</label>
                <TimeSelect selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-soft-blue">Location Type</label>
                <RadioGroup value={locationType} onValueChange={(value: "home" | "branch") => setLocationType(value)}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-soft-blue/5 cursor-pointer">
                    <RadioGroupItem value="home" id="home" />
                    <Label htmlFor="home" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Home className="h-4 w-4 text-soft-coral" />
                      <span>Home Sampling</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-soft-blue/5 cursor-pointer">
                    <RadioGroupItem value="branch" id="branch" />
                    <Label htmlFor="branch" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Building2 className="h-4 w-4 text-mint-green" />
                      <span>Visit Branch</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Home Sampling Options */}
              {locationType === "home" && (
                <div className="space-y-4 p-4 bg-soft-coral/5 rounded-lg border border-soft-coral/20">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-soft-blue">Select Location Method</label>
                    <div className="grid grid-cols-1 gap-3">
                      {/* Map Selection */}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start gap-2 h-auto py-3"
                        onClick={handleOpenMap}
                      >
                        <Map className="h-4 w-4 text-soft-coral" />
                        <div className="text-left flex-1">
                          <div className="font-medium">Select on Map</div>
                          <div className="text-xs text-cool-gray">Choose your location from map</div>
                        </div>
                      </Button>

                      {/* Manual Address Input */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-cool-gray">Or Enter Address Manually</label>
                        <Textarea
                          value={manualAddress}
                          onChange={(e) => {
                            setManualAddress(e.target.value)
                            setMapAddress("") // Clear map address when typing
                          }}
                          placeholder="Enter your complete address (House #, Street, Area, City)"
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Display selected location */}
                  {(manualAddress || mapAddress) && (
                    <div className="p-3 bg-white rounded-lg border border-soft-coral/30">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-soft-coral mt-0.5" />
                        <div className="flex-1">
                          <div className="text-xs font-medium text-soft-blue mb-1">Selected Location:</div>
                          <div className="text-sm text-dark-slate-gray">
                            {manualAddress || mapAddress}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Branch Selection */}
              {locationType === "branch" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-soft-blue">Select Branch</label>
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a branch location" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch, index) => (
                        <SelectItem key={index} value={branch}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-mint-green" />
                            {branch}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Additional Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-soft-blue">Additional Notes (Optional)</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requirements or notes..."
                  rows={4}
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-soft-blue">Phone Number</label>
                  <Input placeholder="+1 (555) 123-4567" value={profile.phone} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-soft-blue">Email</label>
                  <Input placeholder="john.doe@example.com" value={profile.email} disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Booking Summary */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Card className={!selectedTime ? 'bg-cool-gray/10 sticky top-0' : 'bg-white/40 sticky top-0'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-soft-coral" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-cool-gray">Test:</span>
                  <span className="text-sm font-medium text-soft-blue">{test.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cool-gray">Date:</span>
                  <span className="text-sm font-medium text-soft-blue">
                    {selectedDate ? selectedDate.toLocaleDateString() : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cool-gray">Time:</span>
                  <span className="text-sm font-medium text-soft-blue">{selectedTime || "Not selected"}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-cool-gray">Location:</span>
                  <span className="text-sm font-medium text-soft-blue text-right max-w-[200px] truncate" title={location}>
                    {location}
                  </span>
                </div>
               
                <div className="flex justify-between">
                  <span className="text-sm text-cool-gray">Price:</span>
                  <span className="text-sm font-medium text-soft-blue">Rs.{test.price}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  className="w-full bg-soft-blue hover:bg-soft-blue/90 text-snow-white"
                  disabled={!selectedDate || !selectedTime || !location}
                  onClick={handleBookTest}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Confirm Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40 transition-opacity duration-300 ease-in-out">
          <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] w-full max-w-md p-6 space-y-5 border border-soft-blue/20 animate-fadeIn scale-100">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-soft-coral/10 text-soft-coral animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-dark-slate-gray tracking-wide">Booking Confirmed</h2>
              <span className="text-xs font-medium text-soft-blue bg-soft-blue/10 px-2 py-0.5 rounded-full">
                #LAB-{Math.floor(Math.random() * 10000)}
              </span>
            </div>

            <div className="space-y-3 text-sm text-dark-slate-gray">
              <div className="flex justify-between">
                <span className="font-medium text-soft-blue">Test</span>
                <span className="text-right">{test.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-soft-blue">Date</span>
                <span className="text-right">{selectedDate?.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-soft-blue">Time</span>
                <span className="text-right">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-soft-blue">Location</span>
                <span className="text-right">{location}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-soft-blue">Price</span>
                <span className="text-right">Rs.{test.price}</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={() => {
                  setShowConfirmation(false)
                  router.push("/patient/medical-records")
                }}
                className="w-full bg-soft-blue hover:bg-soft-blue/90 text-white py-2 rounded-lg text-sm font-medium transition duration-200"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden">
            {/* Header - Fixed */}
            <div className="p-4 sm:p-6 border-b flex items-start justify-between flex-shrink-0">
              <div className="flex-1 pr-4">
                <h2 className="text-lg sm:text-xl font-semibold text-soft-coral mb-1">Select Your Location</h2>
                <p className="text-xs sm:text-sm text-cool-gray">
                  {isLoadingLocation ? "Getting your location..." : "Click or drag marker to select. Double-click to confirm instantly."}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowMapModal(false)
                  setLocationError("")
                }}
                className="text-cool-gray hover:text-soft-coral flex-shrink-0"
              >
                ✕
              </Button>
            </div>
            
            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6 space-y-4">
                {/* Location Error */}
                {locationError && (
                  <div className="p-3 sm:p-4 bg-soft-coral/10 border border-soft-coral/30 rounded-lg">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <AlertCircle className="h-5 w-5 text-soft-coral mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-soft-coral mb-1 text-sm sm:text-base">Location Permission Required</h4>
                        <p className="text-xs sm:text-sm text-dark-slate-gray">{locationError}</p>
                        <p className="text-xs text-cool-gray mt-2">
                          Please enable location access and try again, or enter your address manually.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {isLoadingLocation && (
                  <div className="w-full h-64 sm:h-80 md:h-96 bg-gradient-to-br from-soft-blue/10 to-mint-green/10 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-3 p-4">
                      <div className="w-12 h-12 border-4 border-soft-blue/30 border-t-soft-blue rounded-full animate-spin mx-auto"></div>
                      <p className="text-xs sm:text-sm text-cool-gray">Requesting location access...</p>
                    </div>
                  </div>
                )}

                {/* Google Map */}
                {!isLoadingLocation && !locationError && (
                  <div className="space-y-3">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleOpenMap}
                        className="gap-2 text-soft-blue border-soft-blue/30 hover:bg-soft-blue/10"
                      >
                        <Navigation className="h-4 w-4" />
                        Use My Current Location
                      </Button>
                    </div>
                    <div 
                      id="google-map"
                      className="w-full h-64 sm:h-80 md:h-96 rounded-lg border-2 border-soft-blue/20"
                    >
                    </div>
                  </div>
                )}
                
                {/* Address Display - Editable */}
                {mapAddress && (
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-soft-blue flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-soft-coral flex-shrink-0" />
                      <span>Selected Address (You can edit this)</span>
                    </label>
                    <Textarea
                      value={mapAddress}
                      onChange={(e) => setMapAddress(e.target.value)}
                      rows={3}
                      className="resize-none text-xs sm:text-sm w-full border-soft-blue/30 focus:border-soft-blue focus:ring-2 focus:ring-soft-blue/20 rounded-lg p-3"
                      placeholder="Edit the address if needed..."
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons - Fixed at Bottom */}
            <div className="p-4 sm:p-6 border-t bg-gray-50/50 flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1 order-2 sm:order-1"
                  onClick={() => {
                    setShowMapModal(false)
                    setLocationError("")
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-soft-blue hover:bg-soft-blue/90 text-white order-1 sm:order-2"
                  onClick={handleMapConfirm}
                  disabled={!mapAddress}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Confirm Location
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
