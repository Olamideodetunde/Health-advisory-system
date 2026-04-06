import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import diagnosisRouter from "./diagnosis";
import sessionsRouter from "./sessions";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(diagnosisRouter);
router.use(sessionsRouter);

export default router;
