import { prisma } from '@/config';
import { Hotel } from '@prisma/client';

async function findHotels(): Promise<Hotel[]> {
    return prisma.hotel.findMany();
}

async function findHotelById(id: number): Promise<Hotel | null> {
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
    findHotelById
};

export default hotelsRepository;