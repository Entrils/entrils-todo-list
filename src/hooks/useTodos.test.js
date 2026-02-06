import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
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