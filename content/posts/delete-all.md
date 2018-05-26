---
title: "Rails '#delete_all' - Fast & Powerful - Beware"
date: 2018-05-23T18:30:21-05:00
draft: false
img: 'trash.jpg'
---
## What You Will Learn
- A fast way to delete a large batch of rows from a Database table
- How to prevent from locking your Database

## Who This Is For
- Rails developers who need to delete records more efficiently.

## Requirements
- Ruby
- Rails >= 5.0
- Relational Database like MySQL or PostgreSQL

## Overview

I am currently working on a Rails project that deals with importing and exporting large amounts of data.  The user is able to import and store data into the applications Database as well and delete the data.

Because some of these data deletions can consist of thousands of rows you must code the removal process a little differently.

When a User imports/uploads new data into the application it creates a new `DataUplodad` model.  The application also creates a new `DataSet` record for every single data set from the import.

I have the model `DataSet` which has a `belongs_to` relationship to `DataUploads`.

{{< highlight ruby >}}
  class DataSet < ApplicationRecord
    belongs_to :data_uploads
  end
{{< /highlight >}}

I have the model `DataUploads` which has a `has_many` relationship to `DataSets`.

{{< highlight ruby >}}
  class DataUpload < ApplicationRecord
    has_many :data_sets, dependent: :destroy
  end
{{< /highlight >}}

Notice the `dependent: :destroy`.  This means that when a `DataUpload` model gets deleted/destroyed, all of the associated `DataSet` models will all get destroyed as well.

This also loads every associated `DataSet` model into memory as well.  This will bog down the server if there is a very large association of thousands of `DataSet` records.

The way we solve this is to use the `ActiveRecord::Relation#delete_all`. This [method](https://apidock.com/rails/ActiveRecord/Relation/delete_all) performs a single SQL statement and efficiently deletes all of the records within the Relation.

*Look at the example below.*

{{< highlight ruby >}}
  # Remove the data sets of the last Data Upload instance
  upload = DataUpload.last
  data_sets = upload.data_sets

  data_sets.delete_all
{{< /highlight >}}

### WARNING

- DO NOT use this method on more then 5,000 records in a Database table.  It will lock the Database for the entire transaction.
- `#delete_all` does not load the record, so any callbacks will not be fired.  Make sure the application and/or model is not dependent on any pre/post delete processes.

Now we can implement the method in the in the `DataUpload` callback.

{{< highlight ruby >}}
  class DataUpload < ApplicationRecord
    has_many :data_sets, dependent: :delete_all
  end
{{< /highlight >}}


BUT WAIT!! If you were a good reader and saw the first WARNING above you will notice that if I left the code this way and a particular `DataUpload` instance had an association of more then 5,000 `DataSet` records...the Database will lock for the entire transaction. To prevent from this we must utilize one of the Ruby on Rails 5.0 [methods](http://api.rubyonrails.org/classes/ActiveRecord/Batches.html#method-i-in_batches) `#in_batches`

*If you are not use a Rails version that is >= 5.0 then check out the gem [delete_in_batches](https://github.com/ankane/delete_in_batches)*

{{< highlight ruby >}}
  class DataUpload < ApplicationRecord
    has_many :data_sets

    before_destroy :destroy_data_sets

    private

    def destroy_data_sets
      data_sets.in_batches(of: 1000).delete_all
    end
  end
{{< /highlight >}}

First we remove the previous callback `dependent: :delete_all`, and replace it with `before_destroy` callback and pass in the new private method `#destroy_data_sets`.

You will notice that `#in_batches` takes an option `:of` set to `1000`. This will limit the amount of records deleted in a single SQL transaction to 1,000.  Thus preventing the Database from locking.


