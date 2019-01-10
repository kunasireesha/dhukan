import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main/main';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
    selector: 'app-static',
    templateUrl: './static.component.html',
    styleUrls: ['./static.component.css', '../../components/header/header.component.css'],
    providers: [HeaderComponent]
})
export class StaticComponent implements OnInit {
    pageNav;
    showFaq;
    faqData;
    showTerms;
    termsData: string;
    showRating;
    currentRate;
    feedback;
    aboutusData;
    deliveryData;
    privacyPolicyData;
    aboutUs = false;
    privacy = false;
    deliveryInfo = false;
    contactUs = false;
    constructor(public mainServe: MainService, public router: Router, private route: ActivatedRoute, public headerComp: HeaderComponent) {
        this.pageNav = this.route.snapshot.data[0].page;
        if (this.pageNav === "faq") {
            this.mainServe.faq().subscribe(response => {
                this.showTerms = false;
                this.showFaq = true;
                this.deliveryInfo = false;
                this.aboutUs = false;
                this.privacy = false;
                this.faqData = response.json().result;
            }, error => {

            })
        } else if (this.pageNav === "termsandcond") {
            this.mainServe.terms().subscribe(response => {

                this.showFaq = false;
                this.showTerms = true;
                this.aboutUs = false;
                this.privacy = false;
                this.deliveryInfo = false;
                this.termsData = atob(response.json().result[0].description);
                console.log(this.termsData);
            }, error => {

            })
        } else if (this.pageNav === "rateapp") {
            this.showRating = true;
            this.showFaq = false;
            this.showTerms = false;
            this.aboutUs = false;
            this.deliveryInfo = false;
            this.privacy = false;
            this.rateSub();
        } else if (this.pageNav === "aboutUs") {
            this.mainServe.aboutUs().subscribe(response => {
                this.showRating = false;
                this.showFaq = false;
                this.showTerms = false;
                this.aboutUs = true;
                this.privacy = false;
                this.deliveryInfo = false;
                this.aboutusData = atob(response.json().result[0].description);
            }, error => {
            })
        } else if (this.pageNav === "privacyPolicy") {
            this.mainServe.privacyPolicy().subscribe(response => {
                this.showRating = false;
                this.showFaq = false;
                this.showTerms = false;
                this.privacy = true;
                this.aboutUs = false;
                this.deliveryInfo = false;
                this.privacyPolicyData = atob(response.json().result[0].description);
            }, error => {
            })
        } else if (this.pageNav === "contactUs") {
            this.mainServe.terms().subscribe(response => {
                this.showRating = false;
                this.showFaq = false;
                this.showTerms = false;
                this.contactUs = true;
                this.privacy = false;
                this.aboutUs = false;
                this.deliveryInfo = false;
                this.aboutusData = response.json().result[0];
            }, error => {
            })
        } else if (this.pageNav === "deliveryInfo") {
            this.mainServe.deliveryInfo().subscribe(response => {
                this.showRating = false;
                this.showFaq = false;
                this.showTerms = false;
                this.aboutUs = false;
                this.privacy = false;
                this.deliveryInfo = true;
                this.deliveryData = atob(response.json().result[0].description);
            }, error => {
            })
        }

        this.getDashboard();
        this.getCartList();
    }

    ngOnInit() {
        this.getDashboard();
    }
    Rate;
    rateChange(rate) {
        this.Rate = rate;

    }
    rateSub() {
        if (this.Rate == null || NaN) {
            // swal("Please select rate", "", "warning");
            return;
        } else {
            var inData = {
                "user_id": localStorage.userId,
                "User_rating": this.Rate,
                "feedback": this.feedback
            }
            this.mainServe.rateChange(inData).subscribe(response => {
                swal("Ratting submitted successfully", "", "sucess");
                this.feedback = this.Rate = '';
            })
        }

    }





    //header
    searchParam;
    viewCart;

    getCartList() {
        this.getDashboard();
        this.mainServe.getCartList();
    }


    searchProducts() {
        this.mainServe.searchProducts(this.searchParam)
    }


    itemHeaderDecrease(title, data, skuData) {
        this.mainServe.itemHeaderDecrease(title, data, skuData);
    }

    itemHeaderIncrease(title, item, data) {
        this.mainServe.itemHeaderIncrease(title, item, data);
    }

    showCat() {
        this.mainServe.showCat();
    }
    selectedCat;
    showSubCat(id, i) {
        this.selectedCat = i;
        this.mainServe.showSubCat(id, i);
    }


    showSubCatProd(subId, index, name) {
        this.mainServe.showCategories = false;
        this.mainServe.showSubCats = false;
        let navigationExtras: NavigationExtras = {
            queryParams: {
                'sId': subId,
                'catName': name
            }
        };
        this.router.navigate(["/categoriesProducts"], navigationExtras)
    }


    deleteCart(id) {
        var inData = id;
        swal("Do you want to delete?", "", "warning", {
            buttons: ["Cancel!", "Okay!"],
        }).then((value) => {

            if (value === true) {
                this.mainServe.deleteCart(inData).subscribe(response => {
                    this.mainServe.getCartList();
                    this.getDashboard();
                    swal("Deleted successfully", "", "success");
                }, error => {
                    console.log(error);
                })
            } else {
                return;
            }
        });

    }

    cartCount;
    deliveryCharge;
    subTotal;
    Total;
    getDashboard() {
        this.mainServe.getDashboard().subscribe(response => {
            this.cartCount = response.json().cart.cart_count;
            this.deliveryCharge = response.json().cart.delivery_charge.toFixed(2);
            this.subTotal = response.json().cart.selling_price.toFixed(2);
            this.Total = response.json().cart.grand_total.toFixed(2);

        })
    }
    viewAll(action) {
        if (action === 'SMART BASKET') {
            if (localStorage.token === undefined) {
                swal('Please Login', '', 'warning');
                return;
            }
        }
        let navigationExtras: NavigationExtras = {
            queryParams: {
                title: action
            }
        }
        this.router.navigate(['/viewAll'], navigationExtras);
    }

}
