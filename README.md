## Events
#### `onAppInstall` Event

When the onAppInstall event is triggered, the middleware performs the following actions:

- #### Field Mapping: 
    
    - Passes the maps of Freshservice and Freshdesk fields to the Node.js server.

- #### Database Operations:
    - Based on the provided field map, it creates a MySQL table called Tickets. If the table already exists, the middleware creates a backup of the existing table before dropping and recreating the new table with updated fields.

- ## How It Works:
-   #### Event Trigger:

    - The event is triggered when the app is installed in Freshservice

    - Field Mapping:

        - A map of Freshservice fields and Freshdesk fields is passed to the Node.js server.

        - These field maps are used to define the columns in the Tickets table.

- #### MySQL Table Creation:

    - The app connects to the MySQL server and checks if the Tickets table exists.

    -   #### If the table exists:

        - It creates a backup of the existing table (renaming the table to Tickets_backup_<timestamp>).

        - Drops the old Tickets table.

    - A new Tickets table is created based on the provided field mappings.


#### `onTicketCreate` Event
When the `onTicketCreate` event is triggered in the serverless Freshservice application, the middleware performs the 
following actions:

- Field Filtering

    - Filters out fields based on the map of Freshdesk and   Freshservice fields stored in the `iparams`.
    
    -   The serverless app appends the email id field to the ticket, where the value is the requester’s email id.

- Ticket Forwarding

    - The filtered ticket, containing only the selected fields, is sent to the Node.js server.
- ## How It Works

-   #### Field Filtering and Email Append
    - The serverless application filters the ticket fields according to the field mappings stored in iparams for Freshservice and Freshdesk.
    - The email id field is added to the ticket, with the value set to the requester's email address.
- #### Sending to Node.js Server
    - The filtered ticket, now with the necessary fields, is sent to the Node.js server for further processing.
- #### MySQL Table Check and Alteration
    - The Node.js server checks the Tickets table for the columns `email` and `pushed_to_freshdesk`.
    - If these columns do not exist:
        - The Tickets table is altered to include the `email` and `pushed_to_freshdesk` columns.
    - The ticket is then stored in the `Tickets` table.
