import { Ticket, TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';
import { CreateTicketParams } from '@/protocols';

async function findTicketTypes(): Promise<TicketType[]> {
    return prisma.ticketType.findMany();
}

async function findTicketByEnrollmentId(enrollmentId: number): Promise<Ticket> {
    return prisma.ticket.findFirst({
        where: { enrollmentId },
        include: {
            TicketType: true, //join
        },
    });
}

async function createTicket(ticket: CreateTicketParams): Promise<Ticket> {
    return prisma.ticket.create({
        data: ticket,
    });
}

async function findTickeyById(ticketId: number): Promise<Ticket> {
    return prisma.ticket.findFirst({
        where: {
            id: ticketId,
        },
        include: {
            Enrollment: true,
        },
    });
}

async function findTickeWithTypeById(ticketId: number): Promise<Ticket> {
    return prisma.ticket.findFirst({
        where: {
            id: ticketId,
        },
        include: {
            TicketType: true,
        },
    });
}

async function ticketProcessPayment(ticketId: number): Promise<Ticket> {
    return prisma.ticket.update({
        where: {
            id: ticketId,
        },
        data: {
            status: TicketStatus.PAID,
        },
    });
}

export default {
    findTicketTypes,
    findTicketByEnrollmentId,
    createTicket,
    findTickeyById,
    findTickeWithTypeById,
    ticketProcessPayment,
};
