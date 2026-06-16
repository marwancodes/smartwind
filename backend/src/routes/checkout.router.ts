import { Router } from "express";
import { confirmCheckout, createCheckout } from "../controllers/checkout.controller";

const router = Router();


router.post("/", createCheckout);
router.post("/confirm", confirmCheckout);

export default router;