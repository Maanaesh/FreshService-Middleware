import express from "express";
import { CreateTable, createTicket, hello } from "../controller/ticketController.js";
const router = express.Router();

router.post("/createTickets",createTicket);
router.get("/hello",hello);
router.post("/storeFieldMap",CreateTable);
export default router;