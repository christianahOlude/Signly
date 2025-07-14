import User from '../models/User.js';
import mongoose from "mongoose";

const HTTP_STATUS = {
    OK: 200,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

export const getUserScores = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: 'User not found'
            });
        }

        const scoreStats = {
            scores: user.scores,
            highestScore: Math.max(...(user.scores.length ? user.scores : [0])),
            totalGamesPlayed: user.scores.length,
            averageScore: user.scores.length 
                ? (user.scores.reduce((a, b) => a + b, 0) / user.scores.length).toFixed(2)
                : 0
        };

        res.status(HTTP_STATUS.OK).json({
            success: true,
            data: scoreStats
        });

    } catch (error) {
        console.error('Get user scores error:', error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch user scores'
        });
    }
};