import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  create(createEventDto: CreateEventDto): Promise<Event> {
    console.log('Creating event with data:', JSON.stringify(createEventDto, null, 2));
    return this.prisma.event.create({
      data: createEventDto,
    });
  }

  findAll(): Promise<Event[]> {
    return this.prisma.event.findMany({
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  findAllHeader(): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: {
        eventType: 'Promo',
        status: 'Active',
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  findPromoEvents(): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: {
        eventType: 'promo',
        status: 'En cours',
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    try {
      return await this.prisma.event.update({
        where: { id },
        data: updateEventDto,
      });
    } catch (error) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
  }

  async remove(id: string): Promise<Event> {
    try {
      return await this.prisma.event.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
  }
}