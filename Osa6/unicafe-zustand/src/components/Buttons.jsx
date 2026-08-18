const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const Buttons = ({increment}) => {
  return (
    <div>
      <h2>give feedback</h2>
      <Button onClick={() => increment('good')} text='good'/>
      <Button onClick={() => increment('neutral')} text='neutral'/>
      <Button onClick={() => increment('bad')} text='bad'/>
    </div>
  )
}

export default Buttons
