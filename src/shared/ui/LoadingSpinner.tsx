interface LoadingSpinnerProps {
  message?: string
  className?: string
}

export const LoadingSpinner = ({ message = "로딩 중...", className = "" }: LoadingSpinnerProps) => {
  return (
    <div className={`flex justify-center items-center p-4 ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">{message}</span>
    </div>
  )
}
