import { toast, ToastContainer, ToastOptions, Slide } from 'react-toastify'
// "@ts-expect-error"
import 'react-toastify/dist/ReactToastify.css'

const baseToastOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  transition: Slide,
  className:
    'bg-dark-slate-gray/60 backdrop-blur-xl border border-soft-blue text-snow-white rounded-2xl px-5 py-4 shadow-[0_0_20px_2px_rgba(88,199,250,0.15)]',
  theme: 'dark',
}

const toastBox = (title: string, msg: string) => (
  <div>
    <p className="font-semibold mb-1">{title}</p>
    <p className="text-sm opacity-90">{msg}</p>
  </div>
)

export const adminSuccess = (msg: string) => {
  toast.success(toastBox('Success', msg), {
    ...baseToastOptions,
    style: {
      background: 'oklch(0.15 0.05 210 / 0.6)',
      borderColor: 'oklch(0.55 0.15 210)',
      color: 'oklch(0.98 0.02 100)',
      boxShadow: '0 0 15px oklch(0.72 0.11 178 / 0.5)',
    },
  })
}

export const adminError = (msg: string) => {
  toast.error(toastBox('Error', msg), {
    ...baseToastOptions,
    style: {
      background: 'oklch(0.15 0.05 210 / 0.6)',
      borderColor: 'oklch(0.65 0.25 10)',
      color: 'oklch(0.98 0.02 100)',
      boxShadow: '0 0 15px oklch(0.65 0.25 10 / 0.5)',
    },
  })
}

export const adminWarning = (msg: string) => {
  toast.warn(toastBox('Warning', msg), {
    ...baseToastOptions,
    style: {
      background: 'oklch(0.15 0.05 210 / 0.6)',
      borderColor: 'oklch(0.72 0.11 178)',
      color: 'oklch(0.98 0.02 100)',
      boxShadow: '0 0 15px oklch(0.72 0.11 178 / 0.5)',
    },
  })
}

export const adminInfo = (msg: string) => {
  toast.info(toastBox('Info', msg), {
    ...baseToastOptions,
    style: {
      background: 'oklch(0.15 0.05 210 / 0.6)',
      borderColor: 'oklch(0.35 0.05 180)',
      color: 'oklch(0.98 0.02 100)',
      boxShadow: '0 0 15px oklch(0.35 0.05 180 / 0.5)',
    },
  })
}

export const adminDestructive = (msg: string) => {
  toast.error(toastBox('Deleted', msg), {
    ...baseToastOptions,
    style: {
      background: 'oklch(0.15 0.05 210 / 0.6)',
      borderColor: 'oklch(0.65 0.25 10)',
      color: 'oklch(0.98 0.02 100)',
      boxShadow: '0 0 15px oklch(0.65 0.25 10 / 0.5)',
    },
  })
}

export const AdminToastContainer = () => (
  <ToastContainer
    newestOnTop
    limit={3}
    toastClassName="!rounded-xl !backdrop-blur-xl !text-sm"
  />
)