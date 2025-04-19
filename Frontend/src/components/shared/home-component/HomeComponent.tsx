'use client'

import { useCallback, useEffect, useState } from 'react'
import { useFormsStore } from '@/store/useFormStore'
import { useDebounce, useInfinityScroll } from '@/hooks'
import { Search } from '../search'
import { SortPopup } from '../SortPopup'
// import { CardForm } from './CardForm'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader } from 'lucide-react'
import ErrorBoundary from '@/components/error-boundary/ErrorBoundary'
import * as React from 'react'
import { MyForm } from '@/components/shared/myForm'
import { useUserStore } from '@/store/useUserStore'

const LazyCardForm = React.lazy(() =>
  import('./CardForm').then((module) => ({
    default: module.CardForm
  }))
)

export const HomeComponent = () => {
  const { allForms, loading, error, fetchForms, hasMore, resetForms } = useFormsStore()
  const { user, role } = useUserStore()
  const [searchTitle, setSearchTitle] = useState('')
  const [authorId, setAuthorId] = useState<number | undefined>(undefined)
  const [searchOrder, setSearchOrder] = useState<'ASC' | 'DESC'>('ASC')

  const debounceKey = useDebounce(searchTitle, 300)

  useEffect(() => {
    resetForms()
    fetchForms({ skip: 0, limit: 12 }, { searchTitle: debounceKey, searchOrder, authorId })
  }, [fetchForms, searchOrder, authorId, debounceKey, resetForms])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) fetchForms(undefined, { searchTitle: debounceKey, authorId, searchOrder })
  }, [loading, hasMore, fetchForms, debounceKey, searchOrder, authorId])

  useInfinityScroll(loadMore)

  if (error) return <ErrorBoundary>Ошибка: {error}</ErrorBoundary>

  const noResults = !loading && allForms.length === 0 && searchTitle.trim() !== ''

  return (
    <div>
      <div className='flex gap-5 flex-col md:flex-row justify-between'>
        <Search search={searchTitle} setSearch={setSearchTitle} className='w-full md:w-[80%]' />
        <MyForm setAuthorId={setAuthorId} />
        <SortPopup
          searchTitle={searchTitle}
          searchOrder={searchOrder}
          setSearchOrder={setSearchOrder}
          authorId={authorId}
          className='w-full md:w-[150px] lg:w-[200px] cursor-pointer py-5'
        />
      </div>
      <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
        {!allForms.length &&
          loading &&
          Array(9)
            .fill(0)
            .map((_, i) => (
              <div key={i} className='flex flex-col rounded-[10px] space-y-3 bg-zinc-300'>
                <Skeleton className='w-full h-[300px] sm:h-[250px] md:h-[200px] lg:h-[250px]' />
              </div>
            ))}

        {allForms.map((form) => {
          const totalComments =
            form.questions?.reduce((sum, question) => {
              return sum + (question.comments?.length || 0)
            }, 0) || 0

          return (
            <div key={form.id}>
              <ErrorBoundary
                componentName={`CardForm ${form.id}`}
                errorMessage={`Ошибка загрузки формы ${form.id}`}
                className='text-red-500 flex justify-center items-center border-2 rounded-lg p-3 w-full sm:w-full md:w-[350px] md:h-[300px] lg:w-[400px]'
              >
                <LazyCardForm
                  key={form.id}
                  id={form.id}
                  title={form.title}
                  createdAt={form.createdAt}
                  author={form.author}
                  // avatar={form.author?.avatar}
                  count={totalComments}
                  boolean={form.author?.id === user?.id || role === 'admin'}
                />
              </ErrorBoundary>
            </div>
          )
        })}

        {loading && (
          <div className='py-4 col-span-full flex justify-center'>
            <Loader className='w-10 h-10 text-center animate-spin' />
          </div>
        )}

        {noResults && <div className='py-4 text-center'>Ничего не найдено</div>}

        {!hasMore && !noResults && <div className='py-4 text-center'>Все формы загружены</div>}
      </div>
    </div>
  )
}
