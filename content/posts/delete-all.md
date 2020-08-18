---
title: "How to use Rails Active Record Relation method #delete_all"
description: "A quick overview of a Ruby on Rails ActiveRecord::Relation method '#delete_all'. A fast way to purge your Date Base of rows from a Table."
date: 2018-05-23T18:30:21-05:00
dateMod: 2023-04-17T13:00:21-05:00
draft: false
img: 'trash.jpg'
imgAlt: "A photo of an mesh office trash can, with some crumpled up papers inside."
filesOnly: true
categories:
 - dev-tools
tags:
 - ruby-on-rails
 - ruby
---

## What You Will Learn
- How to use [ ActiveRecord::Relation#delete_all ](https://apidock.com/rails/v6.0.0/ActiveRecord/Relation/delete_all) - A fast way to delete a large batch of rows from a Database table
- How to use [ ActiveRecord::Batches::BatchEnumerator#in_batches ](http://api.rubyonrails.org/classes/ActiveRecord/Batches.html#method-i-in_batches) - To prevent from locking your Database

## Who This Is For
- Ruby on Rails developers who need to delete records more efficiently.

## Requirements
- [Ruby on Rails](https://github.com/rails/rails) >= 5.0
- Relational Database like [MySQL](https://www.mysql.com/) or [PostgreSQL](https://www.postgresql.org/)

## Overview

I am currently working on a Rails project that deals with importing and
exporting large amounts of data from excel sheets.  The user is able to import
and save the data into the application's Database and also delete the data.

Because some of these deletions can consist of hundreds of thousands of rows, the
removal feature must be developed a little differently.

## Setup

When a User imports/uploads new data into the application, a`DataUpload` record
is created, along with a new `DataSet` record, for every single row from the
imported exec sheet.

The model `DataSet` has a `belongs_to` relationship to `DataUpload`.

#### app/models/data_set.rb {.snippet-heading}
{{< highlight ruby >}}
class DataSet < ApplicationRecord
  belongs_to :data_uploads
end
{{< /highlight >}}

The model `DataUpload` has a `has_many` relationship to `DataSet`.

#### app/models/data_upload.rb {.snippet-heading}
{{< highlight ruby >}}
class DataUpload < ApplicationRecord
  has_many :data_sets, dependent: :destroy
end
{{< /highlight >}}

Notice the `dependent: :destroy`.  This means that when a `DataUpload` record
gets deleted/destroyed, all of the associated `DataSet` records will be
destroyed as well.

This also loads every associated `DataSet` model instance into memory as well.
This will bog down the server if there is a very large association of thousands
of `DataSet` records.

The way we solve this is to use the `ActiveRecord::Relation#delete_all`. This
[method](https://apidock.com/rails/ActiveRecord/Relation/delete_all) performs a
single SQL statement and efficiently deletes all of the records within the
Relation.

*Look at the example below.*

{{< highlight ruby >}}
upload = DataUpload.last
data_sets = upload.data_sets

data_sets.delete_all
{{< /highlight >}}

>>### WARNING
>>- **DO NOT** use this method on more then 5,000 records in a Database table.  It will lock the Database for the entire transaction.
>>- `#delete_all` does not load the record, so any callbacks will not be fired.  Make sure the application and/or model is not dependent on any pre/post delete processes.

Now we can implement the method in the in the `DataUpload` callback.

#### app/models/data_upload.rb {.snippet-heading}
{{< highlight ruby >}}
class DataUpload < ApplicationRecord
  has_many :data_sets, dependent: :delete_all
end
{{< /highlight >}}


**BUT WAIT!!** If you were a good reader and saw the first WARNING above you
will notice that if I left the code this way and a particular `DataUpload`
instance had an association of more then 5,000 `DataSet` records... the
Database will lock for the entire transaction. To prevent from this we must
utilize one of the Ruby on Rails 5.0
[methods](http://api.rubyonrails.org/classes/ActiveRecord/Batches.html#method-i-in_batches)
`#in_batches`

*If you are not use a Rails version that is >= 5.0 then check out the gem [delete_in_batches](https://github.com/ankane/delete_in_batches)*

#### app/models/data_upload.rb {.snippet-heading}
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

First we remove the previous callback `dependent: :delete_all`, and replace it
with `before_destroy` callback and pass in the new private method
`#destroy_data_sets`.

You will notice that `#in_batches` takes an option `:of` set to `1000`. This
will limit the amount of records deleted in a single SQL transaction to 1,000.
Thus preventing the Database from locking.
