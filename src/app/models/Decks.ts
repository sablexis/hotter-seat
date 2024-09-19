import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },

});

const DeckSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    cards: [CardSchema],
})

export const Card = mongoose.models.Card || mongoose.model('Card', CardSchema);
export const Deck = mongoose.models.Deck || mongoose.model('Deck', DeckSchema);