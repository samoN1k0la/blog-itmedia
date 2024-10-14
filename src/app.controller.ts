import { Controller, Get, Res, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  redirectToSwagger(@Res({ passthrough: true }) res) {
    res.status(HttpStatus.FOUND);
    res.redirect('/swagger');
  }
}
