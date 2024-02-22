import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response> {
    const { userId } = req;

    try {
        const booking = await bookingService.getBooking(userId);
        return res.status(httpStatus.OK).send(booking);
    } catch (e) {
        next(e);
    }
}
export async function createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response> {
    const { roomId } = req.body;
    const { userId } = req

    try {
        const booking = await bookingService.createBooking(userId, roomId);
        return res.status(httpStatus.OK).send(booking);
    } catch (e) {
        next(e);
    }
}
