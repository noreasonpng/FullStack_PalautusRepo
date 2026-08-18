import { useFilter, useAnecdoteActions } from '../store'

const Filter = () => {
  const filter = useFilter()
  const {setFilter} = useAnecdoteActions()

  const handleChange = (e) => {
    setFilter(e.target.value)
  }

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      Filter: <input value={filter} onChange={handleChange} />
    </div>
  )
}

export default Filter