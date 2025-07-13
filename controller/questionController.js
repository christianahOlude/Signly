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
    const { options, correctOptionIndex, videoUrl, difficulty } = req.body;

    if (!videoUrl) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: 'imageUrl is required'
        });
    }

    if (!Array.isArray(options) || options.length !== 4) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: 'Exactly 4 options are required'
        });
    }

    if ( typeof correctOptionIndex !== 'number' || correctOptionIndex < 0 || correctOptionIndex > 3 ) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: 'correctOptionIndex must be an integer between 0 and 3'
        });
    }

    try {
        const question = await Question.create({
            videoUrl,
            difficulty,
            options: [],
            correctOption: null,
            isActive: true
        });

        // 3) Create each Option, marking the correct one
        const createdOptions = await Promise.all(
            options.map((opt, idx) => {
                return Option.create({
                    questionId: question._id,
                    text: opt.text,
                    isCorrect: idx === correctOptionIndex
                });
            })
        );

        // 4) Link options back into the question and save
        question.options       = createdOptions.map(o => o._id);
        question.correctOption = createdOptions[correctOptionIndex]._id;
        await question.save();

        // 5) Populate and return
        const populated = await Question.findById(question._id)
            .populate('options')
            .populate('correctOption')
            .lean();

        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: 'Question created successfully',
            question: populated
        });

    } catch (error) {
        console.error('Create question error:', error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to create question',
            error: error.message
        });
    }
};