import { beforeEach, describe, expect, it } from 'vitest'
import { useFiltersStore } from './filtersStore'

const initialState = useFiltersStore.getState()

beforeEach(() => {
  useFiltersStore.setState(initialState, true)
})

describe('filtersStore', () => {
  it('starts on the fiction subject with no query', () => {
    expect(useFiltersStore.getState()).toMatchObject({
      query: '',
      subject: 'fiction',
      sort: 'relevance',
      page: 1,
    })
  })

  it('resets the page when the query changes', () => {
    useFiltersStore.getState().setPage(3)
    useFiltersStore.getState().setQuery('dune')
    expect(useFiltersStore.getState()).toMatchObject({ query: 'dune', page: 1 })
  })

  it('clears the query and resets the page when a subject is selected', () => {
    useFiltersStore.getState().setQuery('dune')
    useFiltersStore.getState().setPage(2)
    useFiltersStore.getState().setSubject('fantasy')
    expect(useFiltersStore.getState()).toMatchObject({ subject: 'fantasy', query: '', page: 1 })
  })

  it('resets the page when the sort changes', () => {
    useFiltersStore.getState().setPage(4)
    useFiltersStore.getState().setSort('rating')
    expect(useFiltersStore.getState()).toMatchObject({ sort: 'rating', page: 1 })
  })
})
