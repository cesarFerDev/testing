import { Booking, Room } from "./index";
import {describe, expect, test} from '@jest/globals';

describe("Booking's fee calculation check", () => {
    const checkin: Date = new Date("April 02, 2023");
    const checkout: Date  = new Date("April 05, 2023");
    test("Valid dates without discount", () => {
        const bookingTest: Booking = new Booking("Juan", "xxx@mail.com", checkin, checkout, 0, new Room("Suite 005", [], 20000, 0))
        expect(bookingTest.getFee()).toBe(60000);
    });
    test("Valid dates with room discount ONLY", () => {
        const bookingTest: Booking = new Booking("Juan", "xxx@mail.com", checkin, checkout, 0, new Room("Suite 005", [], 20000, 10))
        expect(bookingTest.getFee()).toBe(54000);
    });
    test("Valid dates with booking discount ONLY", () => {
        const bookingTest: Booking = new Booking("Juan", "xxx@mail.com", checkin, checkout, 25, new Room("Suite 005", [], 20000, 0))
        expect(bookingTest.getFee()).toBe(45000);
    });
    test("Valid dates with room AND booking discount", () => {
        const bookingTest: Booking = new Booking("Juan", "xxx@mail.com", checkin, checkout, 25, new Room("Suite 005", [], 20000, 10))
        expect(bookingTest.getFee()).toBe(40500);
    });
    test("Invalid dates: check out previous to check in", () => {
        const bookingTest: Booking = new Booking("Juan", "xxx@mail.com", checkout, checkin, 25, new Room("Suite 005", [], 20000, 10))
        expect(bookingTest.getFee()).toBe(0);
    });
    test("Room price in euros", () => {
        const bookingTest: Booking = new Booking("Juan", "xxx@mail.com", checkin, checkout, 0, new Room("Suite 005", [], 200.50, 0))
        expect(bookingTest.getFee()).toBe(60150);
    });
    
});

describe("Check if a room is occupied given a certain date", () => {
    test("Valid date input and room available", () => {
        let dateTest: Date  = new Date("May 15, 2023");
        const roomTest = new Room("Suite 005", [], 20000, 0);
        const bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 18, 2023"), new Date("May 22, 2023"), 0, roomTest);
        const bookingTest02: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 18, 2022"), new Date("May 22, 2022"), 0, roomTest);
        const bookingTest03: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 07, 2023"), new Date("May 14, 2023"), 0, roomTest);
        roomTest.bookings = [bookingTest01, bookingTest02, bookingTest03];
        expect(roomTest.isOccupied(dateTest)).toBe(false);
    });
    test("Valid date input and room inavailable", () => {
        let dateTest: Date  = new Date("Jan 02, 2023");
        const roomTest = new Room("Suite 005", [], 20000, 0);
        const bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 18, 2022"), new Date("May 22, 2022"), 0, roomTest);
        const bookingTest02: Booking = new Booking("Juan", "xxx@mail.com", new Date("Dec 28, 2022"), new Date("Jan 04, 2023"), 0, roomTest);
        const bookingTest03: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 27, 2023"), new Date("May 29, 2023"), 0, roomTest);
        roomTest.bookings = [bookingTest01, bookingTest02, bookingTest03];
        expect(roomTest.isOccupied(dateTest)).toBe(true);
    });
    test("Invalid date: previous to the actual date", () => {
        let dateTest: Date  = new Date();
        dateTest.setTime(-1);
        const roomTest = new Room("Suite 005", [], 20000, 0);
        const bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 18, 2022"), new Date("May 22, 2022"), 0, roomTest);
        const bookingTest02: Booking = new Booking("Juan", "xxx@mail.com", new Date("Dec 28, 2022"), new Date("Jan 04, 2023"), 0, roomTest);
        const bookingTest03: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 27, 2023"), new Date("May 29, 2023"), 0, roomTest);
        roomTest.bookings = [bookingTest01, bookingTest02, bookingTest03];
        expect(roomTest.isOccupied(dateTest)).toBe(false);
    });
});

