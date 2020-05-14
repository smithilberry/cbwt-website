# CampBikeWineTour presentation app

A presentation layer on a Node/Express server for the [CampBikeWineTour](https://www.campbikewinetour.com) website.

## Requirements

- node
- yarn

## Setup

### Install local dependencies

```
$ yarn install
```

### Serve Parcel with an Express API middleware over SSL

```bash
$ yarn start # This is the primary sript to develop with
```

### Other scripts not needed on their own

```bash
# Serve a pure Parcel dev server
$ yarn dev

# Build a pure Parcel static distribution
$ yarn compile

 # Clean the dist folder
$ yarn destroy

 # Clean node modules and yarn cache
$ yarn purge

# Serve the Application without any clean-up
$ yarn serve
```

## Deployment

Heroku has automatic deployments on the `master` branch. As soon as a push to git ends, Heroku will do a build.

## Caveats

- While running Parcel through an Express middleware, the JS asset files will refuse to import/require modules - they wont be found. Not sure if this is a bug on Parcel or bad config on the middleware.

- While Parcel does use Babel, some features of modern JS are still not compiled appropriately - such as async/await. This requires additional packages and config.
