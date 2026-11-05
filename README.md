# bootstrap4-notify

Turns standard Bootstrap 4 alerts into "Growl-like" notifications.

This is a port of [bootstrap-notify](https://github.com/mouse0270/bootstrap-notify) 3.1.5 by Robert McIntosh (mouse0270) to Bootstrap 4 and modern JavaScript. The API is the same as the original: `$.notify`, `$.notifyDefaults`, `$.notifyClose` and `$.notifyCloseExcept` take the same arguments and options.

## Install

```sh
npm install @mechazawa/bootstrap4-notify jquery bootstrap@4
```

jQuery 3 and 4 are supported.

## Usage

### ES module

Importing the package registers the functions on jQuery. The functions are also available as named exports.

```js
import $ from 'jquery';
import '@mechazawa/bootstrap4-notify';

$.notify('Hello World');
```

```js
import { notify, notifyClose } from '@mechazawa/bootstrap4-notify';

notify({ title: '<strong>Saved</strong>', message: 'Your page has been saved.' }, { type: 'success' });
notifyClose('success');
```

### CommonJS

```js
const $ = require('jquery');
require('@mechazawa/bootstrap4-notify');
```

### Script tag

Load jQuery first. The script adds the functions to the global `jQuery` and to `window.BootstrapNotify`.

```html
<script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@mechazawa/bootstrap4-notify@1/dist/bootstrap-notify.umd.min.js"></script>
```

## API

### `$.notify(content, options)`

`content` is a message string, or an object with these keys:

| Key | Default | Description |
| --- | --- | --- |
| `message` | | Message HTML. |
| `title` | `''` | Title HTML. |
| `icon` | `''` | Icon class names, or an image URL when `icon_type` is `'image'`. |
| `url` | `'#'` | Makes the whole notification a link. |
| `target` | `url_target` | Target of the link. |

`options`:

| Option | Default | Description |
| --- | --- | --- |
| `element` | `'body'` | Element to append the notification to. |
| `position` | `null` | CSS position. When `null`, it is `fixed` for `body` and `absolute` for other elements. |
| `type` | `'info'` | Bootstrap contextual type: `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light` or `dark`. |
| `allow_dismiss` | `true` | Show the close button. |
| `allow_duplicates` | `true` | When `false`, a notification with the same title, message and type as an open one is not shown. |
| `newest_on_top` | `false` | Show new notifications above the older ones. |
| `showProgressbar` | `false` | Show a progress bar that counts down the delay. |
| `placement.from` | `'top'` | `top` or `bottom`. |
| `placement.align` | `'right'` | `left`, `center` or `right`. |
| `offset` | `20` | Distance from the edge in pixels. A number, or `{ x, y }`. |
| `spacing` | `10` | Space between notifications in pixels. |
| `z_index` | `1031` | CSS z-index. |
| `delay` | `5000` | Time in milliseconds before the notification closes. `0` keeps it open. |
| `timer` | `1000` | Interval in milliseconds at which the delay counts down. |
| `url_target` | `'_blank'` | Default link target. |
| `mouse_over` | `null` | `'pause'` stops the countdown while the mouse is on the notification. |
| `animate.enter` | `'animated fadeInDown'` | Classes added when the notification opens. |
| `animate.exit` | `'animated fadeOutUp'` | Classes added when the notification closes. |
| `onShow` | `null` | Runs when the notification is added to the page. `this` is the jQuery element. |
| `onShown` | `null` | Runs after the open animation. `this` is the DOM element. |
| `onClose` | `null` | Runs when the notification starts to close. `this` is the jQuery element. |
| `onClosed` | `null` | Runs after the notification is removed. `this` is the DOM element. |
| `onClick` | `null` | Runs on a click on the notification, except on the close button. `this` is the DOM element. |
| `icon_type` | `'class'` | `'class'` or `'image'`. |
| `template` | see below | HTML template. |

The default animation classes are from [animate.css](https://animate.style/) 3. Include animate.css 3, or set `animate` to your own classes. animate.css 4 uses an `animate__` prefix, for example `animate__animated animate__fadeInDown`.

`$.notify` returns an object with:

- `$ele`: the jQuery element.
- `update(command, value)` or `update({ command: value, ... })`: change the `type`, `title`, `message`, `icon`, `progress` (0 to 100), `url` or `target`. Any other name sets the HTML of the `[data-notify="<name>"]` element.
- `close()`: close the notification.

It returns `undefined` when `allow_duplicates` is `false` and the notification is a duplicate.

### `$.notifyDefaults(options)`

Merges `options` into the defaults for all later notifications and returns the new defaults.

### `$.notifyClose(selector)`

Closes notifications:

- no argument or `'all'`: all notifications.
- a type such as `'danger'`: the notifications of that type.
- a placement such as `'top-right'`: the notifications at that placement.
- any other value: the notifications that match it as a CSS selector.

### `$.notifyCloseExcept(selector)`

Closes all notifications except the ones of a type or that match a CSS selector.

### Template

```html
<div data-notify="container" class="col-11 col-sm-4 alert alert-{0}" role="alert">
    <button type="button" class="close" aria-label="Close" data-notify="dismiss"><span aria-hidden="true">&times;</span></button>
    <span data-notify="icon"></span>
    <span data-notify="title">{1}</span>
    <span data-notify="message">{2}</span>
    <div class="progress" data-notify="progressbar">
        <div class="progress-bar bg-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>
    </div>
    <a href="{3}" target="{4}" data-notify="url"></a>
</div>
```

`{0}` is the type, `{1}` the title, `{2}` the message, `{3}` the URL and `{4}` the link target. Write `{{0}}` to keep the text `{{0}}` as it is.

## Migrating from bootstrap-notify

### Custom templates

The plugin does not change the classes in a custom `template`. Update them for Bootstrap 4:

- `col-xs-*` is `col-*`.
- `progress-bar-{0}` is `bg-{0}`. `update('type')` swaps the `bg-*` class of the progress bar.
- Glyphicons are not part of Bootstrap 4. Use another icon font for `icon`.

### Behaviour changes

- The plugin does not add `String.format` to the global `String` object. Code that calls `String.format` must supply its own.
- `$.notifyClose('top-right')` and the other placements close the notifications at that placement. In the original, this call did nothing.
- `onClose` and `onClosed` run once. In the original, they ran a second time when a notification closed before its delay expired.
- In `onShown` and `onClosed`, `this` is always the notification element. In the original, it was `window` when no CSS animation ran.
- `update({ icon })` stores the new icon, so the next icon update removes the correct class. With `icon_type: 'image'`, it also changes the `src` of an `<img>` inside the icon element.
- `$.notifyClose` and `$.notifyCloseExcept` also accept the types `primary`, `secondary`, `light` and `dark`.
- A click on an element inside the close button does not run `onClick`. In the original, only a click on the button itself was excluded.

## Development

```sh
npm install
npm run lint
npm test
npm run typecheck
npm run build
npm run attw
```

## License

MIT. See [LICENSE](LICENSE). The original bootstrap-notify is copyright (c) 2015 Robert McIntosh, also under the MIT License.
