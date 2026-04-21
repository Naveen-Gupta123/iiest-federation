// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/iiest_federation')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Task Schema
const taskSchema = new mongoose.Schema({
  assignedTo: { type: String, required: true },
  status:     { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
  dueDate:    { type: String },
  priority:   { type: String, enum: ['Low', 'Normal', 'High'], default: 'Normal' },
  comments:   { type: String, default: '' },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

// GET all tasks (with optional search)
app.get('/api/tasks', async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = search
      ? { $or: [
          { assignedTo: new RegExp(search, 'i') },
          { status:     new RegExp(search, 'i') },
          { priority:   new RegExp(search, 'i') },
          { comments:   new RegExp(search, 'i') },
        ]}
      : {};
    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ tasks, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single task
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create task
app.post('/api/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
