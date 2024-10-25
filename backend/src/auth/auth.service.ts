import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from './user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async signUp(email: string, name: string, password: string): Promise<void> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new this.userModel({ email, name, password: hashedPassword });
      await user.save();
      this.logger.log(`User created successfully: ${email}`); 
    } catch (error) {
      this.logger.error(`Error during sign-up for ${email}: ${error.message}`, error.stack); 
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ email });
      if (user && (await bcrypt.compare(password, user.password))) {
        this.logger.log(`User validation successful for email: ${email}`);
        return user;
      }
      this.logger.warn(`Invalid login attempt for email: ${email}`); 
      return null;
    } catch (error) {
      this.logger.error(`Error during user validation for ${email}: ${error.message}`, error.stack); 
      throw error;
    }
  }

  async generateAccessToken(user: User): Promise<string> {
    try {
      const accessToken = jwt.sign({ email: user.email, name: user.name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      this.logger.log(`Access token generated for user: ${user.email}`); 
      return accessToken;
    } catch (error) {
      this.logger.error(`Error generating access token for ${user.email}: ${error.message}`, error.stack); 
      throw error;
    }
  }

  async generateRefreshToken(user: User): Promise<string> {
    try {
      const refreshToken = jwt.sign({ email: user.email }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      });
      user.refreshTokens.push(refreshToken);
      await user.save();
      this.logger.log(`Refresh token generated for user: ${user.email}`); 
      return refreshToken;
    } catch (error) {
      this.logger.error(`Error generating refresh token for ${user.email}: ${error.message}`, error.stack); 
      throw error;
    }
  }

  async validateRefreshToken(refreshToken: string): Promise<User | null> {
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as any;
      const user = await this.userModel.findOne({ email: payload.email });
      if (user && user.refreshTokens.includes(refreshToken)) {
        this.logger.log(`Refresh token validation successful for user: ${payload.email}`); 
        return user;
      }
      this.logger.warn(`Invalid or expired refresh token for email: ${payload.email}`); 
      return null;
    } catch (error) {
      this.logger.error(`Error during refresh token validation: ${error.message}`, error.stack);
      return null;
    }
  }

  async signOut(refreshToken: string): Promise<void> {
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as any;
      const user = await this.userModel.findOne({ email: payload.email });

      if (user) {
        user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
        await user.save();
        this.logger.log(`User signed out successfully: ${user.email}`);
      }
    } catch (error) {
      this.logger.error(`Error during sign-out: ${error.message}`, error.stack);
      throw new Error('Invalid refresh token');
    }
  }
}
