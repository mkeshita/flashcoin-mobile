/**
 * Base Element
 */
import { riot, template, Element } from './riot-ts';

export default class BaseElement extends Element {

    protected static framework7 = new Framework7();

    /**
     * Show error dialog
     */
    protected showError(title: string, message: string, cb = null) {
        if (!title || title.length == 0) {
            title = 'Error';
        }
        riot.mount('#error-dialog', 'error-alert', { title: title, message: message, callback: cb });

        BaseElement.framework7.addNotification({
            title: title,
            message: message
        });
    }

    showMessage(title: string, message: string, cb = null) {
        if (!title || title.length == 0) {
            title = 'Infomation';
        }
        riot.mount('#error-dialog', 'message-dialog', { title: title, message: message, callback: cb });
    }
}
