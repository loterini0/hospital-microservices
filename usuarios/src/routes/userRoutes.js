const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/userController');
const { validateCreateUser, validateUpdateUser } = require('../middlewares/validateUser');
const { validateGateway } = require('../middlewares/validateGateway');

router.use(validateGateway);

router.get('/',       controller.getUsers);
router.get('/:id',    controller.getUserById);
router.post('/',      validateCreateUser,  controller.createUser);
router.put('/:id',    validateUpdateUser,  controller.updateUser);
router.delete('/:id', controller.deleteUser);

module.exports = router;