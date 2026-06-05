import { useState } from 'react'

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      name: 'If it hurts, do it more often.',
      votes: 0
    },
    {
      name: 'Adding manpower to a late software project makes it later!',
      votes: 0
    },
    {
      name: 'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
      votes: 0
    },
    {
      name: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
      votes: 0
    },
    {
      name: 'Premature optimization is the root of all evil.',
      votes: 0
    },
    {
      name: 'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
      votes: 0
    },
    {
      name: 'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
      votes: 0
    },
    {
      name: 'The only way to go fast, is to go well.',
      votes: 0
    }
  ])

  const [selected, setSelected] = useState(0)

  const handleClick = () =>{
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  const handleVoteClick = () => {
    const copy = [...anecdotes]
    copy[selected] = {
      ...copy[selected],
      votes: copy[selected].votes + 1
    }
    setAnecdotes(copy)
  }

  const mostVotedAnecdote = anecdotes.reduce((mostVoted, anecdote) =>
    anecdote.votes > mostVoted.votes ? anecdote : mostVoted
  )

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected].name}
      <p>This anecdote has {anecdotes[selected].votes} votes</p> 
      <Button onClick = {handleClick} text = 'Next anecdote'/>
      <Button onClick = {handleVoteClick} text = 'vote'/>
      <h1>Anecdote with most votes</h1>
      <p>Most voted anecdote: {mostVotedAnecdote.name}</p>
      <p>It has {mostVotedAnecdote.votes} votes</p>

    </div>
  )
}

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

export default App