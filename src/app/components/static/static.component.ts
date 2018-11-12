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
    showRating;
    currentRate;
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
        } else if (this.pageNav === "rateapp") {
            this.showRating = true;
            this.showFaq = false;
            this.showTerms = false;
            this.rateSub();
        }


    }

    ngOnInit() {
    }
    Rate;
    rateChange(rate) {
        this.Rate = rate;

    }
    rateSub() {
        if (this.Rate == null || NaN) {
            // swal("Please select rate", "", "warning");
            return;
        } else if (this.Rate == undefined) {
            return;
        } else {
            var inData = {
                "user_id": localStorage.userId,
                "User_rating": this.Rate
            }
            this.mainServe.rateChange(inData).subscribe(response => {
                swal("Ratting submitted successfully", "", "sucess");
            })
        }

    }
}
