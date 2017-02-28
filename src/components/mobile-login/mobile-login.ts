/**
 * Login screen
 */
import { riot, template } from '../riot-ts';
import store from '../../model/store';
import { userActions } from '../../model/users/actions';
import MobileLoginTemplate from './mobile-login.html!text';
import BaseElement from '../base-element';
import { USERS } from '../../model/action-types';
import * as utils from '../../model/utils';

let tag = null;
@template(MobileLoginTemplate)
export default class MobileLogin extends BaseElement {

    private static unsubscribe = null;
    private userLocation: any = {info:{}};

    constructor() {
        super();
    }

    mounted() {
        tag = this;

        if (MobileLogin.unsubscribe) MobileLogin.unsubscribe();
        MobileLogin.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));

        this.checkLocation();
        this.ssoLogin();
    }

    ssoLogin() {
        let idToken = utils.getIdToken();

        if (idToken) {
            let params = {
                idToken: idToken,
                res: 'web'
            };
            store.dispatch(userActions.ssoLogin(params));
        }        
    }

    checkLocation() {
        let url = 'https://keys.flashcoin.io/api/check-location';
        $.ajax({
            url: url,
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            success: function (data) {
                if (data.rc == 1) {
                    this.userLocation = data;
                    localStorage.setItem('flc-location', JSON.stringify(data));
                }
            }
        });
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.userData;
        let type = state.lastAction.type;

        switch (type) {
            case USERS.LOGIN_FAILED:
                super.showError('Login failed', 'Email or password is not correct');
                break;
            case USERS.NEED_VERIFY_GOOGLE_2FA:
                riot.mount('#confirm-send', 'twofa-verification-dialog', data.loginData);
                break;
            default:
                break;
        }

        this.update();
    }

    onLoginButtonClick(event: Event) {
        let email: string = $('#username').val();
        if (!email || email.trim().length == 0) {
            super.showError('', 'Email is needed to login');
            // TODO focus to email feild

            return false;
        }

        if (!utils.isValidEmail(email)) {
            super.showError('', 'Invalid email format');
            return false;
        }

        let password: string = $('#password').val();
        if (!password || password.trim().length == 0) {
            super.showError('', 'Password is needed to login');
            // TODO focus to email

            return false;
        }

        store.dispatch(userActions.login(email, password));
    }

    onForgotPasswordLinkClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        riot.mount('#main', 'submit-email');
    }
}

interface LPEvent extends Event {
    target: LPEventTaget;
}

interface LPEventTaget extends EventTarget {
    checked: boolean;
}
