const Notification = require('../models/notificationModel');

const getNotifications = async (req, res) => {
    const notifications = await Notification.find();
    res.json(notifications);
};

const getNotificationsByUser = async (req, res) => {
    const notifications = await Notification.find({ user_id: req.params.user_id });
    if (notifications.length === 0) {
        return res.status(404).json({ message: 'No notifications found for this user' });
    }
    res.json(notifications);
};

const createNotification = async (req, res) => {
    const { user_id, type, message } = req.body;
    const notification = new Notification({ user_id, type, message });
    await notification.save();
    res.status(201).json(notification);
};

const markAsRead = async (req, res) => {
    const notification = await Notification.findByIdAndUpdate(
        req.params.id,
        { read: true },
        { new: true }
    );
    if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
};

const deleteNotification = async (req, res) => {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted successfully' });
};

module.exports = { getNotifications, getNotificationsByUser, createNotification, markAsRead, deleteNotification };