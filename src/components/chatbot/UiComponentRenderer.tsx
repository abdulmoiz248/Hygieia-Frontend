import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react"
import { useChatbotStore } from "@/store/patient/chatbot-store"
import { usePatientProfileStore } from "@/store/patient/profile-store"
import { UiComponent } from "@/types/patient-chat"

interface Props {
  component: UiComponent
}

export function UiComponentRenderer({ component }: Props) {
  const { type, ...data } = component
  const { sendMessage, confirmAction, isSending } = useChatbotStore()
  const { profile } = usePatientProfileStore()
  const patientId = profile.id

  switch (type) {
    case "text":
      return (
        <div className="prose prose-sm max-w-none text-dark-slate-gray">
          {/* A simple markdown approach. For production, consider using react-markdown */}
          <p className="whitespace-pre-wrap">{data.body as string}</p>
        </div>
      )

    case "error_card":
      return (
        <Card className="border-soft-coral/50 bg-red-50 mt-2">
          <CardHeader className="py-3 px-4 flex flex-row items-center gap-2">
            <AlertCircle className="w-5 h-5 text-soft-coral" />
            <CardTitle className="text-sm font-semibold text-soft-coral m-0">
              {data.title as string || "Error"}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-0 text-sm text-soft-coral/90">
            {data.body as string}
          </CardContent>
        </Card>
      )

    case "action_result":
      const status = data.status as string
      const isSuccess = status === "success"
      return (
        <div className={`p-3 rounded-lg border flex items-start gap-3 mt-2 ${
          isSuccess ? "bg-mint-green/10 border-mint-green/30" : "bg-soft-coral/10 border-soft-coral/30"
        }`}>
          {isSuccess ? (
            <CheckCircle2 className="w-5 h-5 text-mint-green shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-soft-coral shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className={`text-sm font-semibold ${isSuccess ? "text-mint-green" : "text-soft-coral"}`}>
              {data.title as string}
            </h4>
            {data.body && (
              <p className="text-xs mt-1 text-dark-slate-gray/80">{data.body as string}</p>
            )}
          </div>
        </div>
      )

    case "booking_confirmation":
      const summary = data.summary as string
      const actionToken = data.action_token as string
      const confirmLabel = (data.confirm_label as string) || "Confirm"
      const cancelLabel = (data.cancel_label as string) || "Cancel"
      
      return (
        <Card className="mt-3 border-soft-blue/20 bg-white shadow-sm overflow-hidden">
          <div className="bg-soft-blue/5 px-4 py-2 border-b border-soft-blue/10">
            <span className="text-xs font-semibold text-soft-blue uppercase tracking-wider">
              Confirmation Required
            </span>
          </div>
          <CardContent className="p-4">
            <p className="text-sm text-dark-slate-gray font-medium">{summary}</p>
            <div className="flex items-center gap-2 mt-4">
              <Button 
                onClick={() => patientId && confirmAction(patientId, actionToken)}
                disabled={isSending}
                className="bg-soft-blue hover:bg-soft-blue/90 flex-1"
                size="sm"
              >
                {confirmLabel}
              </Button>
              <Button 
                variant="outline"
                onClick={() => patientId && sendMessage(patientId, "Cancel")}
                disabled={isSending}
                className="flex-1"
                size="sm"
              >
                {cancelLabel}
              </Button>
            </div>
          </CardContent>
        </Card>
      )

    case "doctor_list":
    case "nutritionist_list":
    case "lab_technician_list":
      const items = (data.items as any[]) || []
      return (
        <div className="grid grid-cols-1 gap-3 mt-3">
          {items.map((doc: any) => (
            <Card key={doc.id} className="overflow-hidden">
              <CardContent className="p-3 flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={doc.img} />
                  <AvatarFallback className="bg-soft-blue/20 text-soft-blue">
                    {doc.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-bold text-dark-slate-gray truncate">{doc.name}</h4>
                  <p className="text-xs text-cool-gray truncate">{doc.specialization || type.replace("_list", "")}</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => patientId && sendMessage(patientId, `I want to book with ${doc.name} (ID: ${doc.id})`)}
                  className="bg-mint-green hover:bg-mint-green/90 shrink-0"
                >
                  Book
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )

    case "available_slots":
      const slotsData = (data.slots as any[]) || []
      return (
        <div className="mt-3">
          {data.message && <p className="text-sm mb-2 text-dark-slate-gray">{data.message as string}</p>}
          <div className="flex flex-wrap gap-2">
            {slotsData.map((slot: any, idx: number) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="text-xs border-soft-blue/30 hover:bg-soft-blue hover:text-white"
                onClick={() => patientId && sendMessage(patientId, `Book slot at ${slot.time}`)}
              >
                <Clock className="w-3 h-3 mr-1" />
                {slot.time}
              </Button>
            ))}
          </div>
        </div>
      )

    case "lab_test_list":
      const tests = (data.items as any[]) || []
      return (
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
           {tests.map((test: any) => (
             <Card key={test.id}>
               <CardContent className="p-3">
                 <h4 className="text-sm font-bold text-dark-slate-gray">{test.name}</h4>
                 {test.price && <p className="text-xs text-mint-green font-semibold mt-1">${test.price}</p>}
                 {test.description && <p className="text-xs text-cool-gray mt-1 line-clamp-2">{test.description}</p>}
                 <Button 
                  size="sm" 
                  className="w-full mt-3 bg-soft-blue hover:bg-soft-blue/90"
                  onClick={() => patientId && sendMessage(patientId, `I want to book the ${test.name} lab test`)}
                >
                  Book Test
                </Button>
               </CardContent>
             </Card>
           ))}
         </div>
      )

    case "fitness_summary":
        return (
            <div className="grid grid-cols-2 gap-2 mt-3">
                {Object.entries(data).map(([key, value]) => {
                    if(key === 'type') return null;
                    return (
                    <div key={key} className="bg-white p-3 rounded-xl border shadow-sm">
                        <p className="text-[10px] text-cool-gray uppercase tracking-wider">{key.replace(/_/g, ' ')}</p>
                        <p className="text-lg font-bold text-dark-slate-gray mt-1">{String(value)}</p>
                    </div>
                )})}
            </div>
        )

    case "appointment_list":
      const apptItems = (data.items as any[]) || []
      return (
        <div className="grid grid-cols-1 gap-3 mt-3">
          {apptItems.map((appt: any) => (
             <Card key={appt.id}>
               <CardContent className="p-3">
                 <h4 className="text-sm font-bold text-dark-slate-gray capitalize">{appt.appt_type || appt.type || "Appointment"}</h4>
                 <div className="text-xs text-cool-gray mt-1 flex gap-2">
                   <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {appt.date}</span>
                   <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {appt.time}</span>
                 </div>
                 {appt.status && <p className="text-xs mt-1 font-medium capitalize text-soft-blue">Status: {appt.status}</p>}
                 {appt.mode && <p className="text-xs mt-1 capitalize text-dark-slate-gray/80">Mode: {appt.mode}</p>}
               </CardContent>
             </Card>
          ))}
        </div>
      )

    case "appointment_card":
      return (
        <Card className="mt-3">
          <CardContent className="p-3">
            <h4 className="text-sm font-bold text-dark-slate-gray capitalize">{(data.appt_type as string) || (data.type as string) || "Appointment"}</h4>
            <div className="text-xs text-cool-gray mt-1 flex gap-2">
              <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {data.date as string}</span>
              <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {data.time as string}</span>
            </div>
            {data.status && <p className="text-xs mt-1 font-medium capitalize text-soft-blue">Status: {data.status as string}</p>}
            {data.mode && <p className="text-xs mt-1 capitalize text-dark-slate-gray/80">Mode: {data.mode as string}</p>}
          </CardContent>
        </Card>
      )

    case "prescription_list":
      const prescriptions = (data.items as any[]) || []
      return (
        <div className="grid grid-cols-1 gap-3 mt-3">
          {prescriptions.map((rx: any) => (
             <Card key={rx.id}>
               <CardContent className="p-3">
                 <h4 className="text-sm font-bold text-dark-slate-gray">Prescription {rx.start_date ? `from ${rx.start_date}` : ""}</h4>
                 {rx.doctorName && <p className="text-xs text-cool-gray mt-1">Dr. {rx.doctorName}</p>}
                 <div className="mt-2 space-y-2">
                   {(rx.medications || []).map((med: any, idx: number) => (
                     <div key={idx} className="bg-gray-50 p-2 rounded text-xs border">
                       <span className="font-semibold">{med.name}</span> - {med.dosage}
                       <p className="mt-1 text-cool-gray">{med.frequency} at {med.time}</p>
                       {med.instructions && <p className="mt-1 italic">{med.instructions}</p>}
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>
          ))}
        </div>
      )

    case "medical_record_list":
      const records = (data.items as any[]) || []
      return (
        <div className="grid grid-cols-1 gap-3 mt-3">
          {records.map((rec: any) => (
             <Card key={rec.id}>
               <CardContent className="p-3">
                 <h4 className="text-sm font-bold text-dark-slate-gray">{rec.title}</h4>
                 <div className="text-xs text-cool-gray mt-1 flex gap-2">
                   <span className="capitalize">{rec.record_type}</span>
                   {rec.date && <span>• {rec.date}</span>}
                 </div>
                 {rec.doctor_name && <p className="text-xs mt-1 text-dark-slate-gray/80">Dr. {rec.doctor_name}</p>}
                 {rec.file_url && (
                   <a href={rec.file_url} target="_blank" rel="noreferrer" className="text-xs text-soft-blue hover:underline mt-2 inline-block">
                     View Document
                   </a>
                 )}
               </CardContent>
             </Card>
          ))}
        </div>
      )

    case "medication_log_list":
      const logs = (data.items as any[]) || []
      return (
        <div className="grid grid-cols-1 gap-2 mt-3">
          {logs.map((log: any) => (
             <div key={log.id} className="p-2 border rounded-lg bg-white flex items-center justify-between">
               <div>
                 <p className="text-xs font-semibold">{log.medicationName || "Medication"}</p>
                 <p className="text-[10px] text-cool-gray">Scheduled: {log.scheduledTime}</p>
               </div>
               {log.taken ? (
                 <CheckCircle2 className="w-4 h-4 text-mint-green" />
               ) : (
                 <XCircle className="w-4 h-4 text-soft-coral" />
               )}
             </div>
          ))}
        </div>
      )

    case "lab_booking_list":
      const labBookings = (data.items as any[]) || []
      return (
        <div className="grid grid-cols-1 gap-3 mt-3">
          {labBookings.map((b: any) => (
             <Card key={b.id}>
               <CardContent className="p-3">
                 <h4 className="text-sm font-bold text-dark-slate-gray">{b.test?.name || "Lab Test"}</h4>
                 <div className="text-xs text-cool-gray mt-1 flex gap-2">
                   <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {b.scheduledDate}</span>
                   <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {b.scheduledTime}</span>
                 </div>
                 <p className="text-xs mt-1 font-medium capitalize text-soft-blue">Status: {b.status}</p>
                 {b.location && <p className="text-xs mt-1 text-dark-slate-gray/80">Location: {b.location}</p>}
               </CardContent>
             </Card>
          ))}
        </div>
      )

    case "recommendation_list":
      const recs = (data.recommendations as any[]) || []
      return (
        <div className="grid grid-cols-1 gap-3 mt-3">
          {recs.map((rec: any, i: number) => (
             <Card key={i}>
               <CardContent className="p-3">
                 <h4 className="text-sm font-bold text-soft-blue">{rec.title}</h4>
                 <p className="text-xs text-dark-slate-gray mt-1">{rec.description}</p>
                 <p className="text-[10px] text-cool-gray mt-2 uppercase">{rec.category}</p>
               </CardContent>
             </Card>
          ))}
        </div>
      )

    default:
      // Fallback for unknown types
      return (
        <div className="mt-2 p-3 bg-gray-50 border rounded-lg text-xs font-mono text-gray-600 overflow-x-auto">
          <div className="font-bold mb-1 text-gray-800 border-b pb-1">Type: {type}</div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )
  }
}
