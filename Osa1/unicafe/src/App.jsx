import { useState } from 'react'

const Statistics = (props) => {
  const feedbackValues = [
    ...Array(props.good).fill(1),
    ...Array(props.neutral).fill(0),
    ...Array(props.bad).fill(-1),
  ]

  const average =
    feedbackValues.length === 0
      ? 0
      : feedbackValues.reduce((sum, value) => sum + value, 0) / feedbackValues.length

  const precentage = props.good / props.total * 100
  if(props.total === 0){
    return(
      <div>
        <h1>Statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }
  return(
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="Good" value={props.good}/>
          <StatisticLine text="Neutral" value={props.neutral}/>
          <StatisticLine text="Bad" value={props.bad}/>
          <StatisticLine text="Total" value={props.total}/>
          <StatisticLine text="Average" value={average.toFixed(1)} />
          <StatisticLine text="Positive" value={precentage.toFixed(1) + '%'} />
        </tbody>
      </table>
    </div>
  )
}

const StatisticLine = (props) => {
  return(
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const App = () => {

  const [good, setGood] = useState(0)
  const handleGoodClick = () => {setGood(good+1)}

  const [neutral, setNeutral] = useState(0)
  const handleNeutralClick = () => {setNeutral(neutral+1)}

  const [bad, setBad] = useState(0)
  const handleBadClick = () => {setBad(bad+1)}

  const total = good+neutral+bad

  console.log('good: ', good)
  console.log('Neutral: ', neutral)
  console.log('Bad: ', bad)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGoodClick} text = 'good'/>
      <Button onClick={handleNeutralClick} text = 'neutral'/>
      <Button onClick={handleBadClick} text = 'bad'/>
      <Statistics good = {good} neutral = {neutral} bad = {bad} total = {total}></Statistics>
    </div>
  )
}

export default App