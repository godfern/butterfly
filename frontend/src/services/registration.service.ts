
import { Injectable } from '@angular/core';

export interface Registration {
  id: string;
  emailId: string;
}

@Injectable()
export abstract class RegistrationService {
  abstract getRegistrationDetails(): Registration[];
}