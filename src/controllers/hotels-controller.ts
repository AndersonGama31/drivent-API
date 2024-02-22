import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response> {
    const { userId } = req;
    try {
        const hotels = await hotelsService.getHotels(userId);
        return res.status(httpStatus.OK).send(hotels);
    } catch (e) {
        next(e);
    }
}

export async function getHotelsWithRooms(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response> {
    const { hotelId } = req.params;
    const { userId } = req;

    if (!hotelId) return res.sendStatus(httpStatus.BAD_REQUEST)
    try {
        const hotel = await hotelsService.getHotelsWithRooms(userId, +hotelId);
        return res.status(httpStatus.OK).send(hotel);
    } catch (e) {
        next(e);
    }
}
