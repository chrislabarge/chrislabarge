---
title: "Remote Mount an External Hard Drive with a Raspberry Pi"
description: "A tutorial for remote mounting to an external hard drive that is physically connected to a Raspberry Pi server."
date: 2021-03-05 12:01:00
draft: false
img: 'raspberry-pi.jpg'
imgAlt: "A photograph of a Raspberry Pi computer."
filesOnly: true
categories:
  - tutorial
tags:
  - raspberry-pi
  - linux
---

## Required - *The following will be needed to complete the tutorial*
- Computer with Linux/Unix OS
- External storage device like a Hard Drive or USB
- [USB hub](https://www.amazon.com/gp/product/B00DQFGJR4/ref=oh_aui_detailpage_o06_s00?ie=UTF8&psc=1) - A way to power the external storage device
- [Raspberry Pi](https://www.raspberrypi.org/) - Any model

## Preface

While relaxing after a long day, a great work idea pops into my head... I take
out my personal computer, navigate to my cloned `Documents/` folder, ` git pull
origin master` and open my file from work day.

Gasp!!.... It looks nothing like I remember. Oh shoot.. I didn't push up todays
recent changes on my work computer, and now I can't use my notes from today to
get context and help better flesh out my idea. The notes are stale. :(

A solution to this problem is to have my work computer and personal computer
access to the same exact `Documents/` folder, so that any change will be
immediately be reflected on the device accessing the folder.

I could of course just set up a server/storage space in the cloud and have my
`Documents/` folder deployed there. However, I had a bunch of extra Raspberry
Pi's lying around and an external hard drive collecting dust. Might as well put
them to good use.

## Raspberry Pi Set Up

First you will need to make sure that the Pi has a Linux OS installed.  You can
follow a fairly old tutorial of mine [SD OS Image Tutorial](/posts/sd-format),
or use the glorious UI
[Imager](https://www.raspberrypi.org/blog/raspberry-pi-imager-imaging-utility/).
I highly suggest using the Imager software as it as about as simple as it gets.

Next, you will need to be able to login to the Pi from a computer. For this, we
will use [ssh](https://www.openssh.com/). In order for the Pi to accept ssh
connections, you might have to enable it in the Pi's configuration. Follow along with
[this tutorial](https://phoenixnap.com/kb/enable-ssh-raspberry-pi).

After you have enabled `ssh`, and rebooted the Pi, make sure to check the local
IP address of the device. Run `hostname -I`.  The output will contain your full
address Where `192.168.0.28`  is the IP number we need.

Lets guarantee this will always be the IP address by appending it to a boot file by running:

#### Pi {.snippet-heading}
```bash
sudo echo "ip=192.168.0.28" >> /boot/cmdline.txt
```

Now you will have everything you to remotely login to the Pi. From your computer run the following:

#### Computer {.snippet-heading}
```bash
ssh pi@192.168.0.28
```

It should prompt you for a password. The default password is `raspberry`, it is
advised to change it. `ssh` will allow us to login without having to enter a
password every time. Run the following from your computer:

#### Computer {.snippet-heading}
```bash
ssh-copy-id pi@192.168.0.28
```

It will prompt you for a password, and after successfully entering, you should no longer have to enter one when logging into your Pi through `ssh`.

## Mounting the External Hard Drive

Now we must connect and mount the External Hard Drive.

Make sure that the external hard drive is formatted as `ext4`. (I attempted
this with a drive formatted in `vfat` and I had user permission issues writing
to the drive after mounting it.)

In order to ensure that your external hard drive has enough power, and it not
pulling any from the Pi, we must use the powered [USB
hub](https://www.amazon.com/gp/product/B00DQFGJR4/ref=oh_aui_detailpage_o06_s00?ie=UTF8&psc=1).
Think of this as a USB splitter for your Pi, with the added benefit of
providing power to any plugged in device.

With the Pi powered down `sudo shutdown -h now`, hook up the USB Hub to the Pi,
and plug the external hard drive into the USB Hub. Now, boot the Pi up and
after logging in from your computer run the following:

#### Pi {.snippet-heading}
```bash
sudo blkid
```

The output will look something similar to:

```bash
/dev/mmcblk0p1: LABEL_FATBOOT="boot" LABEL="boot" UUID="DV4E-E470" TYPE="vfat" PARTUUID="78daa907-01"
/dev/mmcblk0p2: LABEL="rootfs" UUID="a7adb26a-8b87-4729-88c8-9f5ac069d51e" TYPE="ext4" PARTUUID="78daa607-02"
/dev/sda1: LABEL="HDD-SEAGATE" UUID="6b6eb764-8a3b-44b1-aa5f-5214c94efed4" TYPE="ext4" PARTUUID="13f31b00-01"
/dev/mmcblk0: PTUUID="77daa907" PTTYPE="dos"
```

The following is the external Hard Drive connected to my Pi:

#### {.snippet-heading}
```bash
/dev/sda1: LABEL="HDD-SEAGATE" UUID="6b6eb764-8a3b-44b1-aa5f-5214c94efed4" TYPE="ext4" PARTUUID="13f31b00-01"
```

We will be using this information to mount the external drive on startup.  So make sure to copy it down somewhere.

First we need to create a mount point. I like to have mine along side
`/home`.But it does not really matter, you can create your mount point anywhere
on the file system. Make sure you are still logged into the Pi and run:

#### Pi {.snippet-heading}
```bash
sudo mkdir /HDD-SEAGATE # replace /HDD-SEAGATE with your mount point
```

Now we must tell the Pi to mount the external drive at this mount point on
startup. In order to do this you will need to edit a file as your logged in.
Run the following:

#### Pi {.snippet-heading}
```bash
sudo vi /etc/fstab

# I am used to `vim` so I will be using `vi`, but most installations
# come with `nano`. Replace `vi` with `nano` if you prefer.
```

Append the following line to the file and save (*be careful editing this file, only ADD to the file, DO NOT change the existing content*):

#### /etc/fstab  {.snippet-heading}
```bash
 # Bottom of file, everything above was already in the file

 /dev/sda1    /HDD-SEAGATE    ext4    defaults    0   0
```

Where `/dev/sda1` is the output path from `blkid`, and `/HDD-SEAGATE` is the path of the new mount point directory.

Now, lets make sure it will mount correctly. Run the following commands:

#### Pi {.snippet-heading}
```bash
sudo mount -a
cd /HDD-SEAGATE # replace /HDD-SEAGATE with your mount point
echo "It works!" > permission_test
cat permission_test
```

You will know if you have successfully mounted the drive and have write
permissions, if you see `It works!` in terminal output. Now we can reboot the
Pi:

#### Pi {.snippet-heading}
```bash
sudo reboot
```

Log back into the Pi and make sure the external drive is automatically mounted:

#### {.snippet-heading}
```bash
ls /HDD-SEAGATE # replace /HDD-SEAGATE with your mount point
```

This should output the contents of our external hard drive, including our
`permission_test`. Which we can now remove `rm /HDD-SEAGATE/permission test`

## Remotley Mount the External Hard Drive

Time to mount the External Hard Drive on our computer remotely. We will need to
use [sshfs](https://github.com/libfuse/sshfs).  After installing, create the
mount point on your computer(s).

#### Computer {.snippet-heading}
```bash
sudo mkdir /HDD-REMOTE # replace /HDD-REMOTE to with any mount point
```

Now for the final test. Using `sshfs` to remotely mount the external hard drive (which is physically mounted to the Pi)

#### Computer {.snippet-heading}
```bash
sshfs pi@192.168.0.28:/HDD-SEAGATE /HDD-REMOTE

# Obviously replace /HDD-SEAGATE with the mount point on your Pi
# and replace /HDD-REMOTE with the mount point on your computer
```

You should now have the External Hard Drive mounted at your new mount point.

#### Computer {.snippet-heading}
```bash
ls /HDD-REMOTE
```

Once again, this should output the contents of our external hard drive, including our `permission_test`. Which we can now remove `rm /HDD-REMOTE/permission test`

We have successfully created a new storage drive on our computers that is not physically connected. Pretty cool!

## Migrate Local Folders to Remote Drive

Alrighty now its time to start moving the folders we are having syncing issues
with to the Raspberry Pi. In my case the `Documents` directory on my computer.
Initialize the folder as a `git` directory (*if you haven't already*). And push up to a private
reposistory on a service like Github. (*this is for back up purposes*)

Clone the repo into the remote drive or move the folder.

#### Computer {.snippet-heading}
```bash
mv ~/Documents /HDD-REMOTE/
```
You have successfully migrated your local folder to the remote drive. Doesn't get much easier than that. Well, actually it does.

I don't want to always have type the entire path `/HDD-REMOTE/Documents`. It should still just show up in my `/home/chris` directory like it did before.

Symlinks to the rescue.

#### Computer {.snippet-heading}
```bash
ln -s /HDD-REMOTE/Documents /home/chris/Documents
```

There you have it! We can now edit files in our `~/Documents` on any computer,
and the changes will be immedietly written on the remote server, and availble
to across all devices.


## Alias the SSHFS command

No one wants to remember the entire command to mount the remote drive.  Add the following to your `.bashrc`:

#### ~/.bashrc {.snippet-heading}
```bash
alias mount-remote='sshfs pi@192.168.0.28:/HDD-SEAGATE /HDD-REMOTE'
```

Now you can manually mount the drive with `mount-remote` (*or whatever you prefer to name the alias*)

