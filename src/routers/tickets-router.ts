import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { ticketsSchema } from '@/schemas/tickets-schemas';
import { createTicket, getTicketTypes, getTickets } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get('/types', getTicketTypes)
    .get('/', getTickets)
    .post('/', validateBody(ticketsSchema), createTicket);

export { ticketsRouter };
