import { notFoundError } from "@/errors";
import { PaymentRequiredError } from "@/errors/payment-required-error";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotel-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { Hotel } from "@prisma/client";



async function findHotel(userId: number): Promise<Hotel[] | null> {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

    if (!ticket) throw notFoundError();
    if (ticket.status !== 'PAID') throw PaymentRequiredError();

    const hotels = await hotelsRepository.findHotels();
    if (!hotels) throw notFoundError();

    return hotels;
}

async function findHotelById(hotelId: number, userId: number): Promise<Hotel | null> {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    const hotels = await hotelsRepository.findHotelById(hotelId);
    if (!hotels) throw notFoundError();

    return hotels;
}

const hotelsService = {
    findHotelById,
    findHotel,
};

export default hotelsService;