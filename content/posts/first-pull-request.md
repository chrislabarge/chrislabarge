---
title: "My first Pull Request (Tutorial)"
description: "A guide aimed at beginners for creating a Pull Request on Github."
date: 2015-03-18 12:01:27
draft: false
img: 'pull.jpg'
imgAlt: "A page screen shot of a Github Repository, with a giant blue arrow pointing to the 'Create pull request' button."
---

## Overview
About a month ago I was searching for a local user-group of Ruby programmers,
and luckily came across the Tech Valley Ruby Brigade. Even more lucky, their
website needed a modern design update and they provided the repository on github
for anyone to grab.

It was a perfect opportunity for me to learn how to submit a pull-request and at
the same time a good ice-breaker for the first time I would attend the user-group
meetup.

## Things You Will Learn
Through my experience I will go over how to.....

- Fork a repository
- Clone a repository
- Commit and push new branch with changes
- Submit a Pull-Request


### 1. Fork the repository
I went to the github repository for the website that I wanted to work on. Once
there, I clicked the "Fork" button in the top right corner.

<img src='/img/fork.jpg'/>

This copies the entire repository of the website right onto my personal github
account.

### 2. Clone the repository

Next I had to clone the forked repository from my github account to my local
machine. By going to terminal and entering the following command.
{{< highlight bash >}}
	chrislabarge$ git clone https://github.com/chrislabarge/techvalleyrb.github.com.git
{{< /highlight >}}

You can get the url path of the above command from the forked repository on your
github account by copying from and pasting into the command-line.

![Url Path ](/images/clone.jpg)

### 3. Create a new branch

Once I had the repository cloned onto my machine, I created a new branch
from the master and named it "updating-bootstrap". Creating a new required in
order to make changes.

{{< highlight bash >}}
	chrislabarge$ git checkout -b updating-bootstrap
{{< /highlight >}}

At this point I was able to start making changes. I updated the css bootstrap
framework for the website and took advantage of the responsive grid design.

#### Note
*Normally you would not want  want to perform any MAJOR adjustments on your contribution*

### 4. Add and commit any changes
Once I was satisfied with my changes, I added all of the newly changed files...
{{< highlight bash >}}
   chrislabarge$ git add -A
{{< /highlight >}}

And then made a commit.

{{< highlight bash >}}
	chrislabarge$ git commit -m "updated the bootstrap version and put the content into grid format"
{{< /highlight >}}

### 5. Push the branch to Github
After I made the commit, it was time to push the branch up to my github.

{{< highlight bash >}}
	chrislabarge$ git push origin updating-bootstrap
{{< /highlight >}}

### 6. Final- Submit a Pull-Request
It was finally time to show off my changes and submit a pull-request.  I went back
to the original repository of the website, the one I went to in step 1. And
clicked the green button below.

![Pull-Icon Screen Shot](/images/compare-pull.jpg)

Next, I selected my branch to compare, (updating-bootstrap) and clicked
"Create pull request".
(The compare branch in the photo below says testing, it should be updating-bootstrap.)

![Fork Screen Shot](/images/pull.jpg)
