import express, { IRouter } from 'express';
import { getForex } from '../controllers/forex';

const router: IRouter = express.Router();
router.get('/forex', getForex);

export = router;