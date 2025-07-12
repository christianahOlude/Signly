import Question from '../models/Question.js';
import Option from '../models/Option.js';

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

export const createQuestion = async (req, res) => {
    const { options, correctOptionIndex, imageUrl, difficulty } = req.body;

    try {
        if (!Array.isArray(options) || options.length !== 4) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Exactly 4 options are required'
            });
        }

        if (correctOptionIndex < 0 || correctOptionIndex > 3) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Correct option index must be between 0 and 3'
            });
        }

        // Create all 4 options first
        const createdOptions = await Promise.all(
            options.map(opt => Option.create({
                text: opt.text
            }))
        );

        // Create the question with the options
        const question = await Question.create({
            options: createdOptions.map(opt => opt._id),
            correctOption: createdOptions[correctOptionIndex]._id,
            imageUrl,
            difficulty
        });

        await question.populate('options');
        await question.populate('correctOption');

        res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: 'Question created successfully',
            question
        });
    } catch (error) {
        console.error('Create question error:', error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to create question',
            error: error.message
        });
    }
};