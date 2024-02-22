import { notFoundError } from "@/errors";
import { cannotBookRoomError } from "@/errors/cannot-book-room-error";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import roomRepository from "@/repositories/room-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { Booking } from "@prisma/client";

async function confirmIfUserCanBook(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
        throw notFoundError();
    }
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

    if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
        throw cannotBookRoomError();
    }
}

async function getBooking(userId: number): Promise<Booking> {
    await confirmIfUserCanBook(userId);

    const booking = await bookingRepository.findBookingByUserId(userId);

    if (!booking) throw notFoundError();

    return booking
}

async function createBooking(userId: number, roomId: number): Promise<Booking> {
    await confirmIfUserCanBook(userId);

    const [room] = await roomRepository.findRoomById(roomId);
    if (!room) throw notFoundError();
    if (room.Booking.length >= room.capacity) throw cannotBookRoomError();

    const bookingExists = await bookingRepository.findBookingByUserId(userId);
    if (bookingExists) throw cannotBookRoomError();

    const booking = await bookingRepository.createBooking(userId, roomId);

    return booking
}

const bookingService = { getBooking, createBooking };

export default bookingService;