import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import usePersistentState from './usePersistentState.js'

describe('usePersistentState', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('stores and restores state', () => {
    const { result } = renderHook(() => usePersistentState('demo', 'init'))
