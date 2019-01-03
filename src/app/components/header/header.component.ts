import { MainService } from './../../services/main/main';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { DataService } from '../../services/login/login';
import { HeaderService } from '../../services/header/header';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert';
import { Http, Headers } from '@angular/http';
import { AppSettings } from '../../config';
import * as _ from 'underscore';
import { AppComponent } from '../../app.component';
import { } from 'googlemaps';


// import {
//   AuthService,
// } from 'angular-6-social-login';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cart: any;
  errorMessage: any;
  cartCount: any;
  deliveryCharge: any;
  subTotal: any;
  Total: any;
  status: any;
  viewCart = [];
  summary = [];
  google: any;
  constructor(
    public loginService: DataService,
    private translate: TranslateService,
    public mainServe: MainService,
    public dialog: MatDialog,
    public router: Router,
    public http: Http,
    // private socialAuthService: AuthService,
    private headerSer: HeaderService,
    public app: AppComponent
  ) {
    this.getDashboard();
    this.getCartList();
  }
  data = {
    mycart: 0
  }

  ngOnInit() {
    this.phone = localStorage.userMobile;
    this.getDashboard();
    this.geoLocation();
    this.getLocation();
    this.getCategories();
    this.getAllCategoriesWithSubCat();
    if (localStorage.userData !== undefined) {
      this.showProfile = true;
      this.showLoginButton = false;
    }
    if (localStorage.location == "undefined") {
      this.location = '';
      this.LocationPincode = '';
    } else {
      this.location = localStorage.location;
      this.LocationPincode = localStorage.pincode;
    }
    // if (localStorage.location !== undefined) {
    //   this.location = localStorage.location;
    //   this.LocationPincode = localStorage.pincode;
    // } else if (localStorage.location == "undefined") {
    //   alert('hi');
    //   this.location = '';
    //   this.LocationPincode = '';
    // }

    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
      });
    };



  }

  showProfile: boolean;
  showLoginButton = true;
  showModal = false;
  showOpacity = false;
  showLocations = false;
  showSubLocations = false;
  item = {
    quantity: 1
  }

  showLogin = false;
  hideLocations = false;
  showLoginandRegistration = true;
  showRegistration = false;
  showOtp = false;
  showForgotPassword = false;
  showCategories = false;
  showSubCats = false;
  showChangePassword = false;
  otpData;
  location: string;
  LocationPincode: any;
  msg;
  locationName;
  pincodeOfLocation;
  subLocationName;
  locationData = [];
  subLocationData = [];
  categories = [];
  categoriesWithSubCat = [];
  subCatList = [];
  selectedCat;
  offersList = [];
  banners = [];
  countriesData = [];
  results: any;
  showPasswordOtp = false;
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    referalCode: '',
    otp: '',
    lId: '',
    pincode: '',
    searchParam: ''
  }
  forData = {
    forEmail: '',
    newPassword: ''
  }
  phone;


  //in popup login button

  showLoginScreen() {
    this.showLogin = true;
    this.showRegistration = false;

  }
  //in popup registratin button
  showRegistrationScreen() {
    this.showRegistration = true;
    this.showLogin = false;
  }


  //login link
  openLogin() {
    this.showModal = true;
    this.showLoginandRegistration = true;
    this.showLogin = true;
    this.showRegistration = false;
    this.showOpacity = true;
    this.showForgotPassword = false;
    this.showOtp = false;
    this.formData.phone = '';
    this.showChangePassword = false;
    this.formData.password = '';
    this.showPasswordOtp = false;
  }

  //registration link
  openRegistration() {
    this.showModal = true;
    this.showLogin = false;
    this.showLoginandRegistration = true;
    this.showRegistration = true;
    this.showOpacity = true;
    this.showForgotPassword = false;
    this.showOtp = false;
    this.formData.firstName = '';
    this.formData.lastName = '';
    this.formData.email = '';
    this.formData.phone = '';
    this.formData.password = '';
    this.formData.referalCode = '';
    this.formData.otp = '';
    this.showChangePassword = false;
    this.showPasswordOtp = false;
  }

  //forgot password
  openForgotpassword() {
    this.showForgotPassword = true;
    this.showOpacity = true;
    this.showLoginandRegistration = false;
    this.showChangePassword = false;
    this.showOtp = false;
    this.formData.email = '';
    this.showPasswordOtp = false;
  }

  forgotPassword() {
    var inData = "email=" + this.forData.forEmail + "&phone=" + this.forData.forEmail;

    if (this.forData.forEmail === '' || this.forData.forEmail === undefined || this.forData.forEmail === null) {
      swal('Missing Mandatory field', '', 'error');
    }
    else {
      this.headerSer.forgotPassword(inData).subscribe(response => {
        if (response.json().status === 400) {
          swal(response.json().message, "", "error");
        } else {
          swal("OTP sent to your Mobile/Email succesfully", "", "success");
          // this.forData.forEmail = '';
          this.showForgotPassword = false;
          this.showModal = true;
          this.showOpacity = true;
          this.showPasswordOtp = true;
          // this.onCloseCancel();
        }
      }, error => {
        console.log(error);
      })
    }
  }

  verifyOtp() {
    var inData = {
      email: this.forData.forEmail,
      phone: this.forData.forEmail,
      otp: this.formData.otp
    };
    if (this.formData.otp === '' || this.formData.otp === undefined || this.formData.otp === null) {
      swal('Missing Mandatory field', '', 'error');

    }
    else {
      this.headerSer.verifyPassword(inData).subscribe(response => {
        if (response.json().status === 400) {
          swal(response.json().message, "", "error");
        } else {
          swal("OTP verified successfully", "", "success");
          // this.forData.forEmail = '';
          this.showOpacity = true;
          this.showModal = true;
          this.showChangePassword = true;
          // this.onCloseCancel();
        }
      }, error => {
        console.log(error);
      })
    }
  }

  changePassword(pp) {
    var inData = "phone=" + this.forData.forEmail + "&password=" + this.forData.newPassword;
    if (this.forData.newPassword === '' || this.forData.newPassword === undefined || this.forData.newPassword === null) {
      swal('Missing Mandatory field', '', 'error');
    } else {
      this.headerSer.forgotChangePassword(inData).subscribe(response => {
        if (response.json().status === 400) {
          swal(response.json().message, "", "error");
        } else {
          swal(response.json().message, "", "success");
          this.forData.forEmail = '';
          this.showPasswordOtp = false;
          this.showOpacity = false;
          this.showModal = false;
          this.showChangePassword = false;

          this.onCloseCancel();
        }
      }, error => {
        console.log(error);
      })
    }
  }



  logout() {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    this.router.navigate(["/"]);
    this.showProfile = false;
    this.showLoginButton = true;
  }

  //close popup
  onCloseCancel() {
    this.showModal = false;
    if (this.showModal === false) {
      this.showOpacity = false;
    }
  }
  //login
  login() {

    var validdata = false;

    if (this.formData.phone === '' || this.formData.phone === undefined || this.formData.phone === null ||
      this.formData.password === '' || this.formData.password === undefined || this.formData.password === null) {
      swal('Missing Mandatory field', '', 'error');
      validdata = false;
    } else {
      validdata = true;
    }

    if (validdata) {
      var inData = "phone=" + this.formData.phone +
        "&password=" + this.formData.password +
        "&device_id=" + "abcd12_123" +
        "&device_token=" + "abcd12_123" +
        "&device_type=" + "Desktop"

      this.loginService.login(inData).subscribe(response => {
        if (response.json().status === 400) {
          swal(response.json().message, " ", "error")
        } else {
          swal("Login Successfully", " ", "success");
          localStorage.setItem('userData', JSON.stringify(response.json().data));
          localStorage.setItem('token', JSON.stringify(response.json().token));
          localStorage.setItem('userId', JSON.stringify(response.json().data.u_id));
          localStorage.setItem('userMobile', (response.json().data.phone));
          this.onCloseCancel();
          this.showProfile = true;
          this.phone = localStorage.userMobile;
          this.showLoginButton = false;
          this.router.navigate(["/"]);
        }
      });
    }

  }

  //otp verification
  openOtpScreen() {
    var validData = false;

    //validations
    if (this.formData.firstName === '' || this.formData.firstName === undefined || this.formData.firstName === null ||
      this.formData.lastName === '' || this.formData.lastName === undefined || this.formData.lastName === null ||
      this.formData.email === '' || this.formData.email === undefined || this.formData.email === null ||
      this.formData.phone === '' || this.formData.phone === undefined || this.formData.phone === null ||
      this.formData.password === '' || this.formData.password === undefined || this.formData.password === null) {
      validData = false;
      swal('Missing Mandatory fields', '', 'error');
    } else {
      validData = true;
    }

    if (validData) {
      var inData = "phone=" + this.formData.phone;
      this.loginService.requestOtp(inData).subscribe(response => {
        this.otpData = response.json();
        // if (response.json().error_field === '') {
        swal("Otp Sent to your mobile number", " ", "success");
        this.showForgotPassword = false;
        this.showLoginandRegistration = false;
        this.showModal = true;
        this.showOpacity = true;
        this.showOtp = true;
        // } 

      }, err => {
        if (err.json().status === 400) {
          this.msg = this.translate.instant("common.loginErrMsg");
          swal(err.json().message, " ", "error").then((value) => {

          });
        };
      });
    }
  }

  //registration
  registration() {
    // var inData = "phone=" + this.formData.phone;
    var validOtp = false;
    if (this.formData.otp === '' || this.formData.otp === undefined || this.formData.otp === null) {
      swal('Missing Mandatory fields', '', 'error');
      validOtp = false;
    } else {
      validOtp = true;
    }

    if (validOtp) {
      var inData = "first_name=" + this.formData.firstName +
        "&last_name=" + this.formData.lastName +
        "&email=" + this.formData.email +
        "&phone=" + this.formData.phone +
        "&password=" + this.formData.password +
        "&device_id=" + "abcd12_123" +
        "&device_token=" + "abcd12_123" +
        "&device_type=" + "Desktop"
      // "&referral_code=" + this.formData.referalCode

      this.loginService.registration(inData).subscribe(response => {
        this.otpData = response.json();
        if (response.json().err_field !== '') {
          swal(response.json().message, '', 'error');
        } else {
          swal("Thank you for registering with us Welcome to DHUKHAN", " ", "success");
          this.onCloseCancel();
          this.router.navigate(["/"]);
          this.showModal = false;
          this.showOpacity = false;
        }
      }, err => {
        if (err.json().status === 400) {
          this.msg = this.translate.instant("common.loginErrMsg");
          swal(err.json().message, " ", "error").then((value) => {
          });
        };
      });
    }
  }

  // facebooklogi
  socialSignIn(socialPlatform: string) {
    // let socialPlatformProvider;
    // if (socialPlatform == "facebook") {
    //   socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    // } else if (socialPlatform == "google") {
    //   socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    // }

    // this.socialAuthService.signIn(socialPlatformProvider).then(
    //   (userData) => {
    //     console.log(socialPlatform + " sign in data : ", userData);
    //     // Now sign-in with userData
    //     // ...

    //   }
    // );
  }

  prodId;
  quantiy;
  prodSku;
  cartId;
  quantity1;
  // cart items
  itemIncrease(title, data, skuData) {
    this.prodId = data.product_id;
    this.quantiy = skuData.mycart;
    this.quantity1 = this.quantiy + 1;
    this.prodSku = data.product_sku_id;
    this.cartId = data.id;
    this.modifyCart(this.prodId, this.quantity1, this.prodSku, this.cartId);
    for (var i = 0; i < this.viewCart.length; i++) {
      if (title === this.viewCart[i].title) {
        this.viewCart[i].sku[0].mycart = this.viewCart[i].sku[0].mycart + 1;

        return;
      }
    }
  }
  itemDecrease(title, data, skuData) {
    this.prodId = data.product_id;
    this.quantiy = skuData.mycart;
    this.quantity1 = this.quantiy - 1;
    this.prodSku = data.product_sku_id;
    this.cartId = data.id;
    this.modifyCart(this.prodId, this.quantity1, this.prodSku, this.cartId);
    for (var i = 0; i < this.viewCart.length; i++) {
      if (title === this.viewCart[i].title) {
        if (this.viewCart[i].sku[0].mycart === 1) {
          this.viewCart[i].sku[0].mycart = this.viewCart[i].sku[0].mycart - 1;
          this.deleteCart(data.product_sku_id);
          this.getDashboard();
          this.getCartList();
        } else {
          this.viewCart[i].sku[0].mycart = this.viewCart[i].sku[0].mycart - 1;
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
    this.headerSer.modifyCart(inData).subscribe(response => {
    }, error => {

    })
  }

  //change country
  changeCountry(value) {
    if (value === "IND") {
      this.headerSer.getINDLocations().subscribe(response => {
        this.showLocations = true;
        this.showSubLocations = false;
        this.locationData = response.json().locations;
      });
    } else if (value === 'UAE') {
      this.headerSer.getUAELocations().subscribe(response => {
        this.showLocations = true;
        this.showSubLocations = false;
        this.locationData = response.json().locations;
      });
    }
  }

  //change location
  changeLocation(locationID) {
    this.headerSer.getSubLocations(locationID).subscribe(response => {
      this.showSubLocations = true;
      this.subLocationData = response.json().locations;
    });
  }

  //change sublocation
  changeSubLocation() {
    for (var i = 0; i < this.subLocationData.length; i++) {
      if (this.formData.pincode === this.subLocationData[i].pincode) {
        this.subLocationName = this.subLocationData[i].address;
        this.pincodeOfLocation = this.subLocationData[i].pincode;
      }
    }
  }

  showLocation() {
    this.hideLocations = !this.hideLocations;
  }

  //submit location
  submitLocation() {

    var location = this.city + ',' + this.area;;
    localStorage.setItem('location', location);
    this.location = localStorage.location;
    this.hideLocations = false;

  }

  //get categories
  getCategories() {
    this.headerSer.getCategories().subscribe(response => {
      this.categories = response.json().result;
    });
  }



  //search products
  searchProducts(param) {
    var prodName = param;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        prodName: prodName
      }
    }
    if (prodName === '') {
      swal("Required field is missing", "", "warning");
    } else {
      this.router.navigate(["/search"], navigationExtras);
    }

  }

  //get categories and subcategories
  getAllCategoriesWithSubCat() {

    this.headerSer.getAllCatAndSubCat().subscribe(response => {
      this.results = response.json().result;
      this.categoriesWithSubCat = this.results.category;
      this.banners = this.results.banner;
    });
  }

  //show categories
  // showCat() {
  //   this.showCategories = !this.showCategories;
  //   if (this.showCategories === false) {
  //     this.showSubCats = false;
  //   }
  // }

  goHome() {
    this.showCategories = false;
    this.router.navigate(['/']);
  }
  //show Sub categories
  showSubCat(cId, index) {
    this.showSubCats = true;
    this.selectedCat = index;
    for (var i = 0; i < this.categoriesWithSubCat.length; i++) {
      if (cId === this.categoriesWithSubCat[i].id) {
        this.subCatList = this.categoriesWithSubCat[i].subcategory;
      }
    }
    if (localStorage.token === undefined) {
      var inData = "Session_id =" + localStorage.session
    } else {
      var inData = "token =" + JSON.parse(localStorage.token);
    }
    this.headerSer.showSubCat(inData).subscribe(response => {

    }, error => {

    })
  }


  showSubCatProd(subId, index, name) {

    let navigationExtras: NavigationExtras = {
      queryParams: {
        'sId': subId,
        'catName': name
      }
    };
    this.router.navigate(["/categoriesProducts"], navigationExtras)
  }

  getDashboard() {
    this.mainServe.getDashboard().subscribe(response => {
      this.cart = response.json();
      // if(response.json().cart.status === 200 ){
      this.cartCount = response.json().cart.cart_count || 0;
      this.deliveryCharge = response.json().cart.delivery_charge.toFixed(2);
      this.subTotal = response.json().cart.selling_price.toFixed(2);
      this.Total = response.json().cart.grand_total.toFixed(2);
      // }
      // else{

      // }
      // console.log(this.cart);
      // this.errorMessage = response.json().cart.message;
    });
  }
  getCartList() {
    this.mainServe.getCartList();
    // .subscribe(response => {
    //   this.viewCart = response.json().data;
    //   this.summary = response.json().summary;
    //   this.getDashboard();
    //   for (var i = 0; i < this.viewCart.length; i++) {
    //     // if (title === this.viewCart[i].title) {
    //     this.viewCart[i].quantity = this.viewCart[i].sku[0].mycart;
    //     return;
    //     // }
    //   }
    // });
  }
  deleteCart(id) {
    var inData = id;
    swal("Do you want to delete?", "", "warning", {
      buttons: ["Cancel!", "Okay!"],
    }).then((value) => {

      if (value === true) {
        this.mainServe.deleteCart(inData).subscribe(response => {
          this.getCartList();
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
  showCatProd(catId, i, name) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        'sId': catId,
        'catName': name,
        'action': 'category'
      }
    };
    this.router.navigate(["/categoriesProducts"], navigationExtras)
  }
  countryData = [];
  countrys = [];
  country;
  statesData = [];
  states = [];
  state;
  citysData = [];
  areas = []
  citys = [];
  city;
  area;
  areasData = [];
  countryVales = [];
  showState = false;
  showCity = false;
  showArea = false;
  getLocation() {

    this.http.get(AppSettings.baseUrl + 'users/get_locations').subscribe(res => {
      this.countriesData = res.json().result;
      for (var i = 0; i < this.countriesData.length; i++) {
        this.countryVales.push(this.countriesData[i].country);
      }

      for (var i = 0; i < this.countryVales.length; i++) {
        this.countrys = _.uniq(this.countryVales, function (obj) {
          return obj;
        });
      }
    });
  }


  //get state
  getStates(country) {
    this.showState = true;
    this.country = country;
    this.statesData = [];

    for (var i = 0; i < this.countriesData.length; i++) {
      if (this.countriesData[i].country === country) {
        this.statesData.push(this.countriesData[i].state);
      }
    }

    for (var i = 0; i < this.statesData.length; i++) {
      this.states = _.uniq(this.statesData, function (obj) {
        return obj;
      });
      // this.sValues.push(this.states);
    }
  }

  //get city
  getCitys(state) {
    this.showCity = true;
    this.state = state;
    this.citysData = [];
    this.areas = [];
    for (var i = 0; i < this.countriesData.length; i++) {
      if (this.countriesData[i].state === state) {
        this.citysData.push(this.countriesData[i].city);
      }
    }

    for (var i = 0; i < this.citysData.length; i++) {
      this.citys = _.uniq(this.citysData, function (obj) {
        return obj;
      });
    }
  }

  //get area
  getArea(city) {
    this.showArea = true;
    this.city = city;
    this.areasData = [];
    for (var i = 0; i < this.countriesData.length; i++) {
      if (this.countriesData[i].city === city) {
        this.areasData.push(this.countriesData[i].area);
      }
    }

    for (var i = 0; i < this.areasData.length; i++) {
      this.areas = _.uniq(this.areasData, function (obj) {
        return obj;
      });
    }
  }

  //chage area
  changeArea(area) {
    this.area = area;
  }
  latlocation;
  lanLocation;
  getPin;
  position;
  positionValue;
  geoLocation() {
    // if (navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(position => {
      this.latlocation = position.coords.latitude;
      this.lanLocation = position.coords.longitude;
      var latlng = { lat: this.latlocation, lng: this.lanLocation };
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'location': latlng }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          let result = results[0];
          this.position = result.address_components[0].short_name;
          this.positionValue = this.position.split('-');
          this.area = this.positionValue[0].trim();
          this.city = result.address_components[3].long_name;
          console.log(this.city);
          console.log(this.area);
          //   this.getPin = JSON.parse(results[0].address_components[5].long_name);
          //   localStorage.setItem('wh_pincode', this.getPin);
          //  let rsltAdrComponent = result.address_components;
          //   let resultLength = rsltAdrComponent.length;
          //   if (result != null) {
          //     console.log(rsltAdrComponent[resultLength - 5].short_name);
          //   } else {
          //     window.alert('Geocoder failed due to: ' + status);
          //   }
        }
      });
    });
    // }
  }
}

