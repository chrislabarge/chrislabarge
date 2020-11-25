---
title: "MineSwept.io"
description: "A portfolio page for MineSwept.io. A minesweeper clone developed using Ruby on Rails. Users can play the classic game with a modern twist."
date: 2020-11-22T18:30:21-05:00
draft: false
img: "mine-swept.png"
imgAlt: "A screen-shot of the MineSwept.io landing page"
site: "https://www.mineswept.io"
---

[MineSwept.io](https://www.mineswept.io) is web app that allows users to play the classic Mine Sweeper game on ALL devices.

I built [MineSwept.io](https://www.mineswept.io) after listening to a [podcast](https://www.codewithjason.com/rails-with-jason-podcast/tyler-williams/) by [Jason Swett](https://www.codewithjason.com/) featuring [Tyler Williams](https://ogdenstudios.xyz/).
They discuss applicable solutions for syncing the Back & Front-End for a Poker game.

I had always wanted to build a mine sweeper clone. The requirements/rules are
fairly simple, and the mechanics were perfect for implementing some of the
solutions referenced in the [podcast](https://www.codewithjason.com/rails-with-jason-podcast/tyler-williams/).

Right now the backend generates the game
boards, and the front-end uses a StimulusJS controller to handle spot logic.
My goal is to build a game mode where multiple users can play on the same
board, using Action Cable/[Stimulus Reflex](https://docs.stimulusreflex.com/).

[Play for free](https://www.mineswept.io/play_game) as a guest

OR

[Create an account today](https://www.mineswept.io/users/sign_up) to unlock all of the features.

## Tech Stack

- Ruby on Rails
- StimulusJS
- TailwindCSS

## Code
[Github Repo](https://gitlab.com/chrislabarge/mineswept)
