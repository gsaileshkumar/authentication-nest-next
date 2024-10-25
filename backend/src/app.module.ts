import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { User, UserSchema } from './auth/user.schema';
import * as cors from 'cors';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      cors({
        origin: 'http://localhost:3000', // Allow only this origin
        credentials: true,               // Allow credentials (cookies)
      }),
    ).forRoutes('*');
  }
}
