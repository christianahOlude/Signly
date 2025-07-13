import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: true
        },
        userAnswer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Option'
        },
        isCorrect: {
            type: Boolean,
            default: false
        },
        timeSpent: {
            type: Number,
            default: 0
        },
        pointsEarned: {
            type: Number,
            default: 0
        }
    }],
    totalScore: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'abandoned'],
        default: 'in-progress'
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

gameSchema.methods.submitAnswer = async function(questionId, answerId, timeSpent) {
    const questionEntry = this.questions.find(question => question.question.equals(questionId));
    if (!questionEntry) throw new Error('Question not found in game');
    
    const question = await mongoose.model('Question').findById(questionId);
    const isCorrect = await question.validateAnswer(answerId);
    
    questionEntry.userAnswer = answerId;
    questionEntry.isCorrect = isCorrect;
    questionEntry.timeSpent = timeSpent;
    questionEntry.pointsEarned = isCorrect ? question.calculatePoints(timeSpent) : 0;
    
    this.totalScore = this.questions.reduce((sum, question) => sum + (question.pointsEarned || 0), 0);
    
    return this.save();
};

gameSchema.methods.finishGame = async function() {
    this.status = 'completed';
    this.completedAt = new Date();

    const user = await mongoose.model('User').findById(this.user);
    await user.addScore(this.totalScore);
    
    return this.save();
};

gameSchema.methods.getGameStats = function() {
    const totalQuestions = this.questions.length;
    const answeredQuestions = this.questions.filter(question => question.userAnswer).length;
    const correctAnswers = this.questions.filter(question => question.isCorrect).length;
    
    return { totalQuestions, answeredQuestions, correctAnswers,
        accuracy: totalQuestions ? (correctAnswers / totalQuestions * 100).toFixed(2) : 0,
        totalScore: this.totalScore,
        averageTimePerQuestion: answeredQuestions ? 
            (this.questions.reduce((sum, question) => sum + question.timeSpent, 0) / answeredQuestions).toFixed(2) : 0
    };
};

const Game = mongoose.model('Game', gameSchema);
export default Game;