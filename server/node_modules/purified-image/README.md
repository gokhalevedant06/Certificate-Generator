# node-purified-image
[![Build Status](https://travis-ci.org/megahertz/node-purified-image.svg?branch=master)](https://travis-ci.org/megahertz/node-purified-image)
[![npm version](https://badge.fury.io/js/purified-image.svg)](https://badge.fury.io/js/purified-image)

## Description

Load, save and draw with API similar to HTML Canvas Context 2D.
No native dependencies. Wrap 
[PureImage](https://github.com/joshmarinacci/node-pureimage) library.

## Requirements
 - node >= 8

## PureImage

PureImage is a pure JavaScript implementation of image drawing and encoding
API, based on HTML Canvas, for NodeJS. It has no native dependencies.  

Current features:

 - set pixels
 - stroke and fill paths (rectangles, lines, quadratic curves, bezier curves, arcs/circles)
 - copy and scale images (nearest neighbor)
 - import and export JPG and PNG from streams using promises
 - render basic text (no bold or italics yet)
 - anti-aliased strokes and fills
 - transforms
 - standard globalAlpha and rgba() alpha compositing
 - clip shapes

## Installation

Install with [npm](https://npmjs.org/package/purified-image):

    npm install purified-image

## Usage

```js
const Image = require('purified-image');

let image = new Image('img/template.png');
image
  .loadFont('/res/OpenSans.ttf')
  .draw(ctx => {
    ctx.fillStyle = '#000000';
    ctx.font = '20 Open Sans';
    ctx.fillText('example', 30, 30);
  })
  .save('out.jpg')
  .then(() => console.log('saved'));
```
    
## API
[class Image](docs/api-Image.md)

## License

Licensed under MIT.
