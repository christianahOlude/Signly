import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    questions: [{ question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
        userAnswer: { type: mongoose.Schema.Types.ObjectId, ref: 'Option' },
        isCorrect: { type: Boolean, default: false },
        timeSpent: { type: Number, default: 0 },
        pointsEarned: { type: Number, default: 0 }
    }],

    answer: { type: Number, default: 0 },

    totalScore: { type: Number, default: 0 },

    status: { type: String, enum: ['in-progress', 'completed', 'abandoned'], default: 'in-progress' },

    completedAt: { type: Date }

}, { timestamps: true });


gameSchema.methods.submitAnswers = async function(questionId, answerId, timeSpent) {
    const questionEntry = this.questions.find(q => q.question.equals(questionId));
    if (!questionEntry) throw new Error('Question not found in game');

    const QuestionModel = mongoose.model('Question');
    const question = await QuestionModel.findById(questionId);
    const isCorrect = await question.validateAnswer(answerId);

    questionEntry.userAnswer = answerId;
    questionEntry.isCorrect = isCorrect;
    questionEntry.timeSpent = timeSpent;
    questionEntry.pointsEarned = isCorrect ? question.calculatePoints(timeSpent) : 0;

    // Recompute total score
    this.totalScore = this.questions.reduce((sum, q) => sum + (q.pointsEarned || 0), 0);

    return this.save();
};

gameSchema.methods.completeGame = async function() {
    if (this.status !== 'in-progress') throw new Error('Game already finished or abandoned');
    this.status = 'completed';
    this.completedAt = new Date();

    const UserModel = mongoose.model('User');
    const user = await UserModel.findById(this.user);
    if (user && typeof user.addScore === 'function') {
        await user.addScore(this.totalScore);
    }

    return this.save();
};

gameSchema.methods.getGameStatistics = function() {
    const totalQuestions = this.questions.length;
    const answeredQuestions = this.questions.filter(q => q.userAnswer).length;
    const correctAnswers = this.questions.filter(q => q.isCorrect).length;

    const accuracy = totalQuestions
        ? (correctAnswers / totalQuestions * 100).toFixed(2)
        : '0.00';
    const averageTimePerQuestion = answeredQuestions
        ? (this.questions.reduce((sum, q) => sum + q.timeSpent, 0) / answeredQuestions).toFixed(2)
        : '0.00';

    return { totalQuestions, answeredQuestions, correctAnswers, accuracy, totalScore: this.totalScore,
        averageTimePerQuestion
    };
};

const Game = mongoose.model('Game', gameSchema);
export default Game;
