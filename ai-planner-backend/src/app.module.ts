import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlannerModule } from './planner/planner.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    PlannerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [
        () => ({
          OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
