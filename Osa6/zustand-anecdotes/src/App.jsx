
import {useAnecdotes} from './store'
import {useAnecdoteActions} from './store'
import {create} from 'zustand'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import anecdoteService from './services/anecdotes'
import {useEffect} from 'react'
import Notification from './components/Notification'

const App = () => {

  const {initialize} = useAnecdoteActions()
  
  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App