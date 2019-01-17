import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AppSettings } from '../../config';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import swal from 'sweetalert';

import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class DataService {
    private user: Observable<firebase.User>;
    private userDetails: firebase.User = null;
    constructor(private http: Http, private _router: Router, private _firebaseAuth: AngularFireAuth) {
        this.user = _firebaseAuth.authState;
        this.user.subscribe(
            (user) => {
                if (user) {
                    this.userDetails = user;
                    this.socialLogin(this.userDetails);
                }
                else {
                    this.userDetails = null;
                }
            }
        );
    }
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

    socialLogin(data) {
        var inData = {
            "first_name": data.providerData[0].displayName,
            "last_name": '',
            "email": data.providerData[0].email,
            "mobile": data.providerData[0].phoneNumber,
            "google_id": data.providerData[0].uid
        }
        this.http.post(AppSettings.baseUrl + 'customer/social', inData).subscribe(response => {
            localStorage.setItem('userId', JSON.stringify(response.json().result[0]._id));
            localStorage.setItem('userName', JSON.stringify(response.json().result[0].first_name + ' ' + response.json().result[0].last_name));
            localStorage.setItem('authkey', response.json().key);
            localStorage.setItem('userData', JSON.stringify(response.json().result[0]));
            localStorage.setItem("userMobile", response.json().result[0].mobile);
            localStorage.setItem('issocial', 'true');
        });
    }

    signInWithGoogle() {
        return this._firebaseAuth.auth.signInWithPopup(
            new firebase.auth.GoogleAuthProvider()
        )
    }
}