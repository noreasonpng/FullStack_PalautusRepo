const Header = (props) => {
  console.log(props)
  return (
    <div>
      <h1>{props.course.name}</h1>
    </div>
  )
}

const Content = (props) => {
  return(
    <div>
    <Part parts = {props.course.parts[0]}/>
    <Part parts = {props.course.parts[1]}/>
    <Part parts = {props.course.parts[2]}/>
    </div>
  )
}

const Part = (props) => {
  return(
    <p>{props.parts.name} {props.parts.exercises}</p>
  )
}


const Total = (props) => {
  let total = 0
  props.course.parts.forEach(value =>{
    total += value.exercises
  })
  return (
    <div>
      <p>Total Exercises: {total}</p>
    </div>
  )
}

const App = () => {

  const course = {
    name: 'Half Stack Application Development',
    parts: [
    {
      name: 'Fundamentals of react',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]
}

  return(
    <div>
      <Header course = {course}/>
      <Content course = {course}/>
      <Total course = {course}/>
    </div>
  )
}



export default App