import { ApiProperty } from '@nestjs/swagger';

export class UsersResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the user' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address of the user' })
  email: string;

  @ApiProperty({ example: 'admin', enum: ['admin', 'user'], description: 'Role of the user, either admin or user' })
  role: string;

  @ApiProperty({ example: true, description: 'Whether the user is active' })
  isActive: boolean;

  @ApiProperty({ example: '2025-05-07T12:00:00.000Z', description: 'Date when the user was created' })
  createdAt: string;

  @ApiProperty({ example: '2025-05-07T12:00:00.000Z', description: 'Date when the user was last updated' })
  updatedAt: string;
}
