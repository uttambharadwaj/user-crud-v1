import { User } from "src/users/entities/user.entity";

export class Team {
    id: number;
    name: string;
    createdDate: Date;
    creatorId: number;
    description?: string | undefined;
    isActive?: boolean | true;
    currentCaptainId?: number | undefined;
    members: number[];
}
