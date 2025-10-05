import { Router } from 'express';
import { registerDevice, listDevices } from '../controller/deviceController.js';

const router = Router();

router.post('/register', registerDevice);
router.get('/', listDevices);

export default router;


