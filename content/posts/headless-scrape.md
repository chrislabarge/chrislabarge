---
title: "Using Chrome Driver For Headless Scraping and Downloading"
date: 2018-04-20T18:30:21-05:00
draft: false
img: 'headless.jpeg'
---
## What You Will Learn
- How to use a non headless web driver on a headless server.
- How to setup the Chrome Driver with Selenium and Capybara.
- How to set up the driver to allow for automatic browser downloads.

## Who This Is For
- Ruby developers wanting to use the Chrome Driver for their browser automations.
- Coders looking for a solution to headless file downloads using the browser.
- Coders that need to run a non headless web driver in a headless environment.

## Requirements
- Ruby
- [ Capybara ](https://github.com/teamcapybara/capybara) and [ Selenium ](http://robotframework.org/SeleniumLibrary/) installed.
- Framework(ex Rails) or program utilizing the above libraries.

## Overview

Recently I was making some scrapers for a client who needed pdf's downloaded. The program runs on a AWS Ubuntu server and is developed with the Ruby language and the Capybara library. Because this is running in a headless environment I decided to go with Phantom JS as my web driver using Poltergeist gem to integrate it with Ruby and Capybara. I use this driver for integration testing when developing in Rails and have found it accomplished most of what I asked of it, without having to rely on the Selenium Library

Most of the pdf's I was scraping came from websites that would render them at URL  endpoints. This allowed me to just scrape the URL string with Phantom JS and use the Ruby module [ open-uri ](https://ruby-doc.org/stdlib-2.4.3/libdoc/open-uri/rdoc/OpenURI.html) to handle the downloading of the actual pdf document.

Well unfortunetly I ran into a situation where the website would only let the user download the pdf as a file-attachment.  You cannot download files from the browser using Phantom JS.  This makes sense considering the whole point of Phantom JS is that it is truley headless driver.

I would have to bring in [ Selenium ](http://robotframework.org/SeleniumLibrary/) after all.  Selenium is the end all be all of  automated browser interaction libraries. You can utilize several different web drivers with it, and integrate it with Capybara.  This allowed me to use Selenium in replace of Poltergiest without having to change any of my code.

I decided to go with the [ Chrome Driver ](https://sites.google.com/a/chromium.org/chromedriver/) because I when I was researching how I could download the pdf's using a headless driver someone suggested that the Chrome Driver had a new headless feature that would allow for downloading.(nope!)

I plugged it in and started running the headless feature as I would Phantom JS. I actually really enjoyed the speed and performance of the driver.  I might start using it as my integration driver from now on.  Unfortunetly, it would not allow for downloads using the browser while using headless mode.(at least at this point)

However, I was able to download the file using the non-headless mode of the Chrome Driver.

## Code

*The following is for installing the driver on Ubuntu*

Make sure Chrome is installed. [ Install Options ](https://askubuntu.com/questions/510056/how-to-install-google-chrome)

Download and extract the Chrome Driver from the [ Download Link ](https://sites.google.com/a/chromium.org/chromedriver/downloads). Then move the extracted binary driver file to "/usr/local/bin"

There are some preferences and arguments you have to send/set in the Chrome Driver to be able to download files from the browser.
These will allow the browser to immediately download the file without having to accept the save_as prompt that ususally pops up.  You will also have to tell the driver what folder you would like the files to be downloaded to.

{{< highlight ruby >}}
  def driver_options
    download_directory = './downloads/'

    { args: ['test-type', 'disable-extensions'],
     prefs: { plugins: { always_open_pdf_externally: true  },
             savefile: { default_directory: download_directory },
             download: { prompt_for_download: false,
                           default_directory: download_directory } } }
  end
{{< /highlight >}}

Above I have wrapped the options within a ruby function.  I will call this function when passing the parameter option [:chromeOptions] to the #chrome method for  Remote::Capabilities. This takes place below when registering the driver with Capybara.

{{< highlight ruby >}}
  Capybara.register_driver :chrome do |app|
    capabilities = Selenium::
                   WebDriver::
                   Remote::
                   Capabilities.chrome(chromeOptions: driver_options)

    Capybara::
    Selenium::
    Driver.new app, browser: :chrome,
                    desired_capabilities: capabilities
  end

  Capybara.ignore_hidden_elements = false

{{< /highlight >}}

The hash from the function #driver_options() gets parsed by the Selenium Library and then passed to the chrome driver.

If you want to see a complete list of options that you can pass to the chrome driver check out this [stacked overflow response](https://stackoverflow.com/questions/38335671/selenium-chrome-where-can-i-find-a-list-of-all-available-chromeoption-arguments)

Now when I  run the scraper locally using ...

{{< highlight bash >}}
  bundle exec rake scrape_pdfs
{{< /highlight >}}

The chrome browser window pops up and runs through the list of the Capybara session commands, navigating to the download link, and then clicking the link.  This is where the driver options come to play and automatically save the file to the proper directory.

Great!  But I need this same thing to happen on the AWS with no monitor. What am I to do?

Well that is where  Xvfb comes it.  It creates a virtual monitor and allows you to use non headless web drivers in headless environments.

[Xvfb Tutorial](http://tobyho.com/2015/01/09/headless-browser-testing-xvfb/)

As long as Xvfb is properly installed all you need to do is pass the command that kicks off your Capybara Session to the "xvfb-run" command.

{{< highlight bash >}}
  xvfb-run bundle exec rake scrape_pdfs
{{< /highlight >}}

I can no longer watch the scrape occur on my monitor, but after the program is done running, I can verify it worked by finding a freshly downloaded pdf in my "./downloads" folder.

And there you have it a simple way to run non headless Chrome Driver session in a headless server environment, in order to download files using the browser.

## Notes

The default screen size for the "xfvb-run" command is fairly small.  So if you are interacting with a responsive website and need you change the virtual screen dimensions run the command like so...

{{< highlight bash >}}
  xvfb-run --server-args='-screen 0 1024x768x24' bundle exec rake scrape_pdfs
{{< /highlight >}}
