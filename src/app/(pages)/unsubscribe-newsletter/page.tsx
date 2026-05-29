import React, { Suspense } from "react"
import UnsubscribeForm from "./UnsubscribeForm"

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <UnsubscribeForm />
    </Suspense>
  )
}