describe("Check if the occupancy percentage calculation is correct", () => {
    test("Valid date inputs with room available every day", () => {
        let startDateTest: Date  = new Date("May 14, 2023");
        let endDateTest: Date  = new Date("May 30, 2023");
        const roomTest = new Room("Suite 005", [], 20000, 0);
        const bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 05, 2023"), new Date("May 13, 2023"), 0, roomTest);
        const bookingTest02: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 18, 2022"), new Date("May 22, 2022"), 0, roomTest);
        const bookingTest03: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 31, 2023"), new Date("Jun 05, 2023"), 0, roomTest);
        roomTest.bookings = [bookingTest01, bookingTest02, bookingTest03];
        expect(roomTest.occupancyPercentage(startDateTest, endDateTest)).toBe(0);
    });
    test("Valid date inputs with room available 50%", () => {
        let startDateTest: Date  = new Date("May 14, 2023");
        let endDateTest: Date  = new Date("May 30, 2023");
        const roomTest = new Room("Suite 005", [], 20000, 0);
        const bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 07, 2023"), new Date("May 21, 2023"), 0, roomTest);
        const bookingTest02: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 18, 2022"), new Date("Jun 22, 2022"), 0, roomTest);
        const bookingTest03: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 31, 2023"), new Date("Jun 05, 2023"), 0, roomTest);
        roomTest.bookings = [bookingTest01, bookingTest02, bookingTest03];
        expect(roomTest.occupancyPercentage(startDateTest, endDateTest)).toBe(50);
    });
    test("Valid date inputs with room not available", () => {
        let startDateTest: Date  = new Date("May 14, 2023");
        let endDateTest: Date  = new Date("May 30, 2023");
        const roomTest = new Room("Suite 005", [], 20000, 0);
        const bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 07, 2023"), new Date("May 21, 2023"), 0, roomTest);
        const bookingTest02: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 18, 2022"), new Date("Jun 22, 2022"), 0, roomTest);
        const bookingTest03: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 22, 2023"), new Date("Jun 01, 2023"), 0, roomTest);
        roomTest.bookings = [bookingTest01, bookingTest02, bookingTest03];
        expect(roomTest.occupancyPercentage(startDateTest, endDateTest)).toBe(100);
    });
    test("Invalid date inputs: end date before start date", () => {
        let startDateTest: Date  = new Date("May 30, 2023");
        let endDateTest: Date  = new Date("May 14, 2023");
        const roomTest = new Room("Suite 005", [], 20000, 0);
        const bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 07, 2023"), new Date("May 21, 2023"), 0, roomTest);
        const bookingTest02: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 18, 2022"), new Date("Jun 22, 2022"), 0, roomTest);
        const bookingTest03: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 22, 2023"), new Date("Jun 01, 2023"), 0, roomTest);
        roomTest.bookings = [bookingTest01, bookingTest02, bookingTest03];
        expect(roomTest.occupancyPercentage(startDateTest, endDateTest)).toBe(0);
    });
});

