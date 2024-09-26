
# FreshService Middleware

A Middleware application that stores FreshService tickets and Creates a replica of the same in FreshDesk




## API Reference

#### Get FreshService URL 🔗 & KEY 🔑

```http
  GET /api/FreshService/
```

#### Create Ticket 🎟️

```http
  POST /api/Tickets/createTickets
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `FS_fields`      | `JSON` | **Required**. FreshServiceTicket data |

#### Create Table 

```http
  POST /api/Tickets/storeFieldMap
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `map`      | `JSON` | **Required**. FreshDesk and FreshService ticket map |
| `FD_Fields`      | `JSON` | **Required**. FreshDesk Field names |







## Environment Variables

To run this project, you will need to add the following environment variables to your .env file.
also check out the `sample.env` file

`PORT`

`FRESHDESK_API`


`DB_PASSWORD`

`DB_NAME`

`FRESHDESK_URL`

`FS_URL`

`FS_API`

## Run the middleware Locally

Clone the project

```bash
  git clone https://github.com/Maanaesh/FreshService-Middleware.git
```

Go to the project directory

```bash
  cd FreshService-Middleware
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

server should return something like this 
```bash
MySQL pool created
Database connected successfully
Middleware listening on port 5001
```

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
 
 # `handler.js` - Scheduled Ticket Pusher to Freshdesk

The `handler.js` file is responsible for automating the process of pushing unsynchronized tickets from the local SQL database to Freshdesk using their API. It is designed to run periodically using the `cron` module, ensuring that any new or unsynced tickets are submitted to Freshdesk.

## Key Features

1. **Cron Scheduling**:
   - The system runs a scheduled task every 30 seconds (`*/30 * * * * *`) to check for tickets in the local database that haven't been pushed to Freshdesk yet.
   - The scheduling is done using the `node-cron` library.

2. **Fetching Tickets**:
   - It connects to the SQL database using a `getConnection()` method and queries the `Tickets` table to fetch all tickets where the `pushed_to_freshdesk` field is set to `0`.
   - This ensures only the tickets that haven't been synchronized with Freshdesk are picked.

3. **Formatting Tickets**:
   - The ticket data from the SQL database is formatted to match Freshdesk's API requirements by converting field names to lowercase (except for the `pushed_to_freshdesk` field, which is omitted from the request).
   - This ensures the ticket data is properly structured for submission.

4. **Pushing Tickets to Freshdesk**:
   - For each ticket, a POST request is made to Freshdesk's API (`/api/v2/tickets`) using `axios`, including the API key in the headers for authentication.
   - If the ticket is successfully created (HTTP status `201`), the system marks the ticket as pushed in the local database by updating the `pushed_to_freshdesk` field to `1`.

5. **Error Handling**:
   - The system catches and logs any errors that occur during the ticket submission process. This ensures that failures are tracked and can be debugged easily.

## Function Breakdown

### `handler(key, url)`

- **Parameters**:
  - `key`: Your Freshdesk API key, used for authenticating API requests.
  - `url`: The base URL for your Freshdesk instance, e.g., `https://yourcompany.freshdesk.com`.
  
- **Description**:
  - This function starts a cron job that runs every 30 seconds.
  - It fetches tickets that haven't been pushed to Freshdesk, formats them, and pushes them using the Freshdesk API.

### Example Flow

1. Fetch unsynced tickets from the local database.
2. For each ticket:
   - Convert field names to lowercase and exclude the `pushed_to_freshdesk` field.
   - Push the ticket to Freshdesk using an HTTP POST request.
   - On success, mark the ticket as pushed in the local database by updating `pushed_to_freshdesk` to `1`.

### Dependencies

- **axios**: For making HTTP requests to the Freshdesk API.
- **node-cron**: For scheduling periodic tasks (to check and push tickets).
- **SQL Connection**: This uses the `getConnection()` method from the `db.js` file to interact with the SQL database.

---

 

## Scope of Improvements


1. **Bulk Upload of Tickets**:
   - The current implementation uploads tickets to Freshdesk one at a time via individual API calls. This approach can be inefficient for a large volume of tickets. There is a need to implement a bulk upload mechanism that uploads multiple tickets to Freshdesk in a single API call. This can significantly reduce API request overhead and improve performance, especially when importing tickets from an SQL server.

2. **Handling SQL Data Types**:
   - SQL server currently assumes all ticket fields as strings, except for the `status` and `priority` fields. However, Freshdesk ticket fields might have different data types (e.g., dates, numbers, booleans). The implementation should be improved by fetching and dynamically applying the correct field types when processing ticket data from SQL to ensure consistency with Freshdesk’s ticket schema.

## Screenshot
- #### installation page 
  <img width="1144" alt="image" src="https://github.com/user-attachments/assets/77dee50c-95af-420a-a583-8b259e157284">


