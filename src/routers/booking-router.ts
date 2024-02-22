import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createBooking, getBooking } from '@/controllers/booking-controller';
import { bookingSchema } from '@/schemas/booking-schema';

const bookingRouter = Router();

bookingRouter
    .all('/*', authenticateToken)
    .get('/', getBooking)
    .post('/', validateBody(bookingSchema), createBooking)
    .put('/', validateBody, (req, res) => res.send('updateBooking'))


export { bookingRouter };
