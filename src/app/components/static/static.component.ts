import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main/main';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.css']
})
export class StaticComponent implements OnInit {
  pageNav;
  showFaq;
  faqData;
  showTerms;
  termsData;
  constructor(public mainServe: MainService, public router: Router, private route: ActivatedRoute) {
    this.pageNav = this.route.snapshot.data[0].page;
    if (this.pageNav === "faq") {
      this.mainServe.faq().subscribe(response => {
        this.showTerms = false;
        this.showFaq = true;
        this.faqData = response.json().result;
      }, error => {

      })
    } else if (this.pageNav === "termsandcond") {
      this.mainServe.terms().subscribe(response => {
        this.showFaq = false;
        this.showTerms = true;
        this.termsData = response.json().result[0];
      }, error => {

      })
    }
  }

  ngOnInit() {
  }

}
