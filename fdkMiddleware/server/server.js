const axios = require('axios');

exports = {

  // args is a JSON block containing the payload information.
  // args['iparam'] will contain the installation parameter values.
  onTicketCreateHandler: async function(args) {
    console.log('Hello ' + args['data']['requester']['name']);
    const response = await axios.get("http://localhost:3000/");
    console.log(response.data);
  }

};
