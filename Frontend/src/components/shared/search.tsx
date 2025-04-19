import { Input } from '@/components/ui/input'
import React from 'react'

interface Props {
  search: string
  setSearch: (search: string) => void
  className?: string
}

export const Search: React.FC<Props> = ({ className, setSearch, search }) => {
  return (
    <div className={className}>
      <Input onChange={(e) => setSearch(e.target.value)} value={search} className={'py-5'} placeholder={'Поиск...'} />
    </div>
  )
}
