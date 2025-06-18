import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserRepository } from '../domain/ports/user-repository.interface';
import { USER_REPOSITORY } from '../domain/ports/injection-tokens';
import { User } from '../domain/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

async function bootstrap() {
  try {
    console.log('Starting test script...');

    // Create a NestJS application
    const app = await NestFactory.createApplicationContext(AppModule);

    // Get the UserRepository from the application
    const userRepository = app.get<UserRepository>(USER_REPOSITORY);

    // Generate a unique ID and email for testing
    const userId = uuidv4();
    const userEmail = `test-${userId.substring(0, 8)}@example.com`;

    console.log(`Creating test user with ID: ${userId} and email: ${userEmail}`);

    // Create a new user
    const user = User.register(userId, userEmail, 'password123');

    // Save the user to the database
    await userRepository.save(user);
    console.log('User saved successfully');

    // Find the user by email
    const foundUser = await userRepository.findByEmail(userEmail);
    if (foundUser) {
      console.log('User found by email:', foundUser.id, foundUser.email);
    } else {
      console.log('User not found by email');
    }

    // Find the user by ID
    const foundUserById = await userRepository.findById(userId);
    if (foundUserById) {
      console.log('User found by ID:', foundUserById.id, foundUserById.email);
    } else {
      console.log('User not found by ID');
    }

    // Close the application
    await app.close();
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Error during test:', error);
  }
}

bootstrap();
