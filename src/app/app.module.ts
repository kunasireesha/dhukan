import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImageZoomModule } from 'angular2-image-zoom';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import Popper from 'popper.js';
import swal from 'sweetalert';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, } from "angular-6-social-login";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyDatePickerModule } from 'mydatepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgmCoreModule } from '@agm/core';
import { SafePipeModule } from 'safe-pipe';

//components
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductComponent } from './components/product/product.component';
import { ProductSliderComponent } from './components/product-slider/product-slider.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ProductdetailsComponent } from './components/productdetails/productdetails.component';
import { DeliveryComponent } from './components/deliver.address/delivery.address';
import { MyprofileListComponent } from './components/myprofile-list/myprofile-list.component';
import { ViewcartComponent } from './components/viewcart/viewcart.component';
import { AllProductsComponent } from './components/searchproducts/allproducts';
import { SearchproductsComponent } from './components/searchproducts/searchproducts.component';

//services

import { DataService } from './services/login/login';
import { HeaderService } from './services/header/header';
import { MainService } from './services/main/main';
import { ProfileService } from './services/profile/profiledata';

import { AddressServices } from './services/deliveraddressdata/addressService';
// directive
import { NumberOnlyDirective, AlphabetsOnly, AlphaNumericOnly } from './directives/number';
import { GooglePlacesDirective } from './directives/google-places.directive';

import { ProductsDirective } from './directives/products';
import { OrdersComponent } from './components/orders/orders.component';
import { StaticComponent } from './components/static/static.component';




export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}


export function getAuthServiceConfigs() {
	let config = new AuthServiceConfig(
		[
			{
				id: FacebookLoginProvider.PROVIDER_ID,
				provider: new FacebookLoginProvider("Your-Facebook-app-id")
			},
			{
				id: GoogleLoginProvider.PROVIDER_ID,
				provider: new GoogleLoginProvider("Your-Google-Client-Id")
			}

		]
	);
	return config;
}

@NgModule({
	declarations: [
		AppComponent,
		MainComponent,
		HeaderComponent,
		FooterComponent,
		ProductComponent,
		ProductSliderComponent,
		CategoriesComponent,
		ProductdetailsComponent,
		DeliveryComponent,
		MyprofileListComponent,
		ViewcartComponent,
		NumberOnlyDirective,
		ProductsDirective,
		AlphabetsOnly,
		AlphaNumericOnly,
		GooglePlacesDirective,
		OrdersComponent,
		StaticComponent,
		SearchproductsComponent,
		AllProductsComponent
	],
	imports: [
		BrowserModule,
		MatDialogModule,
		BrowserAnimationsModule,
		HttpClientModule,
		FormsModule,
		AngularFontAwesomeModule,
		ImageZoomModule,
		HttpModule,
		NgSelectModule,
		SafePipeModule,
		ReactiveFormsModule,
		AgmCoreModule.forRoot({
			apiKey: "AIzaSyClUICP4-qGf2r4SSCZF5MzbSFXT6mIbvM",
			libraries: ["places"]
		}),
		SocialLoginModule,
		TooltipModule.forRoot(),
		CarouselModule.forRoot(),
		NgbModule.forRoot(),
		MyDatePickerModule,
		RouterModule.forRoot([

			{
				path: '',
				component: MainComponent
			},

			{
				path: 'categoriesProducts',
				component: CategoriesComponent,
				data: [{ page: 'veg-categories' }]
			},

			{
				path: 'productdetails',
				component: ProductdetailsComponent
			},
			{
				path: 'deliveryAddress',
				component: DeliveryComponent
			},
			{
				path: 'myprofileList',
				component: MyprofileListComponent
			},
			{
				path: 'myprofile',
				component: MyprofileListComponent,
				data: [{ page: 'my-profile' }]
			},
			{
				path: 'myorders',
				component: MyprofileListComponent,
				data: [{ page: 'myorders' }]
			},
			{
				path: 'mywallet',
				component: MyprofileListComponent,
				data: [{ page: 'mywallet' }]
			},
			{
				path: 'changepassword',
				component: MyprofileListComponent,
				data: [{ page: 'changepassword' }]
			},
			{
				path: 'referfriends',
				component: MyprofileListComponent,
				data: [{ page: 'referfriends' }]
			},
			{
				path: 'loyalitypoints',
				component: MyprofileListComponent,
				data: [{ page: 'loyalitypoints' }]
			},
			{
				path: 'notifications',
				component: MyprofileListComponent,
				data: [{ page: 'notifications' }]
			},
			{
				path: 'deliveryaddress',
				component: MyprofileListComponent,
				data: [{ page: 'deliveryaddress' }]
			},
			// {
			// 	path: 'mywishlist',
			// 	component: MyprofileListComponent,
			// 	data: [{ page: 'mywishlist' }]
			// },
			{
				path: 'paymentoptions',
				component: DeliveryComponent,
				data: [{ page: 'paymentoptions' }]
			},
			{
				path: 'viewcart',
				component: ViewcartComponent,
				data: [{ page: 'viewcart' }]
			},
			{
				path: 'faq',
				component: StaticComponent,
				data: [{ page: 'faq' }]
			},
			{
				path: 'termsandcond',
				component: StaticComponent,
				data: [{ page: 'termsandcond' }]
			},
			{
				path: 'aboutUs',
				component: StaticComponent,
				data: [{ page: 'aboutUs' }]
			},
			{
				path: 'rateapp',
				component: StaticComponent,
				data: [{ page: 'rateapp' }]
			},
			{
				path: 'privacyPolicy',
				component: StaticComponent,
				data: [{ page: 'privacyPolicy' }]
			},
			{
				path: 'contactUs',
				component: StaticComponent,
				data: [{ page: 'contactUs' }]
			},
			{
				path: 'deliveryInfo',
				component: StaticComponent,
				data: [{ page: 'deliveryInfo' }]
			},
			{
				path: 'search',
				component: SearchproductsComponent
			},
			// {
			// 	path: 'viewAll',
			// 	component: AllProductsComponent
			// },
			{
				path: 'mywishlist',
				component: AllProductsComponent,
				data: [{ page: 'mywishlist' }]
			},
			{
				path: 'viewAll',
				component: AllProductsComponent,
				data: [{ page: 'viewAll' }]
			}

		], { useHash: true }),
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		})
	],
	schemas: [NO_ERRORS_SCHEMA],
	providers: [DataService, HeaderService, MainService, ProfileService, AddressServices, MainComponent, {
		provide: AuthServiceConfig,
		useFactory: getAuthServiceConfigs
	}],
	bootstrap: [AppComponent],
	entryComponents: [],
	exports: [BrowserModule, TranslateModule]
})
export class AppModule {
	constructor() {
		if (localStorage.session === undefined || localStorage.session === '' || localStorage.session === null) {
			this.randomkey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			localStorage.setItem('session', this.randomkey)
		}
		console.log(localStorage.session);
	}
	randomkey;

}