describe("Check if the total occupancy percentage calculation is correct", () => {
    test("Valid date inputs with all the rooms availables", () => {
        let startDateTest: Date  = new Date("May 14, 2023");
        let endDateTest: Date  = new Date("May 30, 2023");
        const roomTest01 = new Room("Suite 005", [], 20000, 0);
        const roomTest02 = new Room("Single Bed 087", [], 15000, 0);
        const roomTest03 = new Room("Double Bed 100", [], 18000, 0);
        const roomListTest =  [roomTest01, roomTest02, roomTest03]
        const room01BookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 05, 2023"), new Date("May 13, 2023"), 0, roomTest01);
        const room01BookingTest02: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 01, 2023"), new Date("Jun 07, 2023"), 0, roomTest01);
        const room01BookingTest03: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 11, 2023"), new Date("Jun 15, 2023"), 0, roomTest01);
        const room02bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 18, 2022"), new Date("May 22, 2022"), 0, roomTest02);
        const room02bookingTest02: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 04, 2023"), new Date("Jun 06, 2023"), 0, roomTest01);
        const room02BookingTest03: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 09, 2023"), new Date("Jun 18, 2023"), 0, roomTest02);
        const room03bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 31, 2023"), new Date("Jun 05, 2023"), 0, roomTest03);
        const room03bookingTest02: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 15, 2023"), new Date("Jun 19, 2023"), 0, roomTest03);
        const room03bookingTest03: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jul 02, 2023"), new Date("Jul 05, 2023"), 0, roomTest03);
        roomTest01.bookings = [room01BookingTest01, room01BookingTest02, room01BookingTest03];
        roomTest02.bookings = [room02bookingTest01, room02bookingTest02, room02BookingTest03];
        roomTest03.bookings = [room03bookingTest01, room03bookingTest02, room03bookingTest03];
        expect(Room.totalOccupancyPercentage(roomListTest, startDateTest, endDateTest)).toBe(0);
    });
    test("Valid date inputs with 1/3 of the total available", () => {
        let startDateTest: Date  = new Date("May 14, 2023");
        let endDateTest: Date  = new Date("May 30, 2023");
        const roomTest01 = new Room("Suite 005", [], 20000, 0);
        const roomTest02 = new Room("Single Bed 087", [], 15000, 0);
        const roomTest03 = new Room("Double Bed 100", [], 18000, 0);
        const roomListTest =  [roomTest01, roomTest02, roomTest03]
        const room01BookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 10, 2023"), new Date("May 31, 2023"), 0, roomTest01);
        const room01BookingTest02: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 01, 2023"), new Date("Jun 07, 2023"), 0, roomTest01);
        const room01BookingTest03: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 11, 2023"), new Date("Jun 15, 2023"), 0, roomTest01);
        const room02bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 18, 2022"), new Date("May 22, 2022"), 0, roomTest02);
        const room02bookingTest02: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 04, 2023"), new Date("Jun 06, 2023"), 0, roomTest02);
        const room02BookingTest03: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 09, 2023"), new Date("Jun 18, 2023"), 0, roomTest02);
        const room03bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 31, 2023"), new Date("Jun 05, 2023"), 0, roomTest03);
        const room03bookingTest02: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 15, 2023"), new Date("Jun 19, 2023"), 0, roomTest03);
        const room03bookingTest03: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jul 02, 2023"), new Date("Jul 05, 2023"), 0, roomTest03);
        roomTest01.bookings = [room01BookingTest01, room01BookingTest02, room01BookingTest03];
        roomTest02.bookings = [room02bookingTest01, room02bookingTest02, room02BookingTest03];
        roomTest03.bookings = [room03bookingTest01, room03bookingTest02, room03bookingTest03];
        expect(Room.totalOccupancyPercentage(roomListTest, startDateTest, endDateTest)).toBe(33);
    });
    test("Valid date inputs with everything occupied", () => {
        let startDateTest: Date  = new Date("May 14, 2023");
        let endDateTest: Date  = new Date("May 30, 2023");
        const roomTest01 = new Room("Suite 005", [], 20000, 0);
        const roomTest02 = new Room("Single Bed 087", [], 15000, 0);
        const roomTest03 = new Room("Double Bed 100", [], 18000, 0);
        const roomListTest =  [roomTest01, roomTest02, roomTest03]
        const room01BookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 10, 2023"), new Date("May 31, 2023"), 0, roomTest01);
        const room02bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 12, 2023"), new Date("Jul 01, 2023"), 0, roomTest02);
        const room03bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 09, 2023"), new Date("May 31, 2023"), 0, roomTest03);
        roomTest01.bookings = [room01BookingTest01];
        roomTest02.bookings = [room02bookingTest01];
        roomTest03.bookings = [room03bookingTest01];
        expect(Room.totalOccupancyPercentage(roomListTest, startDateTest, endDateTest)).toBe(100);
    });
    test("Invalid date inputs: end date before start date", () => {
        let startDateTest: Date  = new Date("May 30, 2023");
        let endDateTest: Date  = new Date("May 14, 2023");
        const roomTest01 = new Room("Suite 005", [], 20000, 0);
        const roomTest02 = new Room("Single Bed 087", [], 15000, 0);
        const roomTest03 = new Room("Double Bed 100", [], 18000, 0);
        const roomListTest =  [roomTest01, roomTest02, roomTest03]
        const room01BookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 10, 2023"), new Date("May 31, 2023"), 0, roomTest01);
        const room02bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 12, 2023"), new Date("Jul 01, 2023"), 0, roomTest02);
        const room03bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 09, 2023"), new Date("May 31, 2023"), 0, roomTest03);
        roomTest01.bookings = [room01BookingTest01];
        roomTest02.bookings = [room02bookingTest01];
        roomTest03.bookings = [room03bookingTest01];
        expect(Room.totalOccupancyPercentage(roomListTest, startDateTest, endDateTest)).toBe(0);
    });
});

