---
title: "Rails '#delete_all' - Fast & Powerful - Beware"
date: 2018-05-23T18:30:21-05:00
draft: false
img: 'headless.jpeg'
---
## What You Will Learn
- Fast way to delete large batch of rows in a Database table
- How to prevent from freezing your Database
- How to use the method in replace of `depedent: :delete_all` 'has_many' association.

## Who This Is For
- Rails developers that need to remove a large batch of rows in a Relational Database table.

## Requirements
- Ruby
- Rails
- Relational Database like MySQL or PostgreSQL

## Overview

I am currently working on a Rails project that deals with importing and exporting large amounts of data.  The user is able to import and store data into the applications Database as well and delete the data.

Because some of these data deletions can consist of thousands of rows you must code the removal process a-little differently.

When a User imports/uploads new data into the application it creates a new 'DataUplodad' model.  The application also creates a new 'DataSet' model for every single data set from the import.

I have the model `DataSet` which has a `belongs_to` relationship to `DataUploads`.

{{< highlight ruby >}}
  class DataSet
    belongs_to :data_uploads
  end
{{< /highlight >}}

I have the model `DataUploads` which has a `has_many` relationship to `DataSets`.

{{< highlight ruby >}}
  class DataUpload
    has_many :data_sets, dependent: :destroy
  end
{{< /highlight >}}

Notice the `dependent: :destroy`.  This means that when a DataUpload model get deleted/destroyed, all of the associated `DataSet` models will all get destroyed as well.

This unfortunetly also loads every associated 'DataSet' model into memory as well.  If there are thousands of 'Data Set' models, that is going to take a long time.

