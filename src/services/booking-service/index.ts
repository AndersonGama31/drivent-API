import { notFoundError } from "@/errors";
import { badRequestError } from "@/errors/bad-request-error";
import { cannotBookRoomError } from "@/errors/cannot-book-room-error";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import roomRepository from "@/repositories/room-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { Booking, Room } from "@prisma/client";

async function confirmIfUserCanBook(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw cannotBookRoomError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

    if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
        throw cannotBookRoomError();
    }
}

async function checkValidBooking(roomId: number) {
    const [room] = await roomRepository.findRoomById(roomId);
    const bookings = await bookingRepository.findByRoomId(roomId);

    if (!room) throw notFoundError();

    if (room.capacity <= bookings.length) throw cannotBookRoomError();
}

async function getBooking(userId: number): Promise<Booking & { Room: Room }> {
    await confirmIfUserCanBook(userId);

    const booking = await bookingRepository.findBookingByUserId(userId);

    if (!booking) throw notFoundError();

    return booking
}

async function createBooking(userId: number, roomId: number): Promise<Booking> {
    await confirmIfUserCanBook(userId);
    await checkValidBooking(roomId);

    const booking = await bookingRepository.createBooking(userId, roomId);

    return booking
}

async function changeBooking(userId: number, roomId: number) {
    if (!roomId) throw badRequestError();

    await checkValidBooking(userId);
    const booking = await bookingRepository.findBookingByUserId(userId);

    if (!booking || booking.userId !== userId) throw cannotBookRoomError();

    return bookingRepository.upsertBooking({
        id: booking.id,
        roomId,
        userId
    })
}

const bookingService = { getBooking, createBooking, changeBooking };

export default bookingService;