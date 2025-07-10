import User from '../models/User';

const HTTP_STATUS = {
    NotFound: 404,
    OK: 200,
    InternalServerError: 500
};

const MESSAGES = {
    UserNotFound: 'User not found'
};

export const addScore = async (req, res) => {
    const { userId } = req.params;
    const { score } = req.body;

    try{
        const user = await User.findById(userId);
        if(!user) return res.status(HTTP_STATUS.NotFound, MESSAGES.UserNotFound);
        await user.addScore(score);
        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Score added successfully',
            score: user.scores
        });
    } catch (error) {
        res.status(HTTP_STATUS.InternalServerError).json({
            message: 'Failed to add score'
        });
    }
};
