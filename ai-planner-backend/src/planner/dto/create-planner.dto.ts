import { IsNotEmpty, IsString } from 'class-validator';
export class CreatePlannerDto {
    @IsString()
    @IsNotEmpty()
    input: string;
}
