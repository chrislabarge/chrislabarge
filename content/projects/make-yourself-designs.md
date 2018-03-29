---
title: "Make Yourself Designs"
date: 2018-03-25T18:30:21-05:00
draft: false
img: "myd.png"
site: "http://makeyourselfdesigns.com"
---

This is a e-commerce project I did for a client that wanted to have a website based around her Etsy store.

I wanted to get a little creative with this one so I decided to build my own tools in order to sync the Etsy shop with the website.  Basically, I did not want the client to have to upload new content to both her Etsy shop and website.  It would be easier for her and future clients to just be able to add a new product to their Etsy shop and have it automatically show up on the website.

## Tech Stack
### Front-End - [Repo](github.com/makeyourselfdesigns)
- Hugo
- Github Pages
- Introduction Theme
- Forestry.io

### Back-End - [Repo](https://github.com/chrislabarge/etsy_sync)
- Ruby
- Etsy API

I built a static website using the GOlang <a href="https://gohugo.io/">Hugo</a> generator, and hosted it on github pages.  I also integrated it with <a href="https://www.forestry.io">Forestry.io<a/> to allow for a CMS like expeprience.

Then I began building the ruby utility that would sync the products.  I used the Etsy API  ruby gem  [etsy](https://github.com/kytrinyx/etsy) to request the product data from the shop, and then cross reference that with the existing data in the static website.  The product files in the static website are Markdown with yaml for the Frontmatter.

I may eventually extract the core logic from this and make a gem.  I would like to get rid of the etsy gem, and just retrive the raw json from Etsy endpoints, allow the developer to pluck the relevent content and put the JSON object in the Markdown frontmatter.
