import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import usePersistentState from './usePersistentState.js'

describe('usePersistentState', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('stores and restores state', () => {
    const { result } = renderHook(() => usePersistentState('demo', 'init'))

    expect(result.current[0]).toBe('init')

    act(() => {
      result.current[1]('next')
    })

    expect(localStorage.getItem('demo')).toBe(JSON.stringify('next'))

    const { result: result2 } = renderHook(() => usePersistentState('demo', 'init'))
    expect(result2.current[0]).toBe('next')
  })
})
