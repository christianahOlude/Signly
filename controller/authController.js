import User from '../models/User.js';

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500
}

export const register = async (req, res) => {
    const { userName: username, password: password } = req.body;

    if (!username || !password) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: 'Username and password are required'
        });
    }

    try {
        const existingUser = await User.findOne({ userName: username });
        if (existingUser) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Username already exists'
            });
        }

        const newUser = new User({userName: username, password: password})
        await newUser.save();

        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: 'User registered successfully',
            user: newUser
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