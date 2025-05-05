import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    // this class is used to define the structure of the update user request
    // it extends the CreateUserDto class and makes all properties optional
    // this allows us to use the same validation rules as the CreateUserDto class
    // but with the ability to only update certain fields
    // for example, if we want to update only the name and email fields, we can do that
    // without having to provide all the other fields
    // this is useful for PATCH requests where we only want to update certain fields

    id: number;
    name?: string | undefined;
    email?: string | undefined;
    role?: string | undefined;
    isActive?: boolean | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}
