import React, { ReactNode } from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface SortableListProps {
  items: number[]
  children: ReactNode
}

export const SortableList = ({ items, children }: SortableListProps) => {
  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      {children}
    </SortableContext>
  )
}
