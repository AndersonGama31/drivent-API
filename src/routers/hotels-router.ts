import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotelsWithRooms, getHotels } from '@/controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter
    .all('/*', authenticateToken)
    .get('/', getHotels)
    .get('/:hotelId', getHotelsWithRooms)

export { hotelsRouter };
