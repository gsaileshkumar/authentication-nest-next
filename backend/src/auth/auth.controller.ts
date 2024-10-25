import { Controller, Post, Body, Res, HttpStatus, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    try {
      await this.authService.signUp(signUpDto.email, signUpDto.name, signUpDto.password);
      return res.status(HttpStatus.CREATED).json({ message: 'User created successfully' });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const user = await this.authService.validateUser(signInDto.email, signInDto.password);

    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid email or password' });
    }

    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);

    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    return res.status(HttpStatus.OK).json({ message: 'Login successful' });
  }


  @Post('signout')
  async signOut(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'No refresh token provided' });
    }

    try {
      await this.authService.signOut(refreshToken);
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      return res.status(HttpStatus.OK).json({ message: 'Sign-out successful' });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: error.message });
    }
  }

  @Get('check')
  async checkAuth(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Not authenticated' });
    }

    try {
      jwt.verify(accessToken, process.env.JWT_SECRET);
      return res.status(HttpStatus.OK).json({ message: 'Authenticated' });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid or expired access token' });
    }
  }
}
