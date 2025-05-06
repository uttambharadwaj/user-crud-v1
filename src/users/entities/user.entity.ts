import { IsBoolean, IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, isString } from 'class-validator';

export class User {
    
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsEnum(['admin', 'user'])
    role: string;

    @IsBoolean()
    @IsNotEmpty()
    isActive: boolean;

    @IsDate()
    createdAt: Date;
    
    @IsDate()
    updatedAt: Date;
}


