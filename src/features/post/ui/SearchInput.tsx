import { Search } from "lucide-react"
import { Input } from "../../../components"
import { useState } from "react"

interface SearchInputProps {
  onSearchEnter: (value: string) => void
}

export const SearchInput = ({ onSearchEnter }: SearchInputProps) => {
  const [input, setInput] = useState("")

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
