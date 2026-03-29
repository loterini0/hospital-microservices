const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/notificationController');
const { validateCreateNotification } = require('../middlewares/validateNotification');

router.get('/',                      controller.getNotifications);
router.get('/user/:user_id',         controller.getNotificationsByUser);
router.post('/',                     validateCreateNotification, controller.createNotification);
router.put('/:id/read',              controller.markAsRead);
router.delete('/:id',                controller.deleteNotification);

module.exports = router;