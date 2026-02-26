import Card from "../models/Card.js";

// GET all cards (+ filter)
export const getAllCards = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const cards = await Card.find(filter);
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET card by ID
export const getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE card
export const createCard = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body missing" });
    }

    const { name, category, suit, value } = req.body;

    if (!name || !category || !suit || !value) {
      return res.status(400).json({
        message: "name, category, suit, value are required",
      });
    }

    const card = await Card.create({ name, category, suit, value });
    res.status(201).json(card);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE card
export const updateCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json(card);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE card
export const deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.json({ message: "Card deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};