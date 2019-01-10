
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  myprofile() {
    if (localStorage.token === undefined) {
      swal('Please Login', '', 'warning');
      return;

    } else {
      this.router.navigate(['/myprofile']);
    }
  }
}
