import { create } from 'zustand'
import { getFormById } from '@/services/forms'
import { FormType, FormTypeById } from '@/types/form'
import { Pagination } from '@/types/pagination'
import { Api } from '@/services/api-client'
import toast from 'react-hot-toast'

interface SearchParams {
  searchTitle?: string;
  authorId?: number;
  createdAt?: "ASC" | "DESC";
  searchOrder: "ASC" | "DESC";
}

interface FormStore {
  allForms: FormType[];
  loading: boolean;
  searchTitle: string,
  searchType: string;
  searchOrder: "ASC" | "DESC";
  error: string | null;
  pagination: Pagination;
  hasMore: boolean;
  fetchForms: (pagination?: { limit: number; skip: number } | undefined,
    searchParams?: { searchTitle?: string; authorId?: number; searchOrder: 'ASC' | 'DESC' }) => Promise<void>;
  getFormById: (formId: number) => Promise<FormTypeById>;
  reset: () => void;
  removeForm: (id: number) => Promise<void>;
  loadingCard: number | null
  resetForms: () => void
}

export const useFormsStore = create<FormStore>((set, get) => ({
  allForms: [],
  loading: false,
  searchTitle: '',
  searchType: '',
  searchOrder: 'ASC',
  error: null,
  pagination: { skip: 0, limit: 12 },
  hasMore: true,
  loadingCard: null,
  fetchForms: async (pagination?: Pagination, searchParams?: SearchParams) => {
    const currentState = get()
    const currentPagination = pagination || currentState.pagination

    if (currentState.loading || !currentState.hasMore) return

    set({ loading: true })

    try {
      const data = await Api.form.getAllForms(currentPagination, searchParams)
      const newSkip = currentPagination.skip + currentPagination.limit

      set((state) => ({
        allForms: [...state.allForms, ...data.AllForms],
        pagination: { ...currentPagination, skip: newSkip },
        hasMore: data.AllForms.length >= currentPagination.limit,
        loading: false
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Ошибка загрузки',
        loading: false
      })
    }
  },

  getFormById: async (formId: number) => {
    try {
      return await getFormById(formId)
    } catch (err) {
      console.error(err)
      return null
    }
  },

  reset: () => {
    set({
      allForms: [],
      pagination: { skip: 0, limit: 12 },
      hasMore: true,
      searchTitle: '',
      searchType: '',
      searchOrder: 'ASC'
    })
  },

  removeForm: async (id: number) => {

    set({ loadingCard: id })

    try {
      await Api.form.deleteForm(id)

      set((state) => ({
        allForms: state.allForms.filter((form) => form.id !== id)
      }))
      toast.success('Форма успешна удалена')
      await get().fetchForms()

    } catch (error) {
      if (error instanceof Error) {
        console.error('Ошибка:', error.message);
      } else {
        console.error('Неизвестная ошибка:', error);
      }
    }
    finally {
      set({ loadingCard: null })
    }
  },

  resetForms: () => set({
    allForms: [],
    pagination: { skip: 0, limit: 10 },
    hasMore: true,
    searchTitle: '',
    searchType: '',
    searchOrder: 'ASC'
  }),
}))
