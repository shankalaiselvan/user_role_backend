import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Swagger Test')
    .setDescription('This is swagger api')
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  app.enableCors({
    allowedHeaders: "*",
    origin: "*"
  });
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();