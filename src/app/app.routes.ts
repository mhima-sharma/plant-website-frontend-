import { Routes } from '@angular/router';
import { ShowCaseOfMyProjectComponent } from '../show-case-of-my-project/show-case-of-my-project.component';
import { LoginAdminComponent } from '../userProfile/login-admin/login-admin.component';
import { SignupAdminComponent } from '../userProfile/signup-admin/signup-admin.component';
import { LoginUserComponent } from '../userProfile/login-user/login-user.component';
import { SignupUserComponent } from '../userProfile/signup-user/signup-user.component';
import { StoreComponent } from '../elements/store/store.component';
import { AboutUsComponent } from '../elements/about-us/about-us.component';
import { ContactUsComponent } from '../elements/contact-us/contact-us.component';
import { CartComponent } from '../elements/cart/cart.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { CreateproductComponent } from '../createproduct/createproduct.component';
import { BuynowComponent } from '../elements/buynow/buynow.component';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { ChatComponent } from './chat/chat.component';
import { SuccessPaymentComponent } from '../success-payment/success-payment.component';
import { FaliedPaymentComponent } from '../falied-payment/falied-payment.component';
import { ExtraComponent } from '../extra/extra.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { IntroductionComponent } from '../elements/introduction/introduction.component';
import { TermPolicyComponent } from '../elements/term-policy/term-policy.component';

export const routes: Routes = [
    { path: 'show', component: ShowCaseOfMyProjectComponent },
    { path: 'admin-login', component: LoginAdminComponent },
    
    // { path: 'user-login', component: LoginAdminComponent },
    { path: '', component: LoginUserComponent },
    { path: 'signup-admin', component: SignupAdminComponent },
    { path: 'signup-user', component: SignupUserComponent },
    { path: 'store', component: StoreComponent },
    { path: 'about', component: AboutUsComponent },
    { path: 'contact', component: ContactUsComponent },
    { path: 'cart', component: CartComponent },
    { path: 'admindash', component: AdminDashboardComponent },
    { path: 'addProduct', component: CreateproductComponent },
    { path: 'buynow', component: BuynowComponent },
    { path: 'product/:id', component: ProductDetailsComponent },
    { path: 'chat1', component: ChatComponent },
    { path: 'paysucess', component: SuccessPaymentComponent },
    { path: 'payfail', component: FaliedPaymentComponent},
    { path: 'extra', component: ExtraComponent},
    { path: 'chat', component: ChatbotComponent},
    { path: 'intro', component: IntroductionComponent},
    { path: 'terms', component: TermPolicyComponent}






    // { path: 'productDetail', component: ProductDetailsComponent }








];
