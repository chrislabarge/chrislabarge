---
title: "Bold + Italic in TMUX"
date: 2020-03-28T18:30:21-05:00
draft: false
img: 'trash.jpg'
---

{{< highlight ruby >}}
  # Remove the data sets of the last Data Upload instance
  upload = DataUpload.last
  data_sets = upload.data_sets

  data_sets.delete_all
{{< /highlight >}}

Now we can implement the method in the in the `DataUpload` callback.

{{< highlight ruby >}}
  class DataUpload < ApplicationRecord
    has_many :data_sets, dependent: :delete_all
  end
