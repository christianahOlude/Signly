import Option from '../models/Option.js';

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

export const createOptions = async (req, res) => {
    const { questionId, options } = req.body;

    // 1) Validate payload
    if (!questionId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: 'questionId is required'
        });
    }
    if (!Array.isArray(options) || options.length !== 4) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: 'Exactly 4 options are required'
        });
    }
    // Ensure exactly one correct answer
    const correctCount = options.filter(opt => opt.isCorrect).length;
    if (correctCount !== 1) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: 'Exactly one option must have isCorrect=true'
        });
    }

    try {
        // 2) Bulk‐create options, attaching questionId
        const docs = options.map(opt => ({
            questionId,
            text:      opt.text,
            isCorrect: Boolean(opt.isCorrect)
        }));
        const createdOptions = await Option.insertMany(docs);

        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: 'Options created successfully',
            options: createdOptions
        });

    } catch (error) {
        console.error('Create options error:', error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to create options',
            error: error.message
        });
    }
};

export const getOptionsByIds = async (req, res) => {
    const { optionIds } = req.body;

    if (!Array.isArray(optionIds) || optionIds.length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: 'optionIds array is required'
        });
    }

    try {
        const options = await Option.find({ _id: { $in: optionIds } }).lean();
        return res.status(HTTP_STATUS.OK).json({
            success: true,
            options
        });

    } catch (error) {
        console.error('Get options error:', error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch options',
            error: error.message
        });
    }
};

export const updateOption = async (req, res) => {
    const { optionId } = req.params;
    const { text, isCorrect } = req.body;

    if (!optionId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: 'optionId is required in URL'
        });
    }

    try {
        const option = await Option.findById(optionId);
        if (!option) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: 'Option not found'
            });
        }

        // Apply updates
        if (typeof text === 'string') option.text = text;
        if (typeof isCorrect === 'boolean') option.isCorrect = isCorrect;

        await option.save();

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Option updated successfully',
            option
        });

    } catch (error) {
        console.error('Update option error:', error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to update option',
            error: error.message
        });
    }
};