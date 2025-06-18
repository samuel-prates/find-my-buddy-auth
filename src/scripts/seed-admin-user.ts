import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserRepository } from '../domain/ports/user-repository.interface';
import { USER_REPOSITORY } from '../domain/ports/injection-tokens';
import { User } from '../domain/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

async function bootstrap() {
  try {
    console.log('Starting admin user seed script...');

    // Create a NestJS application
    const app = await NestFactory.createApplicationContext(AppModule);

    // Get the UserRepository from the application
    const userRepository = app.get<UserRepository>(USER_REPOSITORY);

    // Admin user credentials
    const userId = uuidv4();
    const userEmail = 'admin@example.com';
    const userPassword = '$2b$10$.WK3S0E1W7Xwx/zGAnH0JeuGmSopUf9D4/5yDR9oUYNZl7hK1TR.6';

    // Check if admin user already exists
    const existingUser = await userRepository.findByEmail(userEmail);
    if (existingUser) {
      console.log(`Admin user with email ${userEmail} already exists.`);
    } else {
      console.log(`Creating admin user with email: ${userEmail}`);

      // Create a new admin user
      const user = User.create(userId, userEmail, userPassword);

      // Save the user to the database
      await userRepository.save(user);
      console.log('Admin user created successfully');
    }

    // Close the application
    await app.close();
    console.log('Seed script completed successfully');
  } catch (error) {
    console.error('Error during seed script execution:', error);
    process.exit(1);
  }
}

bootstrap();