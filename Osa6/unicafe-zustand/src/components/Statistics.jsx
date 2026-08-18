const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

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

export default Statistics
