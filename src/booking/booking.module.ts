import { Module } from '@nestjs/common';
import { BookingController } from './controllers/booking/booking.controller';
import { BookimgService } from './services/bookimg/bookimg.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/booking/entities/user.entity';
import { TrainInfo } from 'src/booking/entities/train-info.entity';
import { SeatInfo } from 'src/booking/entities/seat-info.entity';
import { BookingInfo } from 'src/booking/entities/booking-info.entity';
import { ScheduleInfo } from 'src/booking/entities/schedule-info.entity';

@Module({
    imports : [TypeOrmModule.forFeature([BookingInfo, SeatInfo, User, TrainInfo, ScheduleInfo])],
    controllers: [BookingController],
    providers: [BookimgService]
})
export class BookingModule {}
