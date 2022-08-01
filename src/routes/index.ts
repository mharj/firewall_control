import { Router } from 'express';
import { route as firewallRoute } from './firewall';
import { route as statusRoute } from './status';
const router = Router();

router.use('/firewall', firewallRoute);
router.use('/status', statusRoute);

export const routes = router;
