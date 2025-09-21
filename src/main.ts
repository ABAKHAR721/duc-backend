import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Importez ValidationPipe
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // <-- Importez Swagger
import { PrismaService } from './prisma/prisma.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configure CORS for frontend connection
  app.enableCors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  const prismaService = app.get(PrismaService); // Récupérer le service
  await prismaService.enableShutdownHooks(app); // Activer les hooks

  // Activer la validation globale
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Supprime les propriétés non définies dans le DTO
    forbidNonWhitelisted: true, // Lance une erreur si des propriétés non autorisées sont envoyées
    transform: true, // Transforme les types de données (ex: string en number pour les IDs)
  }));
  
    // --- Début de la configuration de Swagger ---
  const config = new DocumentBuilder()
    .setTitle('Duc-Backend API')
    .setDescription("Documentation de l'API pour le projet Duc, permettant de gérer toutes les ressources de l'application.")
    .setVersion('1.0')
    .addBearerAuth() // <-- Très important pour la documentation de l'authentification JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // <-- L'interface Swagger sera disponible sur http://localhost:3001/api
  // --- Fin de la configuration de Swagger ---

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3001, '::');
  
}
bootstrap();