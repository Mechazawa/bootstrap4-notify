/// <reference types="jquery" />

export type NotifyType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | (string & {});

export type NotifyPosition = `${'top' | 'bottom'}-${'left' | 'center' | 'right'}`;

export interface NotifyContent {
    message: string;
    title?: string;
    icon?: string;
    url?: string;
    target?: string;
}

export interface NotifySettings {
    element?: string | Element | JQuery;
    position?: string | null;
    type?: NotifyType;
    allow_dismiss?: boolean;
    allow_duplicates?: boolean;
    newest_on_top?: boolean;
    showProgressbar?: boolean;
    placement?: {
        from?: 'top' | 'bottom';
        align?: 'left' | 'center' | 'right';
    };
    offset?: number | { x: number; y: number };
    spacing?: number;
    z_index?: number;
    delay?: number;
    timer?: number;
    url_target?: string;
    mouse_over?: 'pause' | null;
    animate?: {
        enter?: string;
        exit?: string;
    };
    onShow?: ((this: JQuery) => void) | null;
    onShown?: ((this: HTMLElement) => void) | null;
    onClose?: ((this: JQuery) => void) | null;
    onClosed?: ((this: HTMLElement) => void) | null;
    onClick?: ((this: HTMLElement, event: JQuery.ClickEvent) => void) | null;
    icon_type?: 'class' | 'image' | (string & {});
    template?: string;
}

export interface NotifyUpdateCommands {
    type?: NotifyType;
    title?: string;
    message?: string;
    icon?: string;
    progress?: number;
    url?: string;
    target?: string;
    [element: string]: unknown;
}

export interface NotifyInstance {
    $ele: JQuery;
    update(commands: NotifyUpdateCommands): void;
    update<K extends keyof NotifyUpdateCommands>(command: K, value: NotifyUpdateCommands[K]): void;
    close(): void;
}

/** Returns undefined when `allow_duplicates` is false and the same notification is already open. */
export function notify(content: string | NotifyContent, settings?: NotifySettings): NotifyInstance | undefined;
export function notifyDefaults(settings: NotifySettings): NotifySettings;
export function notifyClose(selector?: 'all' | NotifyType | NotifyPosition | string): void;
export function notifyCloseExcept(selector: NotifyType | string): void;

declare global {
    interface JQueryStatic {
        notify: typeof notify;
        notifyDefaults: typeof notifyDefaults;
        notifyClose: typeof notifyClose;
        notifyCloseExcept: typeof notifyCloseExcept;
    }
}