describe("Check if the total occupancy percentage calculation is correct", () => {
    test("Valid date inputs with all the rooms availables", () => {
        let startDateTest: Date  = new Date("May 14, 2023");
        let endDateTest: Date  = new Date("May 30, 2023");
        const roomTest01 = new Room("Suite 005", [], 20000, 0);
        const roomTest02 = new Room("Single Bed 087", [], 15000, 0);
        const roomTest03 = new Room("Double Bed 100", [], 18000, 0);
        const roomListTest =  [roomTest01, roomTest02, roomTest03]
        const room01BookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 05, 2023"), new Date("May 13, 2023"), 0, roomTest01);
        const room01BookingTest02: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 01, 2023"), new Date("Jun 07, 2023"), 0, roomTest01);
        const room01BookingTest03: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 11, 2023"), new Date("Jun 15, 2023"), 0, roomTest01);
        const room02bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 18, 2022"), new Date("May 22, 2022"), 0, roomTest02);
        const room02bookingTest02: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 04, 2023"), new Date("Jun 06, 2023"), 0, roomTest01);
        const room02BookingTest03: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 09, 2023"), new Date("Jun 18, 2023"), 0, roomTest02);
        const room03bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 31, 2023"), new Date("Jun 05, 2023"), 0, roomTest03);
        const room03bookingTest02: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 15, 2023"), new Date("Jun 19, 2023"), 0, roomTest03);
        const room03bookingTest03: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jul 02, 2023"), new Date("Jul 05, 2023"), 0, roomTest03);
        roomTest01.bookings = [room01BookingTest01, room01BookingTest02, room01BookingTest03];
        roomTest02.bookings = [room02bookingTest01, room02bookingTest02, room02BookingTest03];
        roomTest03.bookings = [room03bookingTest01, room03bookingTest02, room03bookingTest03];
        expect(Room.availableRooms(roomListTest, startDateTest, endDateTest)).toStrictEqual(roomListTest);
    });
    test("Valid date inputs with 1/3 of the total available", () => {
        let startDateTest: Date  = new Date("May 14, 2023");
        let endDateTest: Date  = new Date("May 30, 2023");
        const roomTest01 = new Room("Suite 005", [], 20000, 0);
        const roomTest02 = new Room("Single Bed 087", [], 15000, 0);
        const roomTest03 = new Room("Double Bed 100", [], 18000, 0);
        const roomListTest =  [roomTest01, roomTest02, roomTest03]
        const room01BookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 10, 2023"), new Date("May 31, 2023"), 0, roomTest01);
        const room01BookingTest02: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 01, 2023"), new Date("Jun 07, 2023"), 0, roomTest01);
        const room01BookingTest03: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 11, 2023"), new Date("Jun 15, 2023"), 0, roomTest01);
        const room02bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 18, 2022"), new Date("May 22, 2022"), 0, roomTest02);
        const room02bookingTest02: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 04, 2023"), new Date("Jun 06, 2023"), 0, roomTest02);
        const room02BookingTest03: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 09, 2023"), new Date("Jun 18, 2023"), 0, roomTest02);
        const room03bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 31, 2023"), new Date("Jun 05, 2023"), 0, roomTest03);
        const room03bookingTest02: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jun 15, 2023"), new Date("Jun 19, 2023"), 0, roomTest03);
        const room03bookingTest03: Booking = new Booking("Juan", "xxx@mail.com", new Date("Jul 02, 2023"), new Date("Jul 05, 2023"), 0, roomTest03);
        roomTest01.bookings = [room01BookingTest01, room01BookingTest02, room01BookingTest03];
        roomTest02.bookings = [room02bookingTest01, room02bookingTest02, room02BookingTest03];
        roomTest03.bookings = [room03bookingTest01, room03bookingTest02, room03bookingTest03];
        expect(Room.availableRooms(roomListTest, startDateTest, endDateTest)).toStrictEqual([roomTest02, roomTest03]);
    });
    test("Valid date inputs with everything occupied", () => {
        let startDateTest: Date  = new Date("May 14, 2023");
        let endDateTest: Date  = new Date("May 30, 2023");
        const roomTest01 = new Room("Suite 005", [], 20000, 0);
        const roomTest02 = new Room("Single Bed 087", [], 15000, 0);
        const roomTest03 = new Room("Double Bed 100", [], 18000, 0);
        const roomListTest =  [roomTest01, roomTest02, roomTest03]
        const room01BookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 10, 2023"), new Date("May 31, 2023"), 0, roomTest01);
        const room02bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 12, 2023"), new Date("Jul 01, 2023"), 0, roomTest02);
        const room03bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 09, 2023"), new Date("May 31, 2023"), 0, roomTest03);
        roomTest01.bookings = [room01BookingTest01];
        roomTest02.bookings = [room02bookingTest01];
        roomTest03.bookings = [room03bookingTest01];
        expect(Room.availableRooms(roomListTest, startDateTest, endDateTest)).toStrictEqual([]);
    });
    test("Invalid date inputs: end date before start date", () => {
        let startDateTest: Date  = new Date("May 30, 2023");
        let endDateTest: Date  = new Date("May 14, 2023");
        const roomTest01 = new Room("Suite 005", [], 20000, 0);
        const roomTest02 = new Room("Single Bed 087", [], 15000, 0);
        const roomTest03 = new Room("Double Bed 100", [], 18000, 0);
        const roomListTest =  [roomTest01, roomTest02, roomTest03]
        const room01BookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 10, 2023"), new Date("May 31, 2023"), 0, roomTest01);
        const room02bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 12, 2023"), new Date("Jul 01, 2023"), 0, roomTest02);
        const room03bookingTest01: Booking = new Booking("Juan", "xxx@mail.com", new Date("May 09, 2023"), new Date("May 31, 2023"), 0, roomTest03);
        roomTest01.bookings = [room01BookingTest01];
        roomTest02.bookings = [room02bookingTest01];
        roomTest03.bookings = [room03bookingTest01];
        expect(Room.availableRooms(roomListTest, startDateTest, endDateTest)).toStrictEqual(roomListTest);
    });
});