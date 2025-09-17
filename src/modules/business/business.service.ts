import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from './entities/business.entity';


@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  create(createBusinessDto: CreateBusinessDto) {
    const business = this.businessRepository.create(createBusinessDto);
    return this.businessRepository.save(business);
  }

  findAll() {
    return this.businessRepository.find();
  }

  findOne(id: string) {
    return this.businessRepository.findOneBy({ id });
  }

  async update(id: string, updateBusinessDto: UpdateBusinessDto) {
    await this.businessRepository.update(id, updateBusinessDto);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.businessRepository.delete(id);
  }
}
// > Note : Nous n'avons pas encore défini les DTOs, mais le code fonctionnera. Nous y reviendrons pour la validation.