import { Facebook, Instagram, Twitter } from "lucide-react"
import Link from "next/link"

type FooterProps = {
  waveFill?: string
}

const Footer = ({ waveFill = "fill-mint-green" }: FooterProps) => {
  return (
    <footer id="contact" className="w-full bg-dark-slate-gray text-white">
      <div className="wave-top h-12 w-full overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`h-full w-full ${waveFill}`}>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center">
              <img alt="Hygieia logo" src="/logo/logo-2.png" className="h-12 w-12 rounded-full bg-transparent" />
              <h2 className="ml-3 text-2xl font-bold">Hygieia</h2>
            </div>
            <p className="max-w-xs text-[#7F8C8D]">
              Dedicated to providing innovative solutions for a better tomorrow.
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-xl font-semibold text-[#A8E6CF]">Contact Us</h3>
            <ul className="space-y-4 text-[#7F8C8D]">
               <li className="flex items-start">
                <span className="mr-3 mt-1 text-[#FF6F61]">📍</span>
                <span>123 Hygieia Street, Lahore, Pakistan</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-1 text-[#FF6F61]">📞</span>
                <span>+92 300 1234567</span>
              </li>
               <li className="flex items-start">
                <span className="mr-3 mt-1 text-[#FF6F61]">✉️</span>
                <a href="mailto:contact@hygieia.com" className="hover:text-[#4A90E2] transition-colors">
                  contact@hygieia.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xl font-semibold text-[#A8E6CF]">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/#mission" },
                { label: "Services", href: "/#services" },
                { label: "Blogs", href: "/blogs" },
                { label: "Contact", href: "/#contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group flex items-center text-[#7F8C8D] transition-colors hover:text-[#4A90E2]"
                  >
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#FF6F61] transition-all group-hover:scale-150 group-hover:bg-[#4A90E2]" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-[#4A90E2]"
                aria-label="Facebook"
              >
                <Facebook size={20} className="text-white" />
              </a>
              <a
                href="#"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-[#FF6F61]"
                aria-label="Instagram"
              >
                <Instagram size={20} className="text-white" />
              </a>
              <a
                href="#"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-[#A8E6CF]"
                aria-label="Twitter"
              >
                <Twitter size={20} className="text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container mx-auto flex flex-col items-center justify-between px-4 md:flex-row">
          <p className="mb-4 text-center text-sm text-[#7F8C8D] md:mb-0">
            Copyright {new Date().getFullYear()} Hygieia. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="text-sm text-[#7F8C8D] transition-colors hover:text-[#A8E6CF]">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm text-[#7F8C8D] transition-colors hover:text-[#A8E6CF]">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
