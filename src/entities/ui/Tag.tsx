interface TagProps {
  children: React.ReactNode
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

export const Tag = ({ children, isSelected = false, onClick, className = "" }: TagProps) => {
  const baseClasses = "px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer transition-colors"
  const selectedClasses = "text-white bg-blue-500 hover:bg-blue-600"
  const defaultClasses = "text-blue-800 bg-blue-100 hover:bg-blue-200"

  const combinedClasses = `${baseClasses} ${isSelected ? selectedClasses : defaultClasses} ${className}`

  return (
    <span className={combinedClasses} onClick={onClick}>
      {children}
    </span>
  )
}
