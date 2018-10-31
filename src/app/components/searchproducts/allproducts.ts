import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MainService } from './../../services/main/main';

@Component({
    selector: 'app-allproducts',
    templateUrl: './allproducts.html',
    styleUrls: ['./searchproducts.component.css']
})
export class AllProductsComponent implements OnInit {
    title;
    products;
    noData;
    constructor(private router: Router, private route: ActivatedRoute, public mainServe: MainService) {
        this.route.queryParams.subscribe(params => {
            this.title = params.title;

        })
    }

    item = {
        quantity: 1
    }
    ngOnInit() {
        this.getAllProducts();
    }
    getAllProducts() {

        this.mainServe.getDashboard().subscribe(response => {
            this.products = response.json().products;
            if (response.json().status == 400) {
                this.noData = response.json().message;
            }

        }, error => {

        });

    }
}