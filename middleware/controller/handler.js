import axios from "axios";
import cron from "node-cron";
import { updatePushedToFreshdesk } from "./sqlController.js";
import { getConnection } from "../config/db.js";

export default async function handler(key, url) {
  const conn = await getConnection();
  cron.schedule('*/30 * * * * *', async () => {
    console.log("running every 5 minutes");
    let ticketsToPush= await conn.query(`SELECT * FROM Tickets where pushed_to_freshdesk=0`);
    ticketsToPush=ticketsToPush[0];
    ticketsToPush.forEach(async (ticket) => {
      const formattedTicket = {};
      Object.keys(ticket).forEach((field)=>{
        if(field!="pushed_to_freshdesk"){
          const key=field.toLowerCase();
          formattedTicket[key]=ticket[field];
        }
      });
      console.log(formattedTicket);
      try{
        const response = await axios.post(`${url}/api/v2/tickets`,formattedTicket,{
          headers: {
            'Content-Type': 'application/json',
          },
          auth: {
            username: key,
            password: 'X',
          },
        });
        if(response.status===201){
          console.log("response:",response.status);
          await updatePushedToFreshdesk(formattedTicket.email,conn);
        }

      }
      catch(error){
        console.error(`Error pushing ticket`, error);
      }
      

    });

  });
}
