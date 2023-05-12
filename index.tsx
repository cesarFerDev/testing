
export class Booking {

  name: string;
  email: string;
  checkIn: Date;
  checkOut: Date;
  discount: number;
  room: Room;

  constructor(name: string, email: string, checkIn: Date, checkOut: Date, discount: number, room: Room) {
    this.name = name; //string
    this.email = email; //string
    this.checkIn = checkIn; //date
    this.checkOut = checkOut; //date
    this.discount = discount; //int %
    this.room = room; //object
  }

  getFee():number {
    const timeDifference: number = this.checkOut.getTime() - this.checkIn.getTime();
    if (timeDifference < 0) {
      return 0;
    }

    const daysDifference: number = timeDifference / (1000 * 3600 * 24);
    let roomPrice: number = this.room.rate;
    
    if (!(Number.isInteger(roomPrice))) {
      roomPrice = Math.round(roomPrice * 100);
    }

    let roomDiscountTotal: number = 0;
    if (this.room.discount !== 0) {
      roomDiscountTotal = roomPrice * (this.room.discount / 100);
    }

    let bookingTotal: number = daysDifference * (roomPrice - roomDiscountTotal);
    let bookingDiscountTotal: number = 0;

    if (this.discount !== 0) {
      bookingDiscountTotal = bookingTotal * (this.discount / 100);
    }

    return bookingTotal - bookingDiscountTotal;
  }
};

export class Room {

  name: string;
  bookings: Booking[];
  rate: number;
  discount: number;

  constructor(name: string, bookings: Booking[], rate: number, discount: number) {
    this.name = name; //string
    this.bookings = bookings; //array of objects
    this.rate = rate; //int
    this.discount = discount; //int %
  }

  isOccupied(date: Date): boolean {

    const candiDateTime: number = date.getTime();

    for (let i:number = 0; i < this.bookings.length; i++) {
      if (this.bookings[i].room.name === this.name && (this.bookings[i].checkIn.getTime() <= candiDateTime && this.bookings[i].checkOut.getTime() >= candiDateTime)) {
        return true;
      }
    }
    return false;
  }

  occupancyPercentage(startDate: Date, endDate: Date): number {
    const auxDate: Date = new Date(startDate);
    const rawInterval: number = endDate.getTime() - startDate.getTime();
    if (rawInterval < 1) {
      return 0;
    }
    const daysInterval: number = Math.round(rawInterval / (1000 * 3600 * 24));
    let daysOccupied: number = 0;

    for (let i: number = 0; i < daysInterval; i++) {
      if (this.isOccupied(auxDate)) {
        daysOccupied++;
      }
      auxDate.setDate(auxDate.getDate() + 1);
    }

    return Math.round((daysOccupied / daysInterval) * 100);
  }

  static totalOccupancyPercentage(rooms: Room[], startDate: Date, endDate: Date): number {
    let totalPercentage: number = 0;
    rooms.forEach((room: Room) => totalPercentage += room.occupancyPercentage(startDate, endDate));
    return Math.round(totalPercentage/rooms.length);
  }

  static availableRooms(rooms: Room[], startDate: Date, endDate: Date): Room[]{
    let roomsAvailable: Room[] = [];
    rooms.forEach((room: Room) => {
      if (room.occupancyPercentage(startDate, endDate) != 100) {
        roomsAvailable.push(room);
      }
    })
    return roomsAvailable;
  }
};