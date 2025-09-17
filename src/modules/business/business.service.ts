
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Business } from '@prisma/client'; // <-- LA CORRECTION EST ICI

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  create(createBusinessDto: CreateBusinessDto): Promise<Business> {
    return this.prisma.business.create({
      data: createBusinessDto,
    });
  }

  findAll(): Promise<Business[]> {
    return this.prisma.business.findMany();
  }

  async findOne(id: string): Promise<Business> {
    const business = await this.prisma.business.findUnique({
      where: { id },
    });

    if (!business) {
      throw new NotFoundException(`Business information with ID "${id}" not found`);
    }

    return business;
  }

  async update(id: string, updateBusinessDto: UpdateBusinessDto): Promise<Business> {
    try {
      return await this.prisma.business.update({
        where: { id },
        data: updateBusinessDto,
      });
    } catch (error) {
      throw new NotFoundException(`Business information with ID "${id}" not found`);
    }
  }

  async remove(id: string): Promise<Business> {
    try {
      return await this.prisma.business.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Business information with ID "${id}" not found`);
    }
  }
}