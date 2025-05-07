import { User } from "src/users/entities/user.entity";
import { IsInt, IsString, IsOptional, IsBoolean, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class Team {
    @IsInt()
    id: number;

    @IsString()
    name: string;

    @IsDate()
    @Type(() => Date)
    createdDate: Date;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsInt()
    currentCaptainId?: number;

    @IsArray()
    @IsInt({ each: true })
    members: number[];
}
