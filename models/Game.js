import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    }],

    score: {
        type: Number,
        default: 0,
        min: 0
    }
});

gameSchema.methods.getScore = function() {
    return this.score;
};

const Game = mongoose.model('Game', gameSchema);
export default Game;