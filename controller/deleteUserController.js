import User from '../models/User.js';

export const deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user || user.isDeleted) {
            return res.status(404).json({ error: 'User not found or already deleted' });
        }

        await user.softDelete();

        res.status(200).json({
            success: true,
            message: 'Account soft-deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to soft-delete account' });
    }
};
