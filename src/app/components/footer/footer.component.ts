
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
    if (localStorage.toke !== undefined) {
      this.router.navigate(['/myprofile']);
    } else {
      swal('Please Login', '', 'warning');
      return;
    }
  }

}
