import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AppSettings } from '../../config';
import { Router } from '@angular/router';
import swal from 'sweetalert';

@Injectable()
export class DataService {
    constructor(private http: Http, private _router: Router) { }
    msg;
    //checking url after login
    checkCredentials() {
        if (localStorage.getItem("userName") !== null) {
            this._router.navigate(['/sidemenu']);
        }
    }
    //logout
    logout() {
        localStorage.removeItem('userName');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('login');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('classId');
        localStorage.removeItem('conceptsFirstData');
        localStorage.removeItem('subjectsFirtItem');
    }

    postInputParams(params, url) {
        const headers = new Headers({
            'Content-Type': "application/x-www-form-urlencoded",
        });
        return this.http.post(AppSettings.baseUrl + url, params, { headers: headers });
    }

    //login
    login(params): Observable<any> {
        return this.postInputParams(params, 'users/login');
    }

    //otp request
    requestOtp(phone): Observable<any> {
        return this.postInputParams(phone, 'users/request_otp');
    }

    //registraton
    registration(params): Observable<any> {
        return this.postInputParams(params, 'users/registration');
    }
}