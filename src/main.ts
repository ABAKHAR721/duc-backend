import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Importez ValidationPipe
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // <-- Importez Swagger
import { PrismaService } from './prisma/prisma.service';
import { Reflector } from '@nestjs/core';
import { CsrfGuard } from './common/guards/csrf.guard';
import { RateLimitGuard } from './common/guards/rate-limit.guard';
import { SanitizeInterceptor } from './common/interceptors/sanitize.interceptor';
import { SelectiveSanitizeInterceptor } from './common/interceptors/selective-sanitize.interceptor';
import { CsrfService } from './common/services/csrf.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security Headers
  app.use((req, res, next) => {
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    // Remove server information
    res.removeHeader('X-Powered-By');
    
    next();
  });
  
  // Configure CORS for frontend connection
  app.enableCors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
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

  // Apply security guards and interceptors globally
  const reflector = app.get(Reflector);
  const csrfService = app.get(CsrfService);
  
  app.useGlobalGuards(new RateLimitGuard(reflector));
  app.useGlobalGuards(new CsrfGuard(reflector, csrfService));
  app.useGlobalInterceptors(new SelectiveSanitizeInterceptor());
  
  // Définir le préfixe global AVANT de générer la documentation Swagger
  app.setGlobalPrefix('api');

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

  await app.listen(process.env.PORT ?? 3001, '::');
  
}
bootstrap();