import { Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateBookingInfo } from 'src/booking/dto/CreateBooking.dto';
import { BookimgService } from 'src/booking/services/bookimg/bookimg.service';

@Controller()
export class BookingController {
    constructor(private readonly bookingService: BookimgService) { }

    @MessagePattern({ cmd: 'confirm_purchase_booking_service' })
    async confirmPurchase(@Payload() bookingId: number) {
        return await this.bookingService.confirmPurchase(bookingId)
    }

    @MessagePattern({ cmd: 'cancel_purchase_booking_service' })
    async cancelPurchase(@Payload() bookingId: number) {
        return await this.bookingService.cancelPurchase(bookingId)
    }

    @MessagePattern({ cmd: 'create_bookingInfo_booking_service' })
    async createBooking(@Payload() createBooking: CreateBookingInfo) {
        return await this.bookingService.createBooking(createBooking)
    }
}
