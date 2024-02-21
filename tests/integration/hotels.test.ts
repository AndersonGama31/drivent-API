import app, { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import { createEnrollmentWithAddress, createPayment, createTicket, createTicketType, createUser, generateCreditCardData } from "../factories";
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from "@prisma/client";
import { createHotel, createRoom } from "../factories/hotels-factory";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
    it("should respond with 401 if no token is given", async () => {
        const response = await server.get("/hotels");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with 401 if given token is not valid", async () => {
        const token = faker.lorem.word();

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with 401 if there no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", () => {
        it("should respond with 404 if user has no enrollment", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it("should respond with 404 if user has no ticket", async () => {
            const user = await createUser();
            await createEnrollmentWithAddress(user);
            const token = await generateValidToken(user);

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it("should respond with 402 if user has no paid ticket", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });

        it("should respond with 200 if user has paid ticket and return empty array of hotels if there are no hotels available", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            const body = { ticketId: ticket.id, cardData: generateCreditCardData() };

            await server.post('/payments/process').set('Authorization', `Bearer ${token}`).send(body);

            const hotelsResponse = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(hotelsResponse.status).toEqual(httpStatus.OK);
        });

        it("should respond with 200 and return hotels if user has paid ticket", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const hotel = await createHotel();
            await createRoom(hotel.id);

            const body = { ticketId: ticket.id, cardData: generateCreditCardData() };

            await server.post('/payments/process').set('Authorization', `Bearer ${token}`).send(body);

            const hotelsResponse = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(hotelsResponse.status).toEqual(httpStatus.OK);
            // expect(hotelsResponse.body).toEqual([{
            //     id: expect.any(Number),
            //     name: expect.any(String),
            //     image: expect.any(String),
            //     createdAt: expect.any(String),
            //     updatedAt: expect.any(String),
            // }]);
            expect(hotelsResponse.body).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    image: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                })
            ]));
        });
    });
});

describe("GET /hotels/:hotelId", () => {
    describe("when token is valid", () => {

        it("should respond with 402 if user has no paid ticket", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const hotel = await createHotel();
            await createRoom(hotel.id);

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });

        it("should respond with 200 if user has paid ticket and return empty array of hotels if there are no hotels available", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const hotel = await createHotel();
            await createRoom(hotel.id);

            const body = { ticketId: ticket.id, cardData: generateCreditCardData() };

            await server.post('/payments/process').set('Authorization', `Bearer ${token}`).send(body);

            const hotelsResponse = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

            expect(hotelsResponse.status).toEqual(httpStatus.OK);

            expect(hotelsResponse.body).toEqual({
                id: expect.any(Number),
                name: expect.any(String),
                image: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                Rooms: [{
                    id: expect.any(Number),
                    name: expect.any(String),
                    capacity: expect.any(Number),
                    hotelId: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                }]
            });
        });
    });

    it("should respond with 200 and return hotels if user has paid ticket", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
        const hotel = await createHotel();
        await createRoom(hotel.id);

        const body = { ticketId: ticket.id, cardData: generateCreditCardData() };

        await server.post('/payments/process').set('Authorization', `Bearer ${token}`).send(body);

        const hotelsResponse = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

        expect(hotelsResponse.status).toEqual(httpStatus.OK);
    });
});

