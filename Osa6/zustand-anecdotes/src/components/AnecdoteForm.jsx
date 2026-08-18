import {useAnecdotes} from "../store"
import {useAnecdoteActions} from "../store"
import {create} from 'zustand'
import anecdoteService from '../services/anecdotes'


const AnecdoteForm = () => {

  const {add, vote} = useAnecdoteActions()

  const addAnecdote = async (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    await add(content)
    add(content)
    e.target.reset()
  }

  return(
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <input name = "anecdote"/>
        <button type="submit">create</button>
      </form>
    </div>
  )

}

export default AnecdoteForm