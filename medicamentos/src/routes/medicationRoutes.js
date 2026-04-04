const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/medicationController');
const { validateGateway }          = require('../middlewares/validateGateway');
const { validateCreateMedication, validateUpdateStock } = require('../middlewares/validateMedication');

router.use(validateGateway);

router.get('/',           controller.getMedications);
router.get('/:id',        controller.getMedicationById);
router.post('/',          validateCreateMedication, controller.createMedication);
router.put('/:id',        controller.updateMedication);
router.patch('/:id/stock',validateUpdateStock, controller.updateStock);
router.delete('/:id',     controller.deleteMedication);

module.exports = router;