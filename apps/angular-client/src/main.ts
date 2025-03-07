import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { BASE_PATH } from './generated';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    { provide: BASE_PATH, useValue: 'http://localhost:3000' },
  ],
}).catch((err) => console.error(err));
