import { Router } from 'express';
import { registerDevice, listDevices } from '../controllers/deviceController.js';

const router = Router();

router.post('/register', registerDevice);
router.get('/', listDevices);

export default router;


