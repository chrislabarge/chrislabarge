---
title: "Configure (Neo)Vim for Unity Game Engine Development"
description: "A tutorial for using Neovim as the external text editor + debugger for the Unity Game Engine."
date: 2020-11-15T18:30:21-05:00
draft: false
img: 'nvim-unity.png'
imgAlt: "A Page screen shot of the Neovim text editor showcasing Intellisense autocomplete working with a Unity .NET c# file."
filesOnly: true
categories:
  - tutorial
tags:
 - vim
---

## Tools - *Install the following*
- [NeoVim](https://neovim.io/) - Open source fork of the Vim editor.
- [Neovim-CoC](https://github.com/neoclide/coc.nvim) - Intellisense Engine - Make your Vim/Neovim as smart as VSCode.
- [OmniSharp-vim](https://github.com/OmniSharp/omnisharp-vim)  - A great vim plugin that installs omnisharp and integrates with mono/.NET and Coc.
- [Mono](https://www.mono-project.com/) - Open Sourced version of the .NET software framework - Unity compiles c# code to c++. *Only needed if you are developing on OSX/Linux*
- [Unity](https://unity.com/) - Game Development Engine.
- [Neovim-Remote](https://github.com/mhinz/neovim-remote) - This is a python
  executable script that extends Neovim to allow for remote features that are
  available with regular vim.

## Preface


[Neovim-CoC](https://github.com/neoclide/coc.nvim) is a very robust vim plugin
which allows for numerous extensions and configurations.  It is not really an
"out of the box" solution, and you will have to get your hands dirty. Having
said that, I really appreciate all of the work that is going into this plugin,
and can't imagine developing without it.

If you use a different `Intellisense` solution, just make sure [OmniSharp-vim](https://github.com/OmniSharp/omnisharp-vim) is compatible with it.

## Tutorial

I LOVE editing code in Vim.  Recently I
decided to dabble with the Unity Game Engine. Unity has terrific
built in integration with VScode, but not with Vim.

Luckily Unity allows for integrating any editor that can accept `line` and `file`  arguments.

Open up your Unity game/project.

From the tool bar select:

#### edit > preferences > External Tools {.snippet-heading}
![](/img/unity-files.jpeg)

As you can see there is a dropdown that allows for choosing a text editor executable file.

You must create the file first in order to choose it.

#### Utilities/neovim-unity {.snippet-heading}
```bash
#!/bin/bash
gnome-terminal -- nvr --servername unity $@
```

Lets breakdown this simple file.

- `gnome-terminal` is the executable command that opens a new terminal window on my machine. If you use a different terminal the command will be different.

- `nvr --servername unity $@` is the argument, which itself is a command.

- `nvr` is the executable command for `neovim-remote`.  This is needed because you are unable to pass server and remote options into `neovim` like you can for `vim`.

- `--servername unity` is how we name the neovim server instance.
- `$@` allows the Unity Game Editor to pass in File arguments into the (executable) file.

Now we must make the file an executable.

#### Command Line {.snippet-heading}
```bash
cd Utilities
chmod +x neovim-unity
```

Choose the newly created executable file in the Unity preferences.
The external script editor arguments field will appear.

Add the following line:

#### External Script Editor Args {.snippet-heading}
```bash
  --remote-silent +$(Line) $(File)
```

#### edit > preferences > External Tools {.snippet-heading}
![](/img/unity-nvim.jpeg)

Now you can open/debug files within the Unity UI and it will automatically open the file in your Vim editor.

However you will notice that the intellisense is most likely not working.

First, we must edit the [Neovim-CoC](https://github.com/neoclide/coc.nvim) configuration file.
Within vim enter the following command:

#### (Neo)Vim Command {.snippet-heading}
```bash
:CocConfig
```

This will open you configuration file for [Neovim-CoC](https://github.com/neoclide/coc.nvim).
Add the following lines to the object:

#### CoC config.json {.snippet-heading}
```json
{
  //...
  "coc.source.OmniSharp.enable" : true,
  "coc.source.OmniSharp.triggerCharacters": ".",
}
```

Now you must generate the project files so that the OmniSharp server can analyze the project.

In order to do this, switch the External Text Editor option back to "Open by file extension". (*For some reason it will not allow for generating these files when the nvim-unity is selected*) You will now have the options to `regenerate project files`.
Make sure the following are checked before regenerating:
- Embedded Packages
- Registry Packages
- Local Packages

#### edit > preferences > External Tools {.snippet-heading.no-file-only}
![](/img/unity-files.jpeg)

Switch the External Text Editor option back to "neovim-unity". Make
sure that the argument field still has the following:

#### External Script Editor Args {.snippet-heading.no-file-only}
```bash
--remote-silent +$(Line) $(File)
```

#### edit > preferences > External Tools {.snippet-heading.no-file-only}
![](/img/unity-nvim.jpeg)

Now, upon opening any `.cs` file within the project, should open in vim, and
your OmniSharp server should start up, analyze the project files, and provide
you with an IDE like experience.

![](/img/nvim-unity.gif#visible)

## Side Note
If there are any issues with the OmniSharp server, make sure to follow ALL of the installation instructions at [OmniSharp-vim](https://github.com/OmniSharp/omnisharp-vim). There are a few different caveats in regards to the operating system you are running.
