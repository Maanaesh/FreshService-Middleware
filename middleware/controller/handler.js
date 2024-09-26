import axios from "axios";
import cron from "node-cron";
import { updatePushedToFreshdesk } from "./sqlController.js";
import { getConnection } from "../config/db.js";

export default async function handler(key, url) {
  const conn = await getConnection();

  cron.schedule('*/5 * * * *', async () => {
    console.log("running every 5 minutes");

    let ticketsToPush = await conn.query(`SELECT * FROM Tickets WHERE pushed_to_freshdesk = 0`);
    ticketsToPush = ticketsToPush[0];

    ticketsToPush.forEach(async (ticket) => {
      const formattedTicket = {};
      formattedTicket.custom_fields = {};

      // Iterate over the ticket fields
      Object.keys(ticket).forEach((field) => {
        if (field !== "pushed_to_freshdesk") {
          const key = field

          // Check if the field starts with 'cf'
          if (key.startsWith("cf")) {
            formattedTicket.custom_fields[key] = ticket[field];
          } else {
            formattedTicket[key] = ticket[field];
          }
        }
      });

      console.log("Formatted ticket:", formattedTicket);

      try {
        const response = await axios.post(`${url}/api/v2/tickets`, formattedTicket, {
          headers: {
            'Content-Type': 'application/json',
          },
          auth: {
            username: key,
            password: 'X',
          },
        });

        if (response.status === 201) {
          console.log("Ticket pushed successfully, status:", response.status);
          await updatePushedToFreshdesk(formattedTicket.email, conn,1);
        }
      } catch (error) {
        //console.log(error.response.data);
        if(error.response.description ==="Validation failed");{
          console.log("Validation failed for ticket:", formattedTicket.email);
          await updatePushedToFreshdesk(formattedTicket.email,conn,10)
        
        }
      }
    });
  });
}
