import { Module } from "@nestjs/common"
import { APP_GUARD } from "@nestjs/core"
import { AuthGuard } from "./guards/auth.guard"
import { Reflector } from "@nestjs/core"

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    Reflector,
  ],
  exports: [],
})
export class AuthModule {}
