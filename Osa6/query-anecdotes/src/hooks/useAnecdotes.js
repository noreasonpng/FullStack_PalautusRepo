import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {getAnecdotes, createAnecdote, updateAnecdote} from '../requests'
import useNotify from './useNotify'

const useAnecdotes = () => {
  const queryClient = useQueryClient()
  const { notify } = useNotify()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`Anecdote '${newAnecdote.content}' added`)
    },
    onError: (error) => {
      notify(error.message)
    }
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`You voted '${updatedAnecdote.content}'`)
    }
  })

  const addNote = (content) => {
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  const vote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    addNote,
    vote
  }
}

export default useAnecdotes