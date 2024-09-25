const axios = require('axios');

exports = {

  onAppInstallHandler: async function(args) {
    try {
      const map = args.iparams.fieldmap;
      const FD_fields = Object.values(map);
      const response = await axios.post(`http://localhost:5001/api/tickets/storeFieldMap`, {
        map,
        FD_fields
      });

      console.log('Field map sent on app install:', response.status);
    } catch (error) {
      console.log('Error during app install:');
    }
  },

  onTicketCreateHandler: async function(args) {
    const jsonObj = {};
    const map = args.iparams.fieldmap;
    const FS_fields = Object.keys(map); // Get FS_fields from map

    if (args.data && args.data.ticket) {
      // Iterate through FS_fields to extract corresponding ticket fields
      FS_fields.forEach((field) => {
        const fieldNameLower = field.toLowerCase(); // Make the field lowercase for case-insensitive comparison

        // Find matching ticket fields
        const ticketKeys = Object.keys(args.data.ticket).map(key => key.toLowerCase());

        if (ticketKeys.includes(fieldNameLower)) {
          jsonObj[fieldNameLower] = args.data.ticket[fieldNameLower];
        } else {
          console.log(`Field ${field} does not exist in ticket data.`);
        }
      });
    } else {
      console.error("Invalid selectedFields or ticket data.");
    }

    jsonObj["email"] = args.data.requester.email;

    try {
      const response = await axios.post(`http://localhost:5001/api/tickets/createTickets/`, {
        FS_fields: jsonObj 
      });
      console.log('Success:', response.status, response?.data);
    } catch (error) {
      console.log('Error Response:', error.response?.status, error.response?.data);
    }
  }
};
