'use client'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={`w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-smooth font-medium ${
        props.disabled ? 'bg-blue-50 cursor-not-allowed' : 'bg-white hover:border-blue-300'
      } ${className || ''}`}
      {...props}
    />
  )
}
