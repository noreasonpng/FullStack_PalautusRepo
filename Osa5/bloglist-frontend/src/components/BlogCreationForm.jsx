import { useState } from 'react'
import {TextField, Button} from '@mui/material'

const BlogCreationForm = ({ handleSubmit }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createBlog = event => {
    event.preventDefault()
    handleSubmit({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new blog</h2>
      <form onSubmit={createBlog}  
        style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'flex-start'
        }}>
        <TextField label="Title"
        value={title}
        onChange={({ target }) => setTitle(target.value)}
        />
        <TextField label="author"
        value={author}
        onChange={({ target }) => setAuthor(target.value)} 
        />
        <TextField label="url"
        value={url}
        onChange={({ target }) => setUrl(target.value)}
        />
        <Button type="submit" variant="contained" style={{marginTop: 10}}>create</Button>
      </form>
    </div>
  )
}

export default BlogCreationForm