import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingInfo } from 'src/booking/entities/booking-info.entity';
import { CreateBookingInfo } from 'src/booking/dto/CreateBooking.dto';
import { User } from 'src/booking/entities/user.entity';
import { SeatInfo } from 'src/booking/entities/seat-info.entity';

@Injectable()
export class BookimgService {
    constructor(
        @InjectRepository(BookingInfo) private readonly bookingRepository: Repository<BookingInfo>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(SeatInfo) private readonly seatRepository: Repository<SeatInfo>,
    ) { }

    async confirmPurchase(bookingId: number) {
        const booking = await this.bookingRepository.findOne({ where: { id: bookingId } });

        if (!booking) {
            return new HttpException('Booking not found', 404)
        }

        booking.status = 'Purchased'
        booking.expirationTime = null
        await this.bookingRepository.save(booking)

        // return http response
        return {
            message: 'Purchase confirmed',
            booking
        }
    }

    async cancelPurchase(bookingId: number) {
        // delete booking record
        const booking = await this.bookingRepository.findOne({ where: { id: bookingId } });
        if (!booking) {
            throw new HttpException('Booking not found', 404)
        }
        if (booking.status === 'Booked') {
            throw new HttpException('Booking not purchased', 400)
        }

        await this.bookingRepository.remove(booking)

        // return http response with proper status
        return {
            message: 'Purchase cancelled',
            booking
        }
    }

    async createBooking(createBooking: CreateBookingInfo) {
        const user = await this.userRepository.findOne({ where: { id: createBooking.userId } })
        const seatInfo = await this.seatRepository.findOne({ where: { id: createBooking.seatId } })

        if (!user || !seatInfo) {
            throw new HttpException('User or seat not found', 404)
        }
        const existingBooking = await this.bookingRepository.findOne({
            where: {
                seat: seatInfo,
                user: user,
                journeyDate: createBooking.journeyDate,
            },
        });

        if (existingBooking) {
            throw new HttpException('Booking already exists', 400)
        }

        const booking = new BookingInfo()
        booking.status = 'Booked'
        booking.journeyDate = createBooking.journeyDate
        booking.user = user
        booking.seat = seatInfo
        booking.expirationTime = new Date(Date.now() + 1000 * 60 * 15) // 15 minutes
        await this.bookingRepository.save(booking)

        // return http response
        return {
            message: 'Booking created',
            booking
        }
    }
}
