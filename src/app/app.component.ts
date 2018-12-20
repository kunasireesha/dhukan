import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(private translate: TranslateService) {
    if (localStorage.lan === undefined) {
      localStorage.setItem('lan', 'en');
    }
    translate.setDefaultLang(localStorage.lan);

  }
  randomkey;
  switchLanguage(language: string) {
    this.translate.use(language);
    localStorage.setItem('lan', language);
  }



}