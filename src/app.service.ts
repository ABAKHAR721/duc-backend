import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Retourne le statut de l'API.
   * C'est un point de contrôle de santé de base.
   */
  getApiStatus(): { status: string; message: string } {
    return {
      status: 'running',
      message: 'Welcome to the Duc-Backend API!',
    };
  }
}