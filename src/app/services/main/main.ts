import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AppSettings } from '../../config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class MainService {
    constructor(private http: Http, public router: Router, private translate: TranslateService
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
            'session_id': localStorage.session
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
        return this.postInputParamsUrl('dhukan/subcatproducts/', catId);
    }
    getCatProducts(params): Observable<any> {
        return this.getInputParamsUrl('dhukan/catproducts', params)
    }

    //get dashboard
    getDashboard(): Observable<any> {
        return this.postParams('dashboard');
    }
    getCartList(): Observable<any> {

        return this.getInputParams('cart/cart-list');
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
    searchProducts(params): Observable<any> {
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
};