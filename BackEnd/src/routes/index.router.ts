import express, { Router, Request, Response, NextFunction } from "express";

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    res.send('Тебе тут не рады');
});

export default router;
