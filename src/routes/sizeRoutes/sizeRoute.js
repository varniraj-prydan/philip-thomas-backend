const express = require('express');
const router = express.Router();
const sizeController = require('../../controller/sizeController'); // Adjust the path as needed

router.post('/sizes', sizeController.createSize);
router.get('/sizes', sizeController.getSizes);
router.get('/sizes/:id', sizeController.getSizeById);
router.put('/sizes/:id', sizeController.updateSize);
router.delete('/sizes/:id', sizeController.deleteSize);

module.exports = router;