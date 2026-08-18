import {useAnecdotes, useAnecdoteActions, useFilter} from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const filter = useFilter()
  const {vote, remove} = useAnecdoteActions()

  const filteredAnecdotes = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )

  return(
    <div>
      <h2>Anecdotes</h2>
        {filteredAnecdotes.map(anecdote => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
              {anecdote.votes < 5 && (
                <button onClick={() => remove(anecdote.id)}>delete</button>
              )}
            </div>
          </div>
        ))}
    </div>
  )
}

export default AnecdoteList