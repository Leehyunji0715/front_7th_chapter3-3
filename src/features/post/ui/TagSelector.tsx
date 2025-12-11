import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components"

interface Tag {
  url: string
  slug: string
}

interface TagSelectorProps {
  selectedTag: string
  tags: Tag[]
  onTagChange: (value: string) => void
}

export const TagSelector = ({ selectedTag, tags, onTagChange }: TagSelectorProps) => {
  return (
    <Select value={selectedTag} onValueChange={onTagChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="태그 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">모든 태그</SelectItem>
        {tags.map((tag) => (
          <SelectItem key={tag.url} value={tag.slug}>
            {tag.slug}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
