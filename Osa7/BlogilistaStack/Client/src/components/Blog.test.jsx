import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import BlogView from "./BlogView";

describe("BlogView component", () => {
  const blog = {
    id: "1",
    title: "Test Blog Title",
    author: "Test Author",
    url: "https://example.com",
    likes: 5,
    user: {
      id: "user1",
      username: "testuser",
    },
  };

  const owner = { id: "user1", username: "testuser" };
  const otherUser = { id: "user2", username: "otheruser" };

  const renderBlogView = (
    user,
    handleLike = () => {},
    handleDelete = () => {},
  ) => {
    render(
      <MemoryRouter initialEntries={["/blogs/1"]}>
        <Routes>
          <Route
            path="/blogs/:id"
            element={
              <BlogView
                blogs={[blog]}
                user={user}
                handleLike={handleLike}
                handleDelete={handleDelete}
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    );
  };

  test("shows blog info and likes but no buttons when not logged in", () => {
    renderBlogView(null);

    expect(screen.getByText(/Test Blog Title/)).toBeInTheDocument();
    expect(screen.getByText(/Test Author/)).toBeInTheDocument();
    expect(screen.getByText("https://example.com")).toBeInTheDocument();
    expect(screen.getByText(/likes 5/)).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "like" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "delete" }),
    ).not.toBeInTheDocument();
  });

  test("shows only the like button for a logged-in user who is not the owner", () => {
    renderBlogView(otherUser);

    expect(screen.getByText("like")).toBeInTheDocument();
    expect(screen.queryByText("delete")).not.toBeInTheDocument();
  });

  test("shows both like and delete buttons for the blog owner", () => {
    renderBlogView(owner);

    expect(screen.getByText("like")).toBeInTheDocument();
    expect(screen.getByText("delete")).toBeInTheDocument();
  });

  test("calls handleLike when like button is clicked", async () => {
    const user1 = userEvent.setup();
    const mockHandleLike = vi.fn();
    renderBlogView(otherUser, mockHandleLike);

    const likeButton = screen.getByText("like");
    await user1.click(likeButton);
    await user1.click(likeButton);

    expect(mockHandleLike).toHaveBeenCalledTimes(2);
  });
});
