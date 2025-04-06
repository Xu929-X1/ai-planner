import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlannerService } from './planner.service';
import { CreatePlannerDto } from './dto/create-planner.dto';
import { UpdatePlannerDto } from './dto/update-planner.dto';

@Controller('planner')
export class PlannerController {
  constructor(private readonly plannerService: PlannerService) { }

  @Post()
  create(@Body() createPlannerDto: CreatePlannerDto) {
    return this.plannerService.create(createPlannerDto);
  }
}
