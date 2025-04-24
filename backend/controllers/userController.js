const User = require('../models/User');
const Review = require('../models/Review');

// get user
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile' });
    }
};

// update user
exports.updateUser = async (req, res) => {
    try {
        if (req.params.id !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this profile' });
        }

        const { username, bio, profilePicture } = req.body;

        if (username) {
            const existingUser = await User.findOne({ username, _id: { $ne: req.user._id } });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already taken' });
            }
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    ...(username && { username }),
                    ...(bio && { bio }),
                    ...(profilePicture && { profilePicture })
                }
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error updating profile' });
    }
};

// get reviews
exports.getUserReviews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const reviews = await Review.find({ userId: req.params.id })
            .populate('bookId', 'title author coverImage')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Review.countDocuments({ userId: req.params.id });

        res.json({
            reviews,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalReviews: total
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user reviews' });
    }
};

