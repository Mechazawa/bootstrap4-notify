import $ from 'jquery';
import { afterEach, beforeEach, describe, expect, it, onTestFinished, vi } from 'vitest';
import { notify, notifyClose, notifyCloseExcept, notifyDefaults } from '../src/bootstrap-notify.js';

const containers = () => $('[data-notify="container"]');
const openContainers = () => containers().not('[data-closing="true"]');

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
});

describe('rendering', () => {
    it('renders the type as Bootstrap 4 alert and progress bar classes', () => {
        notify({ title: 'Title', message: 'Message' }, { type: 'success', showProgressbar: true });

        expect(containers().hasClass('alert-success')).toBe(true);
        expect(containers().find('.progress-bar').hasClass('bg-success')).toBe(true);
        expect(containers().find('[data-notify="title"]').text()).toBe('Title');
        expect(containers().find('[data-notify="message"]').text()).toBe('Message');
    });

    it('accepts a plain string as the message', () => {
        notify('Hello');

        expect(containers().find('[data-notify="message"]').text()).toBe('Hello');
    });

    it('keeps escaped template tokens', () => {
        notify('Hello', { template: '<div data-notify="container">{{1}} {1}</div>' });

        expect(containers().text()).toBe('{{1}} ');
    });

    it('removes the progress bar unless showProgressbar is set', () => {
        notify('Hello');

        expect(containers().find('[data-notify="progressbar"]')).toHaveLength(0);
    });

    it('hides the dismiss button when allow_dismiss is false', () => {
        notify('Hello', { allow_dismiss: false });

        expect(containers().find('[data-notify="dismiss"]').css('display')).toBe('none');
    });

    it('uses url_target when the content has no target', () => {
        notify({ message: 'Hello', url: 'https://example.com' }, { url_target: '_self' });

        expect(containers().find('[data-notify="url"]').attr('target')).toBe('_self');
    });

    it('skips a duplicate when allow_duplicates is false', () => {
        notify({ title: 'Title', message: 'Line<br/>break' });
        const duplicate = notify({ title: 'Title', message: 'Line<br>break' }, { allow_duplicates: false });

        expect(duplicate).toBeUndefined();
        expect(containers()).toHaveLength(1);
    });

    it('adds an image icon when icon_type is image', () => {
        notify({ message: 'Hello', icon: 'icon.png' }, { icon_type: 'image' });

        expect(containers().find('[data-notify="icon"] img').attr('src')).toBe('icon.png');
    });
});

describe('update', () => {
    it('swaps the alert and progress bar classes when the type changes', () => {
        const notification = notify('Hello', { type: 'info', showProgressbar: true });

        notification.update('type', 'danger');

        expect(containers().hasClass('alert-info')).toBe(false);
        expect(containers().hasClass('alert-danger')).toBe(true);
        expect(containers().find('.progress-bar').attr('class')).toBe('progress-bar bg-danger');
    });

    it('applies several commands in one call', () => {
        const notification = notify('Hello', { showProgressbar: true });

        notification.update({ message: 'Saved', progress: 40, url: '/next' });

        expect(containers().find('[data-notify="message"]').text()).toBe('Saved');
        expect(containers().find('.progress-bar').css('width')).toBe('40%');
        expect(containers().find('[data-notify="url"]').attr('href')).toBe('/next');
    });

    it('replaces the previous icon class on each icon update', () => {
        const notification = notify({ message: 'Hello', icon: 'icon-a' });

        notification.update({ icon: 'icon-b' });
        notification.update({ icon: 'icon-c' });

        expect(containers().find('[data-notify="icon"]').attr('class')).toBe('icon-c');
    });

    it('updates the src of an image icon', () => {
        const notification = notify({ message: 'Hello', icon: 'a.png' }, { icon_type: 'image' });

        notification.update('icon', 'b.png');

        expect(containers().find('[data-notify="icon"] img').attr('src')).toBe('b.png');
    });
});

describe('closing', () => {
    it('closes after the delay and removes the element', () => {
        const onClosed = vi.fn();

        notify('Hello', { delay: 2000, timer: 1000, onClosed });
        vi.advanceTimersByTime(3000);

        expect(containers().attr('data-closing')).toBe('true');

        vi.advanceTimersByTime(600);

        expect(containers()).toHaveLength(0);
        expect(onClosed).toHaveBeenCalledOnce();
    });

    it('runs the close callbacks once when closed before the delay', () => {
        const onClose = vi.fn();
        const onClosed = vi.fn();
        const notification = notify('Hello', { delay: 1000, onClose, onClosed });

        notification.close();
        notification.close();
        vi.advanceTimersByTime(5000);

        expect(onClose).toHaveBeenCalledOnce();
        expect(onClosed).toHaveBeenCalledOnce();
    });

    it('does not run onClick for a click on the dismiss button', () => {
        const onClick = vi.fn();

        notify('Hello', { onClick });
        containers().find('[data-notify="dismiss"] span').trigger('click');
        containers().find('[data-notify="message"]').trigger('click');

        expect(onClick).toHaveBeenCalledOnce();
    });

    it.each([
        [undefined, 0],
        ['all', 0],
        ['danger', 2],
        ['bottom-left', 2],
        ['.custom', 2],
    ])('notifyClose(%s) closes the matching notifications', (selector, remaining) => {
        notify('A', { type: 'danger' });
        notify('B', { placement: { from: 'bottom', align: 'left' } });
        notify('C', { template: '<div data-notify="container" class="custom alert alert-{0}"><span data-notify="dismiss"></span></div>' });

        notifyClose(selector);

        expect(openContainers()).toHaveLength(remaining);
    });

    it('notifyCloseExcept keeps the notifications of the given type', () => {
        notify('A', { type: 'primary' });
        notify('B', { type: 'warning' });

        notifyCloseExcept('primary');

        expect(openContainers()).toHaveLength(1);
        expect(openContainers().hasClass('alert-primary')).toBe(true);
    });
});

describe('jQuery integration', () => {
    it('registers the functions on $', () => {
        expect($.notify).toBe(notify);
        expect($.notifyDefaults).toBe(notifyDefaults);
        expect($.notifyClose).toBe(notifyClose);
        expect($.notifyCloseExcept).toBe(notifyCloseExcept);
    });

    it('merges notifyDefaults into later notifications', () => {
        const previous = notifyDefaults({});

        onTestFinished(() => notifyDefaults(previous));
        notifyDefaults({ type: 'warning', placement: { from: 'bottom' } });
        notify('Hello');

        expect(containers().hasClass('alert-warning')).toBe(true);
        expect(containers().attr('data-notify-position')).toBe('bottom-right');
    });
});
