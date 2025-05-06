interface Team {
    id: number;
    name: string;
    createdDate: Date;
    creatorId: number;
    description?: string;
    isActive: boolean;
    currentCaptainId: number;
    members: any[];
  }