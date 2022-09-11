const mongoose = require('mongoose')
const { Schema, model } = mongoose

module.exports = model("Ticket", new Schema({
    userID: String,
    ticketID: String,
    category: String,
    headstaff: Boolean
}))