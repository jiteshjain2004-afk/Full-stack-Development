import Card from "../models/card.js";

// ✅ GET all cards
export const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET card by ID
export const getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) return res.status(404).json({ message: "Card not found" });

    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ POST create card
export const createCard = async (req, res) => {
  try {
    const { name, suit, value, rarity } = req.body;

    const newCard = await Card.create({ name, suit, value, rarity });

    res.status(201).json({
      message: "✅ Card created successfully",
      card: newCard,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ PUT update card
export const updateCard = async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCard)
      return res.status(404).json({ message: "Card not found" });

    res.json({
      message: "✅ Card updated successfully",
      card: updatedCard,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ DELETE card
export const deleteCard = async (req, res) => {
  try {
    const deletedCard = await Card.findByIdAndDelete(req.params.id);

    if (!deletedCard)
      return res.status(404).json({ message: "Card not found" });

    res.json({
      message: "✅ Card deleted successfully",
      card: deletedCard,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
