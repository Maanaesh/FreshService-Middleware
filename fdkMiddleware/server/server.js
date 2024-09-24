const axios = require('axios');

exports = {

  // args is a JSON block containing the payload information.
  // args['iparam'] will contain the installation parameter values.
  onTicketCreateHandler: async function(args) {
    const jsonObj = {};
    const selectedFields = args.iparams.selectedFields;

    if (args.data && args.data.ticket) {
      selectedFields.forEach((field) => {
        const fieldNameLower = field.name.toLowerCase(); 

        
        const ticketKeys = Object.keys(args.data.ticket).map(key => key.toLowerCase());

       
        if (ticketKeys.includes(fieldNameLower)) {
          jsonObj[fieldNameLower] = args.data.ticket[fieldNameLower];
        } else {
          console.log(`Field ${field.name} does not exist in ticket data.`);
        }
      });
    } else {
      console.error("Invalid selectedFields or ticket data.");
    }

   
    jsonObj["email"] = args.data.requester.email;

    const api_key = args.iparams.key;
    const url = args.iparams.url;

  try {
    // Making the POST request to create a ticket
    const response = await axios.post(`http://localhost:3000/api/createTickets/`,{
      url:url,
      key:api_key,
      ticket:jsonObj,
    });
    console.log('Success:', response.status);

  } catch (error) {
  
    console.log('Error Response:', error.response.status, error.response.data);
    } 
  }

}


