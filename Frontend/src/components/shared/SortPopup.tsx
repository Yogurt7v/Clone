import * as React from 'react'

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SortPopupProps {
  searchTitle?: string
  searchOrder?: string
  setSearchOrder: (order: 'ASC' | 'DESC') => void
  className: string
  authorId?: number | undefined
}

export const SortPopup: React.FC<SortPopupProps> = ({ className, setSearchOrder }) => {
  const handleChange = async (value: string) => {
    if (value === 'newest') {
      setSearchOrder('DESC')
    } else if (value === 'oldest') {
      setSearchOrder('ASC')
    }
  }
  return (
    <Select onValueChange={handleChange} defaultValue='oldest'>
      <SelectTrigger className={className}>
        <SelectValue placeholder={'Сортировка'} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem className={'cursor-pointer'} value='newest'>
            {'Сначала новые'}
          </SelectItem>
          <SelectItem className={'cursor-pointer'} value='oldest'>
            {'Сначала старые'}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
