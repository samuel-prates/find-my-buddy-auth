import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/ports/user-repository.interface';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  // Mock user database for demonstration purposes
  private readonly users = [
    {
      id: '1',
      email: 'user@example.com',
      // This is the hashed version of 'password123'
      password: '$2b$10$Ot/qlZJDAM5NVfYk8Dc3AuHLjxF9KK9wqQOYOaRlIDRd5XJzSzQnC',
    },
  ];

  async findByEmail(email: string): Promise<User | null> {
    const userData = this.users.find((u) => u.email === email);
    if (!userData) {
      return null;
    }

    return User.create(userData.id, userData.email, userData.password);
  }

  async findById(id: string): Promise<User | null> {
    const userData = this.users.find((u) => u.id === id);
    if (!userData) {
      return null;
    }

    return User.create(userData.id, userData.email, userData.password);
  }

  async save(user: User): Promise<void> {
    // In a real implementation, this would save the user to a database
    // For this in-memory implementation, we'll just log that the user was saved
    console.log(`User saved: ${user.id}, ${user.email}`);
  }
}