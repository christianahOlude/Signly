import Game from '../models/Game.js';
import Question from '../models/Question.js';

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

export const createGame = async (req, res) => {
    const { userId } = req.params;
    try {
        // First check total questions available
        const totalQuestions = await Question.countDocuments();
        console.log(`Total questions in database: ${totalQuestions}`);

        if (totalQuestions === 0) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'No questions available in the database'
            });
        }

        // Get random questions from the database
        const questions = await Question.aggregate([
            { $match: { isActive: true } },
            { $sample: { size: 4 } }
        ]);

        if (questions.length === 0) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'No active questions available'
            });
        }

        const game = await Game.create({
            user: userId,
            questions: questions.map(question => ({ question: question._id }))
        });

        res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: 'Game created successfully',
            gameId: game._id,
            questionCount: questions.length
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

        await game.submitAnswer(questionId, answerId, timeSpent);

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

        await game.finishGame();
        const stats = game.getGameStats();

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

        const stats = game.getGameStats();

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