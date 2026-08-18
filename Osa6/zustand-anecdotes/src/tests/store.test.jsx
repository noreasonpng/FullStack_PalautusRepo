import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest'
import {render, screen, cleanup, fireEvent} from '@testing-library/react'
import {renderHook, act} from '@testing-library/react'

vi.mock('../services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}))

import anecdoteService from '../services/anecdotes'
import useAnecdoteStore, {useAnecdoteActions, useAnecdotes} from '../store'
import AnecdoteList from '../components/AnecdoteList'

beforeEach(() => {
  useAnecdoteStore.setState({anecdotes: [], filter: '', notification: ''})
  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
})

describe('useAnecdoteActions', () => {
  it('Initialize loads anecdotes from service', async () => {
    const mockAnecdotes = [{id: 1, content: 'Test', votes: 0}]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const {result} = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const {result: anecdotesResult} = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(mockAnecdotes)
  })
})

describe('AnecdoteList', () => {
  it('Receives anecdotes from the store sorted by votes', async () => {
    const mockAnecdotes = [
      {id: 1, content: 'Test', votes: 0 },
      {id: 2, content: 'Test 2', votes: 1},
      {id: 3, content: 'Test 3', votes: 3},
      {id: 4, content: 'Test 4', votes: 8}
    ]

    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    render(<AnecdoteList />)

    const renderedContents = screen
      .getAllByText(/^Test/)
      .map(element => element.textContent)

    expect(renderedContents).toEqual(['Test 4', 'Test 3', 'Test 2', 'Test'])
  })

  it('Receives correctly filtered list of anecdotes', () => {
    const mockAnecdotes = [
      {id: 1, content: 'Coding is fun', votes: 2},
      {id: 2, content: 'React is great', votes: 5},
      {id: 3, content: 'Cooking is relaxing', votes: 1}
    ]

    useAnecdoteStore.setState({anecdotes: mockAnecdotes, filter: 'co'})

    render(<AnecdoteList />)

    expect(screen.getByText('Coding is fun')).toBeDefined()
    expect(screen.getByText('Cooking is relaxing')).toBeDefined()

    expect(screen.queryByText('React is great')).toBeNull()
  })

  it('Voting increases the anecdote votes', async () => {
    const anecdote = {id: 1, content: 'Coding is fun', votes: 3}
    const votedAnecdote = {...anecdote, votes: 4}

    anecdoteService.update.mockResolvedValue(votedAnecdote)

    useAnecdoteStore.setState({anecdotes: [anecdote], filter: ''})

    render(<AnecdoteList />)

    expect(screen.getByText('has 3', {exact: false})).toBeDefined()

    const voteButton = screen.getByText('vote')

    await act(async () => {
      fireEvent.click(voteButton)
    })

    expect(anecdoteService.update).toHaveBeenCalledWith(
      anecdote.id,
      expect.objectContaining({votes: 4})
    )

    expect(screen.getByText('has 4', {exact: false})).toBeDefined()
    expect(screen.queryByText('has 3', {exact: false})).toBeNull()
  })
})
