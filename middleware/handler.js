import axios from "axios";
import cron from "node-cron";
import Ticket from "./ticket.js";

export default function handler(key, url) {
  cron.schedule('*/5 * * * *', async () => {
    console.log("running every 10sec");
    console.log("_____________________________", key, url);
    
    // Find all tickets that haven't been pushed to Freshdesk yet
    const ticketsToPush = await Ticket.find({ pushed_to_freshdesk: false });
    console.log("tkt",ticketsToPush);

    ticketsToPush.forEach(async (ticket) => {
      try {
        console.log("inside try");
        const response = await axios.post(`${url}/api/v2/tickets`, {
          subject: ticket.subject,
          description: ticket.description,
          status: ticket.status,
          priority: 1,
          email: ticket.email,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
          auth: {
            username: key,
            password: 'X',
          },
        });
        if (response.status === 200) {
          await Ticket.updateOne({ _id: ticket._id }, { pushed_to_freshdesk: true });
          console.log(`Ticket ${ticket._id} pushed successfully.`);
        }
      } catch (error) {
        console.error(`Error pushing ticket ${ticket._id}:`, error);
      }
    });
  });
}
