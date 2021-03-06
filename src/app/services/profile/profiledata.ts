import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AppSettings } from '../../config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ProfileService {
    constructor(private http: Http, public router: Router, private translate: TranslateService
    ) { }

    //get
    getInputParams(url) {
        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
            'token': JSON.parse(localStorage.token),

        });
        return this.http.get(AppSettings.baseUrl + url, { headers: headers });
    }

    //put
    putInputParams(url, params) {
        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
            'token': JSON.parse(localStorage.token),
        });
        return this.http.put(AppSettings.baseUrl + url, params, { headers: headers });
    }

    //delete
    deleteInputParams(url, params) {
        const headers = new Headers({
            'Content-Type': "application/json",
            'token': JSON.parse(localStorage.token),

        });
        return this.http.post(AppSettings.baseUrl + url, params, { headers: headers });
    }
    //post
    postInputParamsUrl(url, params) {
        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
            'token': JSON.parse(localStorage.token),
            // 'Session_id': localStorage.session
        });
        return this.http.post(AppSettings.baseUrl + url, params, { headers: headers });
    }
    postInputParams(url) {
        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
            // 'Token': JSON.parse(localStorage.token),
            // 'Session_id': localStorage.session
        });
        return this.http.post(AppSettings.baseUrl + url, { headers: headers });
    }

    //get profile details
    getProfileDetails(): Observable<any> {
        return this.getInputParams('users/my_profile');
    }

    //update profile
    updateProfile(params): Observable<any> {
        return this.putInputParams('users/update_profile', params);
    }
    getRefCode(email): Observable<any> {
        return this.postInputParamsUrl('users/refferal/friend', email);
    }

    //get address

    getInputParamsUrl(url) {
        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
            'token': JSON.parse(localStorage.token),
            // 'mobile': localStorage.userMobile,
            // 'Session_id': localStorage.session
        });
        return this.http.get(AppSettings.baseUrl + url, { headers: headers });
    }

    getAddress(): Observable<any> {
        return this.getInputParams('users/my_address');
    }
    deleteWish(params): Observable<any> {
        return this.postInputParamsUrl('cart/deleteWishlistById', params);
    }

    //add address
    addAddress(params): Observable<any> {
        return this.postInputParamsUrl('users/add_address', params);
    }
    myOrders(): Observable<any> {
        return this.postInputParams('dashboard/myorders');
    }
    changePw(params): Observable<any> {
        return this.postInputParamsUrl('users/changepassword', params);
    }

    setDefaultAdd(addId) {
        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
            'token': JSON.parse(localStorage.token)
        });
        var params = "address_id=" + addId
        this.http.post(AppSettings.baseUrl + 'users/set_default_address', params, { headers: headers }).subscribe(response => {
            if (response.json().status === 200) {
                swal('selected successfully', '', 'success');
            } else {
                swal(response.json().message, '', 'error');
            }
        })
    }
    getWishList(): Observable<any> {
        return this.getInputParams('cart/getwishlist');
    }
    emptyWish(params): Observable<any> {
        return this.deleteInputParams('cart/deleteWishlistByUserId', params);
    }
};

