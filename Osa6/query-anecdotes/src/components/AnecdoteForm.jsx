const AnecdoteForm = ({ addNote }) => {
  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={addNote}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm