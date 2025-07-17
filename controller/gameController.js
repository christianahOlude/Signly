import Game from '../models/Game.js';
import Question from '../models/Question.js';

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

// Number of questions per game (currently one question with four options)
const QUESTIONS_PER_GAME = 1;

// Start a new game and return the single question
export const createGame = async (req, res) => {
    const { userId } = req.params;
    try {
        // Sample exactly one active question
        const [sampledQuestion] = await Question.aggregate([
            { $match: { isActive: true } },
            { $sample: { size: QUESTIONS_PER_GAME } }
        ]);

        if (!sampledQuestion) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'No active questions available'
            });
        }

        // Create the game with a single question
        const game = await Game.create({
            user: userId,
            questions: [{ question: sampledQuestion._id }],
            answer: 0
        });

        // Populate the question and its options
        const question = await Question.findById(sampledQuestion._id).populate('options');

        res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: 'Game created successfully',
            gameId: game._id,
            question: {
                id: question._id,
                questionVideoUrl: question.questionVideoUrl,
                options: question.options.map(o => ({ id: o._id, text: o.text }))
            }
        });
    } catch (error) {
        console.error('Create game error:', error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to create game',
            error: error.message
        });
    }
};

export const getNextQuestion = async (req, res) => {
    const { gameId } = req.params;
    try {
        const game = await Game.findById(gameId);
        if (!game || game.status !== 'in-progress') {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Game not available or already completed'
            });
        }

        const index = game.answer;
        if (index >= game.questions.length) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'No more questions'
            });
        }

        const questionId = game.questions[index].question;
        const question = await Question.findById(questionId).populate('options');

        // advance index
        game.answer++;
        await game.save();

        res.status(HTTP_STATUS.OK).json({
            success: true,
            question: {
                id: question._id,
                questionVideoUrl: question.questionVideoUrl,
                options: question.options.map(o => ({ id: o._id, text: o.text }))
            }
        });
    } catch (error) {
        console.error('Get next question error:', error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch next question',
            error: error.message
        });
    }
};

export const submitAnswer = async (req, res) => {
    const { gameId, questionId } = req.params;
    const { answerId, timeSpent } = req.body;

    try {
        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: 'Game not found'
            });
        }

        if (game.status !== 'in-progress') {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Game is not in progress'
            });
        }

        // Delegate scoring and state update to the model method
        await game.submitAnswers(questionId, answerId, timeSpent);

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Answer submitted successfully',
            currentScore: game.totalScore
        });
    } catch (error) {
        console.error('Submit answer error:', error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to submit answer',
            error: error.message
        });
    }
};

export const finishGame = async (req, res) => {
    const { gameId } = req.params;
    try {
        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: 'Game not found'
            });
        }

        if (game.status === 'completed') {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Game is already completed'
            });
        }

        await game.completeGame();
        const stats = game.getGameStatistics();

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Game completed successfully',
            stats
        });
    } catch (error) {
        console.error('Finish game error:', error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to finish game',
            error: error.message
        });
    }
};

export const getGameStats = async (req, res) => {
    const { gameId } = req.params;
    try {
        const game = await Game.findById(gameId)
            .populate('questions.question')
            .populate('questions.userAnswer');

        if (!game) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: 'Game not found'
            });
        }

        const stats = game.getGameStatistics();

        res.status(HTTP_STATUS.OK).json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Get game stats error:', error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to get game statistics',
            error: error.message
        });
    }
};