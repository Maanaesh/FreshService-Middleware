import mongoose from "mongoose";

const ticketSchema= new mongoose.Schema({
    subject: {
        type:String,
        required:true,
    },
    description: {
        type:String,
        required:true,
    },
    status: {
        type:Number,
        required:true,
    },
    created_at: Date,
    pushed_to_freshdesk: Boolean,
    email:{
        type:String,
        required:true,
    },
});
const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;