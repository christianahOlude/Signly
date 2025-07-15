import User from '../models/User.js';
import mongoose from "mongoose";

const HTTP_STATUS = {
    OK: 200,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

export const getUserScores = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'User not found' });
    }

    try {
        const user = await User.findById(userId);
        if(!user) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'User not found', user: user })


        const summary = user.getScoreSummary();

        res.status(HTTP_STATUS.OK).json({ success: true, data: summary });

    } catch (error) {
        console.error('Get user scores error:', error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch user scores'
        });
    }
};