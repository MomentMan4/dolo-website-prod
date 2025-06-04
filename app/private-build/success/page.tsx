import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function PrivateBuildSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Application Submitted!</h2>
            <p className="mt-2 text-sm text-gray-600">Thank you for your interest in our private build service.</p>
          </div>

          <div className="mt-6">
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">
                <p className="font-medium">What happens next?</p>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>We'll review your application within 24 hours</li>
                  <li>Our team will reach out to discuss your project</li>
                  <li>We'll provide a detailed proposal and timeline</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Link href="/" className="w-full">
              <Button className="w-full bg-orange text-white hover:bg-orange-600">Return to Home</Button>
            </Link>
            <Link href="/contact" className="w-full">
              <Button variant="outline" className="w-full">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
