import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    // Establece la zona horaria en UTC
    req.timezoneOffset = new Date().getTimezoneOffset() * -1;
    next();
  });
  await app.listen(3000);
}
bootstrap();
