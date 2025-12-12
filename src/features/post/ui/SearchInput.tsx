import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "../../../components"

interface SearchInputProps {
  value: string
  onSearchEnter: (value: string) => void
}

export const SearchInput = ({ value, onSearchEnter }: SearchInputProps) => {
  const [input, setInput] = useState(value)

  return (
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="게시물 검색..."
          className="pl-8"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              onSearchEnter(input)
            }
          }}
        />
      </div>
    </div>
  )
}
