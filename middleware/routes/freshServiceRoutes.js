import express from "express";
import { getconfig } from "../controller/freshServiceController.js";
const router = express.Router();

router.get("/",getconfig);

export default router;