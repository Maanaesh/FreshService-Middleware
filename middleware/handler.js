import axios from "axios";
import cron from "node-cron";
import Ticket from "./ticket.js";

export default function handler(key,url){
    cron.schedule('*/30 * * * * *', async () => {
        console.log("running every 30sec");
        const ticketsToPush = await Ticket.find({ pushed_to_freshdesk: false });
      console.log(ticketsToPush);
        ticketsToPush.forEach(async (ticket) => {
          try {
            const response = await axios.post(`${url}/api/v2/tickets`, {
              subject: ticket.subject,
              description: ticket.description,
              status: 2,
              priority: 1,
              email:ticket.email,
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
              await Ticket.updateOne({ ticket_id: ticket.ticket_id }, { pushed_to_freshdesk: true });
            }
          } catch (error) {
            console.error(`Error pushing ticket ${ticket.ticket_id}:`, error);
          }
        });
      });
}
