import { Skeleton } from '@/components/ui/skeleton'

export const FormViewSkeleton = () => (
  <div className='max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 mb-10'>
    <Skeleton className='h-20 w-full mb-4' />
    <Skeleton className='h-10 w-full mb-4' />
    <Skeleton className='h-10 w-full mb-4' />
    <Skeleton className='h-10 w-full mb-4' />
    <Skeleton className='h-10 w-full mb-4' />
    <Skeleton className='h-6 w-full mb-4' />
    <Skeleton className='h-6 w-full mb-4' />
    <Skeleton className='h-6 w-full mb-4' />
  </div>
)
