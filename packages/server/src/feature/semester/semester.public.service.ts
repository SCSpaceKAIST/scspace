import { Injectable } from '@nestjs/common';
import { SemesterRepository } from './semester.repository';
import { MSemester } from './semester.model';

@Injectable()
export class SemesterPublicService {
  constructor(private readonly semesterRepository: SemesterRepository) {}

  async fetchSemester(id: number): Promise<MSemester> {
    return await this.semesterRepository.fetch(id);
  }

  async fetchSemesterAll(ids: number[]): Promise<MSemester[]> {
    return await this.semesterRepository.fetchAll(ids);
  }

  async getSemesterCount(): Promise<number> {
    return (await this.semesterRepository.find({})).length;
  }
}
