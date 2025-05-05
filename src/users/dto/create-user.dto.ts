export class CreateUserDto {
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

    // create example input:
    // {
    //     "name": "John Doe",
    //     "email": "test@test.com",
    //     "role": "admin",
    //     "isActive": true,
    //     "createdAt": "2023-10-01T00:00:00.000Z",
    //     "updatedAt": "2023-10-01T00:00:00.000Z"
    // }
}