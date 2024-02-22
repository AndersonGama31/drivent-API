import { prisma } from '@/config';
import { Booking } from '@prisma/client';

async function findBookingByUserId(userId: number): Promise<Booking> {
    return prisma.booking.findFirst({
        where: { userId },
        include: {
            Room: true,
        }
    });
}

async function createBooking(userId: number, roomId: number) {
    return prisma.booking.create({
        data: {
            userId,
            roomId,
        },
    });
}

const bookingRepository = {
    findBookingByUserId,
    createBooking
};

export default bookingRepository;
