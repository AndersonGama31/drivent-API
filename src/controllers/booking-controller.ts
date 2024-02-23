import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response> {
    const { userId } = req;

    try {
        const booking = await bookingService.getBooking(userId);
        return res.status(httpStatus.OK).send({
            id: booking.id,
            Room: booking.Room,
        });
    } catch (e) {
        next(e);
    }
}
export async function createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response> {
    const { userId } = req
    const { roomId } = req.body as Record<string, number>;

    if (!roomId) return res.sendStatus(httpStatus.BAD_REQUEST);

    try {
        const booking = await bookingService.createBooking(userId, roomId);
        return res.status(httpStatus.OK).send({
            bookingId: booking.id,
        });
    } catch (e) {
        next(e);
    }
}

export async function changeBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req;
    const { roomId } = req.body as { roomId: number };

    if (!roomId) return res.sendStatus(httpStatus.BAD_REQUEST);
    if (!userId) return res.sendStatus(httpStatus.UNAUTHORIZED);

    try {
        const booking = await bookingService.changeBooking(userId, roomId);
        return res.status(httpStatus.OK).send({
            bookingId: booking.id,
        });
    } catch (e) {
        next(e);
    }
}
