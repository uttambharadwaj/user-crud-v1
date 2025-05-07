import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    return 'Please refer to the documentation for API usage instructions. Go to /api/docs for more information.';
  }
}
