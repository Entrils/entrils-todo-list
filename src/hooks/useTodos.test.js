import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useTodos from './useTodos.js'

const baseTodos = [
  {
    id: 1,
    text: 'Task today',
    completed: false,
    project: 'Inbox',
    tags: [],
    priority: 'medium',
    dueDate: '2026-02-12',
  },
  {
    id: 2,
    text: 'Task overdue',
    completed: false,
    project: 'Inbox',
    tags: [],
    priority: 'medium',
    dueDate: '2026-02-10',
  },
  {
    id: 3,
    text: 'Task upcoming',
    completed: false,
    project: 'Inbox',
    tags: [],
    priority: 'medium',
    dueDate: '2026-02-20',
  },
]

describe('useTodos', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-02-12T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('filters by due date', () => {
    const { result, rerender } = renderHook((props) => useTodos(props), {
      initialProps: {
        todos: baseTodos,
        filter: 'all',
        projectFilter: 'all',
        tagFilter: 'all',
        priorityFilter: 'all',
        dueFilter: 'today',
        search: '',
        showComposer: false,
      },
    })

    expect(result.current.filteredTodos).toHaveLength(1)
    expect(result.current.filteredTodos[0].id).toBe(1)

    rerender({
      todos: baseTodos,
      filter: 'all',
      projectFilter: 'all',
      tagFilter: 'all',
      priorityFilter: 'all',
      dueFilter: 'overdue',
      search: '',
      showComposer: false,
    })

    expect(result.current.filteredTodos).toHaveLength(1)
    expect(result.current.filteredTodos[0].id).toBe(2)

    rerender({
      todos: baseTodos,
      filter: 'all',
      projectFilter: 'all',
      tagFilter: 'all',
      priorityFilter: 'all',
      dueFilter: 'upcoming',
      search: '',
      showComposer: false,
    })

    expect(result.current.filteredTodos).toHaveLength(1)
    expect(result.current.filteredTodos[0].id).toBe(3)
  })

  it('returns a title label based on filters', () => {
    const { result } = renderHook(() =>
      useTodos({
        todos: baseTodos,
        filter: 'all',
        projectFilter: 'Work',
        tagFilter: 'all',
        priorityFilter: 'all',
        dueFilter: 'any',
        search: '',
        showComposer: false,
      })
    )

    expect(result.current.titleLabel).toBe('Work')
  })
})
