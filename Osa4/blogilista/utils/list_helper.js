
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
      return undefined
  }  
  return blogs.reduce((favorite, blog) => (blog.likes > favorite.likes ? blog : favorite), blogs[0])
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
      return undefined
  }  
  const countsByAuthor = blogs.reduce((counts, blog) => {
      counts[blog.author] = (counts[blog.author] || 0) + 1
      return counts
  }, {})  
  const [author, blogsCount] = Object.entries(countsByAuthor).reduce(
      (best, current) => (current[1] > best[1] ? current : best)
  )  
  return {
      author,
      blogs: blogsCount
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
      return undefined
  }  
  const likesByAuthor = blogs.reduce((likes, blog) => {
      likes[blog.author] = (likes[blog.author] || 0) + blog.likes
      return likes
  }, {})  
  const [author, totalLikes] = Object.entries(likesByAuthor).reduce(
      (best, current) => (current[1] > best[1] ? current : best)
  )  
  return {
      author,
      likes: totalLikes
  }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}