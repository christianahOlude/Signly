import User from '../models/User.js';

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500
}

export const register = async (req, res) => {
    const { userName } = req.body;

    if (!userName) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: 'Username is required'
        });
    }

    try {
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Username already exists'
            });
        }

        const newUser = new User({ userName })
        await newUser.save();

        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: `${ newUser.userName }, registered successfully`,
            user: newUser.toObject
        });

    } catch (error) {
        console.error(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
};