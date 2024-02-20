import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getPaymentByTicketId, paymentProcess } from '@/controllers/payments-controller';

const paymentsRouter = Router();

paymentsRouter
    .all('/*', authenticateToken)
    .get('/', getPaymentByTicketId)
    .post('/process', paymentProcess);

export { paymentsRouter };
