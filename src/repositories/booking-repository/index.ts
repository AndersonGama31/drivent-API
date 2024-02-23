import { prisma } from '@/config';
import { Booking } from '@prisma/client';

async function findBookingByUserId(userId: number) {
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

async function findByRoomId(roomId: number) {
    return prisma.booking.findMany({
        where: { roomId },
    });
}

async function upsertBooking({ id, roomId, userId }: { id: number, roomId: number, userId: number }) {
    return prisma.booking.upsert({
        where: { id },
        create: { userId, roomId },
        update: { roomId },
    });
}


const bookingRepository = {
    findBookingByUserId,
    createBooking,
    findByRoomId,
    upsertBooking
};

export default bookingRepository;
