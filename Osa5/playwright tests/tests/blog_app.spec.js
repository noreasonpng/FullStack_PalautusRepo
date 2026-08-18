const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'Login' }).click()

      const loginResponse = page.waitForResponse(response =>
        response.url().includes('/api/login') && response.request().method() === 'POST'
      )

      await page.getByLabel('username:').fill('mluukkai')
      await page.getByLabel('password:').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      const response = await loginResponse
      expect(response.ok()).toBeTruthy()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong password', async ({ page }) => {
      await page.getByRole('link', { name: 'Login' }).click()

      await page.getByLabel('username:').fill('mluukkai')
      await page.getByLabel('password:').fill('wrongpword')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.locator('.error')).toHaveText(/Wrong credentials/)
      await expect(page.getByRole('button', { name: 'logout' })).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'Login' }).click()
      await page.getByLabel('username:').fill('mluukkai')
      await page.getByLabel('password:').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    const createBlog = async (page, blog) => {
      await page.getByRole('link', { name: 'new blog' }).click()
      await page.getByLabel('title:').fill(blog.title)
      await page.getByLabel('author:').fill(blog.author)
      await page.getByLabel('url:').fill(blog.url)
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByRole('link', { name: `${blog.title} by ${blog.author}` })).toBeVisible()
    }

    test('a new blog can be created', async ({ page }) => {
      const blog = { title: 'A new blog title', author: 'Test Author', url: 'https://example.com' }
      await createBlog(page, blog)
    })

    test('a blog can be liked', async ({ page }) => {
      const blog = { title: 'A blog that can be liked', author: 'Test Author', url: 'https://example.com/liked' }
      await createBlog(page, blog)

      await page.getByRole('link', { name: `${blog.title} by ${blog.author}` }).click()
      await expect(page.getByText('likes 0')).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      const blog = { title: 'A blog that can be deleted', author: 'Test Author', url: 'https://example.com/deleted' }
      await createBlog(page, blog)

      await page.getByRole('link', { name: `${blog.title} by ${blog.author}` }).click()

      page.once('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'delete' }).click()

      await expect(page.getByRole('link', { name: `${blog.title} by ${blog.author}` })).not.toBeVisible()
    })

    test('only the creator sees the delete button', async ({ page, request }) => {
      const blog = { title: 'A blog owned by the creator', author: 'Test Author', url: 'https://example.com/owned-by-creator' }
      await createBlog(page, blog)

      await page.getByRole('link', { name: `${blog.title} by ${blog.author}` }).click()
      await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()

      await request.post('http://localhost:3003/api/users', {
        data: {
          username: 'anotheruser',
          name: 'Another User',
          password: 'password123'
        }
      })

      await page.getByRole('link', { name: 'Login' }).click()
      await page.getByLabel('username:').fill('anotheruser')
      await page.getByLabel('password:').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('link', { name: `${blog.title} by ${blog.author}` }).click()
      await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'delete' })).toHaveCount(0)
    })

	test('blogs are sorted by likes, most liked first', async ({ page }) => {
	    const blogs = [
	        { title: 'Blog with least likes', author: 'Author One', url: 'https://example.com/1', likes: 1 },
	        { title: 'Blog with medium likes', author: 'Author Two', url: 'https://example.com/2', likes: 2 },
	        { title: 'Blog with most likes', author: 'Author Three', url: 'https://example.com/3', likes: 3 },
	    ]

	    for (const blog of blogs) {
	        await page.getByRole('button', { name: 'Create a blog' }).click()
	        await page.getByLabel('title').fill(blog.title)
	        await page.getByLabel('author').fill(blog.author)
	        await page.getByLabel('url').fill(blog.url)
	        await page.getByRole('button', { name: 'create' }).click()
	        await expect(page.getByText(`${blog.title} ${blog.author}`)).toBeVisible()
	    }

	    for (const blog of blogs) {
	        const blogElement = page.getByTestId('blog').filter({ hasText: blog.title })
	        await blogElement.getByRole('button', { name: 'view' }).click()
		
	        for (let i = 1; i <= blog.likes; i++) {
	            await blogElement.getByRole('button', { name: 'like' }).click()
	            await expect(blogElement.getByText(`likes ${i}`)).toBeVisible()
	        }
	    }

	    const blogElements = page.getByTestId('blog')
	    await expect(blogElements).toHaveCount(3)
	    const texts = await blogElements.allTextContents()
	    expect(texts[0]).toContain('Blog with most likes')
	    expect(texts[1]).toContain('Blog with medium likes')
	    expect(texts[2]).toContain('Blog with least likes')

	})
  })
})