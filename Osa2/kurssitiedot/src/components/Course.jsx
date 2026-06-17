
const Course = (props) =>{

      const Header = () => {
        return (
          <div>
            <h1>{props.course.name}</h1>
          </div>
          )
      }

    const Content = () => {
      return(
        <div>
        {props.course.parts.map(part => (
          <Part key={part.id} parts={part}/>
        ))}
        </div>      
      )
    }

    const Part = (props) => {
      return(
        <p>{props.parts.name} {props.parts.exercises}</p>
      )
    }

    const Total = (props) => {
      const total = props.course.parts.reduce((sum, part) => {
        return sum + part.exercises
      }, 0)

      return (
        <div>
          <p>Total Exercises: {total}</p>
        </div>
      )
    }
    
    return(
      <div>
        <Header header = {props.course.name}/>
        <Content parts = {props.course.parts}/>
        <Total course = {props.course}/>
      </div>
    )

  }

  export default Course