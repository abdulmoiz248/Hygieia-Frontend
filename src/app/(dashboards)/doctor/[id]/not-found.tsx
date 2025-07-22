import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserX, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-snow-white via-mint-green/5 to-soft-blue/10 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="border-0 shadow-lg text-center animate-scale-in">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-soft-coral/10 rounded-full flex items-center justify-center">
                <UserX className="w-8 h-8 text-soft-coral" />
              </div>
            </div>
            <CardTitle className="text-2xl text-dark-slate-gray">Doctor Not Found</CardTitle>
            <CardDescription className="text-cool-gray">
              The doctor profile you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/doctors">
              <Button className="w-full bg-soft-blue hover:bg-soft-blue/90 text-white group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Doctors
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
