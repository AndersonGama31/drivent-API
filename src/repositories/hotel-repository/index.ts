import { prisma } from '@/config';
import { Hotel } from '@prisma/client';

async function findHotels() {
    return prisma.hotel.findMany();
}

async function findRoomsByHotelId(id: number) {
    return prisma.hotel.findUnique({
        where: {
            id,
        },
        include: {
            Rooms: true,
        }
    });
}

const hotelsRepository = {
    findHotels,
    findRoomsByHotelId
};

export default hotelsRepository;