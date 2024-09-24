import express from 'express';
const app = express();
import { connectDB } from './db.js';
import Ticket from './ticket.js';
import handler from './handler.js';
app.use(express.json());
const port=3000;
const url="https://effy-opinyin.freshdesk.com";
const key="GNqXIlHkv2vmPWhxg6zE";

app.post("/api/createTickets",async (req,res)=>{
    const ticket=req.body;
    // const existingTicket = await Ticket.findOne({ ticket_id: ticket.id });
    const existingTicket=false;
  if (existingTicket) {
    return res.status(409).json({ message: 'Ticket already exists' });
  }
  await Ticket.create({
    subject: ticket.subject,
    description: ticket.description,
    status: 2,
    created_at: ticket.created_at,
    pushed_to_freshdesk: false,
    email:ticket.email,
  });
  res.status(200).json({ message: 'Ticket stored successfully' });
});

app.get("/",async(req,res)=>{
    return res.status(200).json({message:"hello!"});
});



app.listen(port, () => {
    connectDB();
    console.log(`Middleware listening on port ${port}`)});
    handler(key,url);
