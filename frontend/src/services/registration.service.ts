
import { Injectable } from '@angular/core';

export interface Registration {
  _id: string;
  emailId: number;
  primaryType: string;
  data: {}
}

@Injectable()
export abstract class RegistrationService {
  abstract getRegistrationDetails(): Registration[];
}