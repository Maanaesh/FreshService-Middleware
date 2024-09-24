import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import Ticket from './ticket.js';
import handler from './handler.js';

dotenv.config();  // Load environment variables from .env file

const app = express();
app.use(express.json());
const port = 3000;
const FRESHDESK_KEY='GNqXIlHkv2vmPWhxg6zE';
const FRESHDESK_URL='https://effy-opinyin.freshdesk.com';


// POST request to update key and url
app.post("/api/createTickets", async (req, res) => {
  const ticket = req.body.ticket;
  
  ticket.pushed_to_freshdesk = false;
  console.log(ticket);

  // const existingTicket = await Ticket.findOne({ ticket_id: ticket.id });
  const existingTicket = false;
  if (existingTicket) {
    return res.status(409).json({ message: 'Ticket already exists' });
  }

  await Ticket.create(ticket);

 
  // process.env.FRESHDESK_KEY = freshdeskKey;
  // process.env.FRESHDESK_URL = freshdeskUrl;

  res.status(200).json({ message: 'Ticket stored successfully' });
});

app.get("/", async (req, res) => {
  return res.status(200).json({ message: "hello!" });
});

app.listen(port, () => {
  connectDB();
  console.log(`Middleware listening on port ${port}`);
  
  handler(FRESHDESK_KEY, FRESHDESK_URL);
});
