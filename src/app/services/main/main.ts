import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AppSettings } from '../../config';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { HeaderService } from '../../services/header/header';


@Injectable()
export class MainService {
    constructor(private http: Http, public router: Router, private translate: TranslateService, public headerSer: HeaderService
    ) { }

    postInputParamsUrl(url, sId) {
        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
        });
        return this.http.post(AppSettings.baseUrl + url + sId, { headers: headers });
    }
    postInputParams(url, params) {
        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
            'token': (localStorage.token === undefined) ? '' : JSON.parse(localStorage.token),
            'Session_id': localStorage.session
        });
        return this.http.post(AppSettings.baseUrl + url, params, { headers: headers });
    }

    getInputParams(url) {
        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
            'token': (localStorage.token === undefined) ? '' : JSON.parse(localStorage.token),
            'Session_id': localStorage.session
        });
        return this.http.get(AppSettings.baseUrl + url, { headers: headers });
    }
    getInputParamsUrl(url, params) {
        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
            // 'token': (localStorage.token === undefined) ? '' : JSON.parse(localStorage.token),
            // 'Session_id': (localStorage.token !== undefined) ? '' : localStorage.session
        });
        return this.http.get(AppSettings.baseUrl + url + "/" + params, { headers: headers });
    }
    //put 
    putInputParams(url, params) {
        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
            'token': (localStorage.token === undefined) ? '' : JSON.parse(localStorage.token),
            'Session_id': localStorage.session

        });
        return this.http.put(AppSettings.baseUrl + url, params, { headers: headers });
    }
    deleteInputParamsUrl(url, params) {
        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
            'token': (localStorage.token === undefined) ? '' : JSON.parse(localStorage.token),
            'Session_id': localStorage.session
        });
        return this.http.delete(AppSettings.baseUrl + url + "/" + params, { headers: headers });
    }
    deleteInputParams(url) {
        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
            'token': (localStorage.token === undefined) ? '' : JSON.parse(localStorage.token),
            'Session_id': localStorage.session
        });
        return this.http.delete(AppSettings.baseUrl + url, { headers: headers });
    }

    postParams(url) {
        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
            'token': (localStorage.token === undefined) ? '' : JSON.parse(localStorage.token),
            'Session_id': localStorage.session
        });
        return this.http.get(AppSettings.baseUrl + url, { headers: headers });
    }
    // inputParams(url){
    //     const headers = new Headers({
    //         'Content-Type': "application/x-www-form-urlencoded",
    //         'token': localStorage.token,
    //         'session_id': localStorage.session
    //     });
    //     return this.http.get(AppSettings.baseUrl + url, { headers: headers });
    // }

    //get IND locations
    getProducts(): Observable<any> {
        return this.getInputParams('dhukan/products');
    }

    getSubProducts(catId): Observable<any> {
        return this.getInputParamsUrl('dhukan/subcatproducts', catId);
    }
    getCatProducts(params): Observable<any> {
        return this.getInputParamsUrl('dhukan/catproducts', params)
    }

    //get dashboard
    getDashboard(): Observable<any> {
        return this.postParams('dashboard');
    }

    addCat(params): Observable<any> {
        return this.postInputParams('cart/cart-list', params);
    }
    addWish(params): Observable<any> {
        return this.postInputParams('cart/wish_list', params);
    }
    deleteCart(params): Observable<any> {
        return this.deleteInputParamsUrl('cart/cart-list', params);
    }
    addAddress(params): Observable<any> {
        return this.postInputParamsUrl('users/add_address', params);
    }

    updateAddress(params): Observable<any> {
        return this.postInputParams('users/update_address', params);
    }

    emptyCart(): Observable<any> {
        return this.deleteInputParams('cart/cart-list');
    }
    showProductDetails(indata): Observable<any> {
        return this.getInputParamsUrl('dhukan/product', indata);
    }
    faq(): Observable<any> {
        return this.getInputParams('users/faq')
    }
    terms(): Observable<any> {
        return this.getInputParams('users/terms_and_conditions')
    }
    rateChange(params): Observable<any> {
        return this.postInputParams('users/rate/app', params)
    }
    // modifyCart(params): Observable<any> {
    //     return this.putInputParams('cart/cart-list ', params);
    // }
    getsearchProducts(params): Observable<any> {
        return this.getInputParamsUrl('dhukan/prdsrc', params);
    }
    // searchProdCat(params): Observable<any> {
    //     return this.getInputParamsUrl('dhukan/catprdsrc', params);
    // }


    applyVocher(vocher, amount) {
        var inData = "vocherCode=" + vocher + "&amount=" + amount;
        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
        });

        this.http.post(AppSettings.baseUrl + 'voucher/findvoucher', inData, { headers: headers }).subscribe(res => {
            if (res.json().status === 200) {
                swal(res.json().message, '', 'success');
            } else {
                swal(res.json().message, '', 'error');
            }
        })
    }
    viewCart;
    cartCount;

    getCartList() {
        // this.http.post(AppSettings.baseUrl + 'voucher/findvoucher', inData, { headers: headers }).subscribe(res => {
        //     if (res.json().status === 200) {
        //         swal(res.json().message, '', 'success');
        //     } else {
        //         swal(res.json().message, '', 'error');
        //     }
        // })

        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
            'token': (localStorage.token === undefined) ? '' : JSON.parse(localStorage.token),
            'Session_id': localStorage.session
        });
        this.http.get(AppSettings.baseUrl + 'cart/cart-list', { headers: headers }).subscribe(response => {
            this.viewCart = response.json().data;
            for (var i = 0; i < this.viewCart.length; i++) {
                this.viewCart[i].product_image = this.viewCart[i].sku[0].skuImages[0];
                this.viewCart[i].mrp = this.viewCart[i].sku[0].mrp;
                this.viewCart[i].selling_price = this.viewCart[i].sku[0].selling_price;
                this.viewCart[i].selling_price = this.viewCart[i].sku[0].selling_price;
            }
            if (response.json().summary === undefined) {
                this.cartCount = 0;
            } else {
                this.cartCount = response.json().summary.cart_count;

            }

        })

    }

    prodId;
    quantiy;
    quantity1;
    cartId;
    prodSku;

    itemHeaderDecrease(title, data, skuData) {
        this.prodId = data.product_id;
        this.quantiy = skuData.mycart;
        this.quantity1 = this.quantiy - 1;
        this.prodSku = data.product_sku_id;
        this.cartId = data.id;

        for (var i = 0; i < this.viewCart.length; i++) {
            for (var j = 0; j < this.viewCart[i].sku.length; j++) {
                if (skuData.skid === this.viewCart[i].sku[j].skid) {
                    if (this.quantiy === 1) {
                        this.viewCart[i].sku[0].mycart = this.quantiy - 1;
                        this.deleteCart(data.product_sku_id).subscribe(res => {
                            if (res.json().status === 200) {
                                swal(res.json().message, "", "success");
                                this.getDashboard();
                                this.getCartList();
                            } else {
                                swal(res.json().message, "", "error");
                            }

                        });
                        return;
                    } else {
                        this.modifyCart(this.prodId, this.quantity1, this.prodSku, this.cartId);

                        this.viewCart[i].sku[0].mycart = this.viewCart[i].sku[0].mycart - 1;
                        return;
                    }
                }
            }
        }
    }


    itemHeaderIncrease(title, data, skuData) {
        this.prodId = data.product_id;
        this.quantiy = skuData.mycart;
        this.quantity1 = this.quantiy + 1;
        this.prodSku = data.product_sku_id;
        this.cartId = data.id;
        this.modifyCart(this.prodId, this.quantity1, this.prodSku, this.cartId);
        for (var i = 0; i < this.viewCart.length; i++) {
            for (var j = 0; j < this.viewCart[i].sku.length; j++) {
                if (skuData.skid === this.viewCart[i].sku[j].skid) {
                    this.viewCart[i].sku[0].mycart = this.viewCart[i].sku[0].mycart + 1;

                    return;
                }
            }
        }
    }


    modifyCart(prodId, quantiy, prodSku, cartId) {
        var inData = "product_id=" + prodId +
            "&quantity=" + quantiy +
            "&product_sku_id=" + prodSku +
            "&Cartid=" + cartId


        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
            'token': (localStorage.token === undefined) ? '' : JSON.parse(localStorage.token),
            'Session_id': localStorage.session

        });

        this.http.put(AppSettings.baseUrl + 'cart/cart-list', inData, { headers: headers }).subscribe(response => {
            // this.viewCart = response.json().data;
            this.getCartList();
        })


        // this.headerSer.modifyCart(inData).subscribe(response => {
        // }, error => {

        // })
    }


    deleteCartData(prodId) {
        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
            'token': (localStorage.token === undefined) ? '' : JSON.parse(localStorage.token),
            'Session_id': localStorage.session
        });

        this.http.delete(AppSettings.baseUrl + 'cart/cart-list' + '/' + prodId, { headers: headers }).subscribe(response => {
            // this.viewCart = response.json().data;
            this.getCartList();
        })
    }


    //search products
    searchProducts(param) {
        var prodName = param;
        let navigationExtras: NavigationExtras = {
            queryParams: {
                prodName: prodName
            }
        }
        if (prodName == undefined) {
            swal("Required field is missing", "", "warning");
        } else {
            this.router.navigate(["/search"], navigationExtras);
        }

    }
    showCategories = false;
    showSubCats = false;
    selectedCat;

    categoriesWithSubCat = [];
    subCatList = [];
    categories = [];
    //show categories
    showCat() {
        this.showCategories = !this.showCategories;
        if (this.showCategories === false) {
            this.showSubCats = false;
        }
        this.getCategories();
        this.getAllCategoriesWithSubCat();
    }



    showSubCatProd(subId, index, name) {
        this.showCategories = false;
        this.showSubCats = false;
        let navigationExtras: NavigationExtras = {
            queryParams: {
                'sId': subId,
                'catName': name
            }
        };
        this.router.navigate(["/categoriesProducts"], navigationExtras)
    }
    results: any;
    banners = [];

    //get categories and subcategories
    getAllCategoriesWithSubCat() {


        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
        });
        this.http.post(AppSettings.baseUrl + 'dhukan/categories-list', { headers: headers }).subscribe(res => {
            this.results = res.json().result;
            this.categoriesWithSubCat = this.results.category;
            this.banners = this.results.banner;
        })


        // this.headerSer.getAllCatAndSubCat().subscribe(response => {
        //     this.results = response.json().result;
        //     this.categoriesWithSubCat = this.results.category;
        //     this.banners = this.results.banner;
        // });
    }

    //show Sub categories
    showSubCat(cId, index) {
        this.getAllCategoriesWithSubCat();
        this.showSubCats = true;
        this.selectedCat = index;
        for (var i = 0; i < this.categoriesWithSubCat.length; i++) {
            if (cId === this.categoriesWithSubCat[i].id) {
                this.subCatList = this.categoriesWithSubCat[i].subcategory;
                return;
            }
        }
        if (localStorage.token === undefined) {
            var inData = "Session_id =" + localStorage.session
        } else {
            var inData = "token =" + JSON.parse(localStorage.token);
        }


        // const headers = new Headers({
        //     'Content-Type': "application/x-www-form-urlencoded",
        //     'token': (localStorage.token === undefined) ? '' : JSON.parse(localStorage.token),
        //     'Session_id': localStorage.session

        // });

        // this.http.post(AppSettings.baseUrl + 'dhukan/categories-list', inData, { headers: headers }).subscribe(response => {
        //     // this.viewCart = response.json().data;
        //     // this.getCartList();
        // })


    }


    //get categories
    getCategories() {


        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
        });
        this.http.get(AppSettings.baseUrl + 'dhukan/categories', { headers: headers }).subscribe(res => {
            this.categories = res.json().result;
        })

    }




    // deleteCart(id) {
    //     var inData = id;
    //     swal("Do you want to delete?", "", "warning", {
    //         buttons: ["Cancel!", "Okay!"],
    //     }).then((value) => {

    //         if (value === true) {

    //             const headers = new Headers({
    //                 'Content-Type': "application/x-www-form-urlencoded",
    //                 'token': (localStorage.token === undefined) ? '' : JSON.parse(localStorage.token),
    //                 'Session_id': localStorage.session
    //             });
    //             this.http.delete(AppSettings.baseUrl + 'cart/cart-list' + "/" + inData, { headers: headers }).subscribe(res => {
    //                 this.getCartList();
    //                 // this.getDashboard();
    //                 swal("Deleted successfully", "", "success");
    //             })
    //             //     this.mainServe.deleteCart(inData).subscribe(response => {
    //             //       this.getCartList();
    //             //       this.getDashboard();
    //             //       swal("Deleted successfully", "", "success");
    //             //     }, error => {
    //             //       console.log(error);
    //             //     })
    //             //   } else {
    //             //     return;
    //             //   }


    //         }
    //     })
    // }
}
