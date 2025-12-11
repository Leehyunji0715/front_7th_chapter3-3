import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components"

interface ItemsPerPageSelectorProps {
  value: number
  onChange: (value: number) => void
  options?: number[]
}

export const ItemsPerPageSelector = ({ value, onChange, options = [10, 20, 30] }: ItemsPerPageSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <span>표시</span>
      <Select value={value.toString()} onValueChange={(val) => onChange(Number(val))}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="10" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span>항목</span>
    </div>
  )
}
