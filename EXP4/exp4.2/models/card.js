import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    suit: {
      type: String,
      required: true,
      enum: ["Spades", "Hearts", "Diamonds", "Clubs"],
    },
    value: {
      type: String,
      required: true,
      enum: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
    },
    rarity: {
      type: String,
      required: true,
      enum: ["Common", "Rare", "Legendary"],
    },
  },
  { timestamps: true }
);

const Card = mongoose.model("Card", cardSchema);

export default Card;
