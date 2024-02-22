import { prisma } from '@/config';
import { Room } from '@prisma/client';

async function findRoomById(roomId: number) {
    return prisma.room.findMany({
        where: {
            id: roomId
        },
        include: {
            Booking: true
        }
    });
}

const roomRepository = {
    findRoomById
};

export default roomRepository;