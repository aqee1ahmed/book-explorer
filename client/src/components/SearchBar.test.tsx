import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFiltersStore } from '../store/filtersStore'
import { SearchBar } from './SearchBar'

const initialState = useFiltersStore.getState()

describe('SearchBar', () => {
  beforeEach(() => {
    useFiltersStore.setState(initialState, true)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounces query updates to the store', () => {
    render(<SearchBar />)
    fireEvent.change(screen.getByPlaceholderText(/search books/i), { target: { value: 'dune' } })
    expect(useFiltersStore.getState().query).toBe('')
    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(useFiltersStore.getState().query).toBe('dune')
  })

  it('clears the query immediately via the clear button', () => {
    useFiltersStore.setState({ query: 'dune' })
    render(<SearchBar />)
    fireEvent.click(screen.getByLabelText('Clear search'))
    expect(useFiltersStore.getState().query).toBe('')
  })
})
