import ticketModel from '../dao/models/ticket.model.js';

class TicketService {
  async createTicket(data) {
    const code = `TICKET-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    return await ticketModel.create({ ...data, code });
  }
}

export const ticketService = new TicketService();