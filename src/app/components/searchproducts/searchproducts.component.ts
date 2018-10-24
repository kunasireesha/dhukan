import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MainService } from './../../services/main/main';

@Component({
  selector: 'app-searchproducts',
  templateUrl: './searchproducts.component.html',
  styleUrls: ['./searchproducts.component.css']
})
export class SearchproductsComponent implements OnInit {
  searchProd;
  products;
  constructor(private router: Router, private route: ActivatedRoute, public mainServe: MainService) {
    this.route.queryParams.subscribe(params => {
      this.searchProd = params.prodName;
    })
  }

  ngOnInit() {
    this.searchProducts();
  }
  searchProducts() {
    var inData = this.searchProd;
    this.mainServe.searchProducts(inData).subscribe(response => {
      this.products = response.json().products;
      console.log(this.products);

    }, error => {

    });

  }
}