import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './user/user.model';
import { userModule } from './user/user.module';
import { authPage } from './middleware';
import { userController } from './user/user.controller';

@Module({
  imports: [MongooseModule.forFeature([
    { name: "users", schema: userSchema }
  ]),
    /* MongooseModule.forRoot('mongodb://localhost:27017/user_ms'), */
    MongooseModule.forRoot('mongodb+srv://las2023:fzGFJexqt4ym5Pw6@las.qnzzuhw.mongodb.net/user_ms'),
    userModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(authPage)
      .exclude('user/login')
      .forRoutes(userController);
  }
}