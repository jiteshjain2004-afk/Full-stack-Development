const router = require('express').Router();
const Todo   = require('../models/Todo');

// CREATE — POST /api/todos
router.post('/', async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Title is required' });
    const todo = await Todo.create({ title, description, priority });
    res.status(201).json({ success: true, data: todo });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL — GET /api/todos
router.get('/', async (req, res) => {
  try {
    const { completed, priority, search } = req.query;
    const filter = {};
    if (completed !== undefined) filter.completed = completed === 'true';
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: todos.length, data: todos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE — GET /api/todos/:id
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json({ success: true, data: todo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE — PUT /api/todos/:id
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json({ success: true, data: todo });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// TOGGLE COMPLETE — PATCH /api/todos/:id/toggle
router.patch('/:id/toggle', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    todo.completed = !todo.completed;
    await todo.save();
    res.json({ success: true, data: todo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE — DELETE /api/todos/:id
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json({ success: true, message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE ALL COMPLETED — DELETE /api/todos/completed/all
router.delete('/completed/all', async (req, res) => {
  try {
    const result = await Todo.deleteMany({ completed: true });
    res.json({ success: true, deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
