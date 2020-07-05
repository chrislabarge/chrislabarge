---
title: "Bold + Italic Font in TMUX"
description: "A Guide to get bold and italic font styles working Vim/NeoVim running within a TMUX session, from a GNOME terminal shell."
date: 2020-03-28T18:30:21-05:00
dateMod: 2020-04-17T14:30:21-05:00
draft: false
img: 'bold.png'
imgAlt: "A Page screen shot of my local work environment showcasing Bold and Italic fonts"
categories:
  - dev-tools
tags:
 - vim
 - linux
---

You have just installed a hip new font face for programming. It has the all of the bells and whistles including **bold** and *italic* font styles. 🤙

You configure your terminal to use the new font, and start typing away.

....**WHAT???**....Its not working....🙄

**Has this happened to you before?**

There is always some caveat when tweaking your work environment no matter how trivial.

This guide will briefly outline the solutions I came across to get **bold** and
*italic* font styles working Vim/NeoVim running within a TMUX session, from a
GNOME terminal shell.

  -  [VIM/NeoVIM](https://neovim.io/)
  -  [TMUX](https://github.com/tmux/tmux)
  -  [GNOME Terminal](https://en.wikipedia.org/wiki/GNOME_Terminal)

The Problem
-----------

The **bold** and *italic* font faces were not properly working in a Tmux
session. But they __were__ working outside of Tmux in a gnome terminal.

I came across this
[Tutorial](https://gist.github.com/gutoyr/4192af1aced7a1b555df06bd3781a722) and
it got me close to a solution. But there were issues.

- Step 3 in the
  [tutorial](https://gist.github.com/gutoyr/4192af1aced7a1b555df06bd3781a722)
  did not work for me, so I had to rely on exporting the TERM env variable
  previous to running `tmux` command. (*Per the instructions*)

{{< highlight bash >}}
env TERM=screen-256color tmux
{{< /highlight >}}

- This worked for me. The `bold` and `italic` fonts are now working within Tmux.

- Add this to the `.zhrc` configuration file to make an alias to prevent from
  having to explicitly set the `TERM` environment variable.

#### ~/.zhrc {.snippet-heading}
{{< highlight bash >}}
alias tmux="env TERM=screen-256color tmux"
{{< /highlight >}}

Cursor Issues
------------------

In Vim and NeoVim I have the options to allow for `block` cursor shape when in
`normal` mode and `line` shape when in `insert` mode.

#### ~/.config/nvim/init.vim {.snippet-heading}
{{< highlight vim >}}
if &term =~ "screen."
   let &t_ti.="\eP\e[1 q\e\\"
   let &t_SI.="\eP\e[5 q\e\\"
   let &t_EI.="\eP\e[1 q\e\\"
   let &t_te.="\eP\e[0 q\e\\"
else
   let &t_ti.="\<Esc>[1 q"
   let &t_SI.="\<Esc>[5 q"
   let &t_EI.="\<Esc>[1 q"
   let &t_te.="\<Esc>[0 q"
endif
{{< /highlight >}}

*This code is for displaying the desired cursor dependent on being in a remote
session or not.*

Unfortunately the font solution broke the cursor shape for Vim, running in
Tmux.   The fix from above was only showing the `line` shape cursor.

I found this solution from a neovim [ document ]( https://neovim.io/doc/user/term.html#tui-cursor-shape )

Which instructed me to add an override to `~/.tmux.conf` file

#### ~/.tmux.conf {.snippet-heading}
{{< highlight bash >}}
set -ga terminal-overrides '*:Ss=\E[%p1%d q:Se=\E[ q'
{{< /highlight >}}
