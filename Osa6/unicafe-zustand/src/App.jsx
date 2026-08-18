import {useState} from 'react'
import {create} from 'zustand'
import Buttons from './components/Buttons'
import Statistics from './components/Statistics'

const useFeedbackStore = create(set => ({
  good: 0,
  neutral: 0,
  bad: 0,
  increment: (type) => set(state => ({[type]: state[type] + 1})),
}))

const App = () => {
  const good = useFeedbackStore(state => state.good)
  const neutral = useFeedbackStore(state => state.neutral)
  const bad = useFeedbackStore(state => state.bad)
  const increment = useFeedbackStore(state => state.increment)

  const total = good + neutral + bad

  return (
    <>
      <h1>Unicafe</h1>
      <Buttons increment={increment} />
      <Statistics good={good} neutral={neutral} bad={bad} total={total} />
    </>
  )
}

export default App
