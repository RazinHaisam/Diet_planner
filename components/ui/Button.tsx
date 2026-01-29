'use client'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={`px-6 py-3 rounded-xl font-bold transition-smooth transition-all duration-300 flex items-center justify-center ${
        props.disabled
          ? 'bg-blue-300 text-white cursor-not-allowed opacity-75'
          : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-1'
      } ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  )
}
