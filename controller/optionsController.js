import Option from '../models/Option.js';

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

export const createOptions = async (req, res) => {
    const { options } = req.body;

    try {
        if (!Array.isArray(options) || options.length !== 4) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Exactly 4 text options are required'
            });
        }

        const createdOptions = await Option.insertMany(
            options.map(text => ({ text }))
        );

        res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: 'Options created successfully',
            options: createdOptions
        });
    } catch (error) {
        console.error('Create options error:', error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to create options',
            error: error.message
        });
    }
};

// Get options by IDs (for retrieving question options)
export const getOptionsByIds = async (req, res) => {
    const { optionIds } = req.body;

    try {
        const options = await Option.find({
            _id: { $in: optionIds },
            isActive: true
        });

        res.status(HTTP_STATUS.OK).json({
            success: true,
            options
        });
    } catch (error) {
        console.error('Get options error:', error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch options',
            error: error.message
        });
    }
};

// Update option text
export const updateOption = async (req, res) => {
    const { optionId } = req.params;
    const { text } = req.body;

    try {
        const option = await Option.findById(optionId);
        
        if (!option) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: 'Option not found'
            });
        }

        option.text = text;
        await option.save();

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: 'Option updated successfully',
            option
        });
    } catch (error) {
        console.error('Update option error:', error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to update option',
            error: error.message
        });
    }
};