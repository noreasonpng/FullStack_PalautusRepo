import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const anecdotes = []

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => ({
  content: anecdote,
  id: getId(),
  votes: 0
})

const byVotes = (a, b) => b.votes - a.votes

const useAnecdoteStore = create((set, get) => ({
  anecdotes: anecdotes.map(asObject).toSorted(byVotes),
  filter: '',
  notification: '',
  actions: {
    add: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set(state => ({anecdotes: state.anecdotes.concat(newAnecdote).toSorted(byVotes)}))
      get().actions.setNotification(`you added anecdote: '${content}'`, 5)
    },
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({anecdotes: anecdotes.toSorted(byVotes)}))
    },
    vote: async (id) => {
      const anecdoteToVote = get().anecdotes.find(a => a.id === id)
      if (!anecdoteToVote) return

      const votedAnecdote = {...anecdoteToVote, votes: anecdoteToVote.votes + 1}
      const updatedAnecdote = await anecdoteService.update(id, votedAnecdote)

      set(state => ({
        anecdotes: state.anecdotes
          .map(anecdote => (anecdote.id === id ? updatedAnecdote : anecdote))
          .toSorted(byVotes)
      }))
      get().actions.setNotification(`You voted '${updatedAnecdote.content}'`, 5)
    },
    remove: async (id) => {
      const anecdoteToRemove = get().anecdotes.find(a => a.id === id)
      if (!anecdoteToRemove) return

      await anecdoteService.remove(id)

      set(state => ({
        anecdotes: state.anecdotes.filter(anecdote => anecdote.id !== id)
      }))
      get().actions.setNotification(`you deleted anecdote: '${anecdoteToRemove.content}'`, 5)
    },
    setFilter: (filter) => set({ filter }),
    setNotification: (message, seconds) => {
      set({notification: message})
      setTimeout(() => {
        set({notification: ''})
      }, seconds * 1000)
    },
  },
}))

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
export const useNotification = () => useAnecdoteStore((state) => state.notification)
export default useAnecdoteStore