import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Get all users
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({
    include: { posts: true }
  });
  res.json(users);
});

// Get user by id
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: { posts: true }
  });
  res.json(user);
});

// Create user
app.post('/users', async (req, res) => {
  const { email, name } = req.body;
  const user = await prisma.user.create({
    data: { email, name }
  });
  res.json(user);
});

// Get all posts
app.get('/posts', async (req, res) => {
  const posts = await prisma.post.findMany({
    include: { 
      author: true,
      category: true 
    }
  });
  res.json(posts);
});

// Create post
app.post('/posts', async (req, res) => {
  try {
    const { title, content, authorId, categoryId } = req.body;
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
        categoryId
      }
    });
    res.json(post);
  } catch (error: any) {
    if (error.code === 'P2003') {
      res.status(400).json({ 
        error: 'Invalid authorId or categoryId. Make sure the user and category exist first.' 
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Update post
app.put('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { published } = req.body;
  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: { published }
  });
  res.json(post);
});

// Delete post
app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.delete({
    where: { id: Number(id) }
  });
  res.json(post);
});

// Get all categories
app.get('/categories', async (req, res) => {
  const categories = await prisma.category.findMany({
    include: { posts: true }
  });
  res.json(categories);
});

// Create category
app.post('/categories', async (req, res) => {
  const { name } = req.body;
  const category = await prisma.category.create({
    data: { name }
  });
  res.json(category);
});

// Delete all posts
app.delete('/posts', async (req, res) => {
  const result = await prisma.post.deleteMany({});
  res.json({ message: `Deleted ${result.count} posts` });
});

// Delete all users
app.delete('/users', async (req, res) => {
  const result = await prisma.user.deleteMany({});
  res.json({ message: `Deleted ${result.count} users` });
});

// Delete all categories
app.delete('/categories', async (req, res) => {
  const result = await prisma.category.deleteMany({});
  res.json({ message: `Deleted ${result.count} categories` });
});

// Get all comments
app.get('/comments', async (req, res) => {
  const comments = await prisma.comment.findMany({
    include: { 
      author: true,
      post: true 
    }
  });
  res.json(comments);
});

// Create comment
app.post('/comments', async (req, res) => {
  try {
    const { content, postId, authorId } = req.body;
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId
      },
      include: {
        author: true,
        post: true
      }
    });
    res.json(comment);
  } catch (error: any) {
    if (error.code === 'P2003') {
      res.status(400).json({ 
        error: 'Invalid postId or authorId. Make sure the post and user exist first.' 
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Delete all comments
app.delete('/comments', async (req, res) => {
  const result = await prisma.comment.deleteMany({});
  res.json({ message: `Deleted ${result.count} comments` });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Dev Server Changes 1 running on http://localhost:${PORT}`);
  console.log(`Dev-Fahath Server running on http://localhost:${PORT}`);
});