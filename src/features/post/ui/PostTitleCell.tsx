import { Tag } from "../../../entities/ui"

interface PostTitleCellProps {
  title: string
  tags: string[]
  searchQuery: string
  selectedTag: string
  onTagClick: (tag: string) => void
  highlightText: (text: string | undefined, highlight: string) => React.ReactNode
}

export const PostTitleCell = ({
  title,
  tags,
  searchQuery,
  selectedTag,
  onTagClick,
  highlightText,
}: PostTitleCellProps) => {
  return (
    <div className="space-y-1">
      <div>{highlightText(title, searchQuery)}</div>
      <div className="flex flex-wrap gap-1">
        {tags?.map((tag) => (
          <Tag
            key={tag}
            isSelected={selectedTag === tag}
            onClick={() => onTagClick(tag)}
            className="px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer"
          >
            {tag}
          </Tag>
        ))}
      </div>
    </div>
  )
}
