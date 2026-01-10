import { apiClient } from './client'
import type { Category } from '../types'

type CategoryApiShape = Category & {
  _id?: string
  id?: string
}

type CategoriesResponse = CategoryApiShape[] | { categories: CategoryApiShape[]; limit?: number }

type CategoriesPayload = {
  categories: CategoryApiShape[]
  limit?: number
}

const normalizeCategory = (category: CategoryApiShape): Category => {
  const identifier = category._id ?? category.id
  if (!identifier) {
    throw new Error('Category missing identifier')
  }
  return {
    ...category,
    _id: identifier,
    id: identifier,
  }
}

const extractCategoriesPayload = (data: CategoriesResponse): CategoriesPayload => {
  if (Array.isArray(data)) {
    return { categories: data }
  }
  if (data?.categories) {
    return { categories: data.categories, limit: data.limit }
  }
  return { categories: [] }
}

export const getCategories = async () => {
  const { data } = await apiClient.get<CategoriesResponse>('/api/v1.1/categories/active')
  const payload = extractCategoriesPayload(data)
  return {
    categories: payload.categories.map(normalizeCategory),
    limit: payload.limit,
  }
}

export const getAllCategories = async (type?: 'income' | 'expense') => {
  const { data } = await apiClient.get<CategoriesResponse>('/api/v1.1/categories/all', {
    params: type ? { type } : {},
  })
  return extractCategoriesPayload(data).categories.map(normalizeCategory)
}

export const createCategory = async (payload: Pick<Category, 'name' | 'type'>) => {
  const { data } = await apiClient.post<CategoryApiShape | { category: CategoryApiShape }>(
    '/api/v1.1/categories',
    payload,
  )

  if (!data) {
    throw new Error('Category response missing')
  }

  if ('category' in data && data.category) {
    return normalizeCategory(data.category)
  }

  return normalizeCategory(data as CategoryApiShape)
}

export const deleteCategory = async (categoryId: string) => {
  await apiClient.delete(`/api/v1.1/categories/${categoryId}`)
}

export const setDefaultCategory = async (categoryId: string) => {
  const { data } = await apiClient.patch<CategoryApiShape | { category: CategoryApiShape }>(
    `/api/v1.1/categories/${categoryId}`,
    { isDefault: true },
  )

  if ('category' in (data as { category?: CategoryApiShape }) && (data as { category?: CategoryApiShape }).category) {
    return normalizeCategory((data as { category: CategoryApiShape }).category)
  }

  return normalizeCategory(data as CategoryApiShape)
}
