---
title: "Popup with Tippy.js, Ruby on Rails 6, Stimulus and Webpacker"
description: "A tutorial to integrate a Javascript popup library Tippy.js, with Ruby on Rails 6.0, StimulusJS, and Webpacker."
date: 2020-10-30T18:30:21-05:00
draft: false
img: 'popup-header.jpg'
imgAlt: "A Page screen shot of a working Popup component from the following tutorial"
filesOnly: true
categories:
  - tutorial
tags:
 - ruby-on-rails
 - javascript
 - ruby
---

[Demo Application](https://popup-demo.herokuapp.com/) - Hosted on a Free dyno. (May take 10-20 seconds to wake up)

[Github](https://github.com/chrislabarge/popup-demo) - Git repo for the hosted application.

## Tools
- [Ruby on Rails 6.0.2.2](https://github.com/rails/rails) - Ruby Web Framework
- [StimulusJS](https://github.com/stimulusjs/stimulus) - A minimal Javascript framework developed by Basecamp.
- [Webpacker](https://github.com/rails/webpacker) - Rails gem for using Webpack to bundle assets including Javascript modules.
- [Tippy.js](https://atomiks.github.io/tippyjs/) - Popup Javascript library.


Set Up
----------------------

This tutorial assumes that you have a Rails application with webpacker and stimulus installed (*along with some familiarity using each*).

If you are using Rails >= 6.0 version, you can generate the application with the following command.

```bash
rails new sample_app --webpacker=stimulus
```
The model we will be working with from the demo is `Fabric`.

We have a typical index listing of the Fabric in the system:

#### app/views/fabrics/_fabric.html.haml {.snippet-heading}
```ruby
%li
  .avatar
    = img_pack_tag(fabric.image, class: "circular")
  .data
    = fabric.name
```

![](/img/popup-index.jpg)

However, the avatar is too small for comparing fabrics, and it would be nice to have the image enlarged when hovering over it.

We will need to install a popup library to accomplish the desired feature.

Install with Yarn & Webpacker
-----------------------

Add the Tippy.js library using `yarn`

#### Command Line {.snippet-heading}
```bash
yarn add tippy.js
```

Afterwords, create a scss file to load the module's styles:

#### app/javascript/stylesheets/popup.scss {.snippet-heading}

```css
@import 'tippy.js/dist/tippy.css';

.popup {
  padding: 7px;

  .image {
    text-align: center;
    margin-bottom: 10px;

    img {
      height: 200px;
      width: 200px;
      border-radius: 5px;
    }
  }
}
```

>>**NOTE:** If you do not use a css style path such as `app/javascripts/stylesheets/` in your build, you can load the the Tippy.js library styles in the `packs` file:

>> #### app/javascripts/packs/application.js {.snippet-heading .no-file-only}
>>```javascript
>>import 'tippy.js/dist/tippy.css';
>>```

Stimulus Integration
------------------------------------

#### app/javascript/controllers/popup_controller.js  {.snippet-heading}

```javascript
import { Controller } from "stimulus";
import tippy from 'tippy.js';
import "../stylesheets/popup.scss";

export default class extends Controller {
  static targets = ["trigger", "content"]

  initialize() {
    this.initPopup();

    this.contentTarget.style.display = "none";
  }

  initPopup() {
    tippy(this.triggerTarget, {
      content: this.contentTarget.innerHTML,
      allowHTML: true,
    });
  }
}
```

We load the `tippy` module at the top of the stimulus controller file along with the stylesheet:

>> **NOTE:** Do not load the stylesheet if already imported in `app/javascript/packs/application.js`

```javascript
import tippy from 'tippy.js';
import "../stylesheets/popup.scss";
```

We have two stimulus targets:

```javascript
static targets = ["trigger", "content"]
```

 - `this.triggerTarget`

   This is the HTML element we will be passing into the `tippy()` function. It will turn the element into a trigger for the popup component.

 - `this.contentTarget`

   This is the HTML content that the popup will contain.

We use the `initialize()` stimulus life-cycle function:

```javascript
initialize() {
  this.initPopup();

  this.contentTarget.style.display = "none";
}
```

In the `initPopup()` method, we set `this.popup` to the return call of `tippy()` in order to access the popup:

```javascript
initPopup() {
  this.popup = tippy(this.triggerTarget, {
    content: this.contentTarget.innerHTML,
    allowHTML: true,
  });
}
```

The first argument passed into the `tippy()` function is the element that will toggle the popup. In this case our `this.triggerTarget`.

The second argument is a options object.
  - `this.contentTarget.innerHTML` is set as the `content` option.
  - In order to allow for HTML rendering from Tippy.js we set the the `allowHTML` option to `true`.

Additional options can be found at Tippy.js [README](https://atomiks.github.io/tippyjs/).

To prevent from the content from rendering outside the popup we hide it:

```javascript
this.contentTarget.style.display = "none";
```

HAML View Changes
------------------------

Now we have to update our fabric partial to utilize the `popup` controller:

#### app/views/fabrics/_fabric.html.haml {.snippet-heading}
```ruby
%li
  .avatar{ data: { controller: :popup, target: "popup.trigger" } }
    = image_pack_tag(fabric.image, class: "circular")

    %div{ data: { target: "popup.content" } }
      .popup
        .image
          = image_pack_tag(fabric.image)
        .data
          Created On:
          = display_date fabric.created_at

  .data
    = fabric.name.titleize
```

![](/img/popup.gif)

Looks Good!

Now lets do some refactoring to clean up our view and make the popup controller more modular.

#### app/javascript/controllers/popup_controller.js  {.snippet-heading}
```javascript
import { Controller } from "stimulus";
import tippy from 'tippy.js';
import "../stylesheets/popup.scss";

export default class extends Controller {
  static targets = ["trigger", "content"]

  initialize() {
    this.trigger = this.getTrigger();
    this.content = this.getContent();

    this.initPopup();

    this.content.style.display = "none";
  }

  initPopup() {
    this.popup = tippy(this.trigger, {
      content: this.content.innerHTML,
      allowHTML: true,
    });
  }

  getContent() {
    if (this.hasContentTarget) {
      return this.contentTarget;
    } else {
      var content = document.createElement('div')
      content.innerHTML = this.data.get("content");

      return content
    }
  }

  getTrigger() {
    if (this.hasTriggerTarget) {
      return this.triggerTarget;
    } else {
      return this.element;
    }
  }
}
```

#### app/views/fabrics/_fabric.html.haml {.snippet-heading}
```ruby
%li
  .avatar{ data: { controller: :popup,
                   popup: { content: render("popup", fabric: fabric) } } }

    = image_pack_tag(fabric.image, class: "circular")

  .data
    = fabric.name.titleize
```

#### app/views/fabrics/_popup.html.haml {.snippet-heading}
```ruby
.popup
  .image
    = image_pack_tag(fabric.image)
  .data
    Created On:
    = display_date fabric.created_at
```
