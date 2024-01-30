require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB (make sure MongoDB is running)
mongoose.connect(process.env.CONN_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Todo schema and model
const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);

// Read all todos
app.get('/api/todos', async (req, res) => {
    try {
      const todos = await Todo.find();
      res.json(todos);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching todos' });
    }
  });
  
  // Create a new todo
  app.post('/api/todos', async (req, res) => {
    const { text } = req.body;
  
    try {
      const newTodo = new Todo({ text, completed: false });
      await newTodo.save();
      res.json(newTodo);
    } catch (error) {
      res.status(500).json({ error: 'Error adding todo' });
    }
  });
  
  // Update a todo
  app.put('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;
  
    try {
      const updatedTodo = await Todo.findByIdAndUpdate(id, { text, completed }, { new: true });
      res.json(updatedTodo);
    } catch (error) {
      res.status(500).json({ error: 'Error updating todo' });
    }
  });
  
  // Delete a todo
  app.delete('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await Todo.findByIdAndDelete(id);
      res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting todo' });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
