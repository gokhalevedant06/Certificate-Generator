'use strict';

const fs = require('fs');
const path = require('path');
const stream = require('stream');
const pImage = require('pureimage');
const EventEmitter = require('events').EventEmitter;

const LoadState = {
  IMAGE: 'image',
  FONT: 'font',
};

/**
 * Steam that saves data to a buffer
 */
class BufferWritable extends stream.Writable {
  constructor() {
    super();
    this.buffer = Buffer.alloc(0);
  }

  _write(chunk, encoding, callback) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    callback();
  }
}

/**
 * Steam that reads data from a buffer
 */
class BufferReadable extends stream.Readable {
  constructor(buffer) {
    super();
    this.buffer = buffer;
  }

  _read() {
    this.push(this.buffer);
    this.push(null);
  }
}

class Image extends EventEmitter {
  /**
   * Optionally load a file
   * @param {string} [imagePath]
   * @param {string} [imageType=auto]
   * @param {boolean} [silent=false]
   */
  constructor(imagePath, imageType = 'auto', silent = false) {
    super();

    this.silent = silent;

    this._isImageLoaded = false;
    this._isFontsLoaded = false;

    this._fontPromises = {};

    if (imagePath) {
      this.load(imagePath, imageType);
    }

    this.error = this.error.bind(this);
  }

  error(e) {
    this.emit('error', e);
    if (!this.silent) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  /**
   * Load an image from a file
   * @param {string} imagePath
   * @param {string} imageType png or jpeg (now only png is supported)
   * @returns {Image}
   */
  load(imagePath, imageType = 'auto') {
    imageType = Image._getTypeByPath(imagePath, imageType);
    const imageStream = fs.createReadStream(imagePath);

    if (imageType === 'jpg') {
      this._imgPromise = pImage.decodeJPEGFromStream(imageStream);
    } else {
      this._imgPromise = pImage.decodePNGFromStream(imageStream);
    }

    this._imgPromise.then((bitmap) => {
      this._updateLoadState(LoadState.IMAGE, bitmap);
    });

    return this;
  }

  /**
   * Load a TTF font file
   * @param {string} fontPath
   * @param {string} [fontName] By default it's base name of file
   */
  loadFont(fontPath, fontName) {
    if (!fontName) {
      fontName = path.parse(fontPath).name
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([a-z])[-_]([A-Z])/g, '$1 $2');
    }

    this._fontPromises[fontName] = new Promise((resolve) => {
      pImage.registerFont(fontPath, fontName).load(() => {
        this._updateLoadState(LoadState.FONT);
        resolve();
      });
    });

    return this;
  }

  /**
   * Make a copy of the current image
   * @return Image
   */
  copy() {
    const image = new this.constructor();
    image._imgPromise = this._imgPromise
      .then((bitmap) => {
        const copy = new bitmap.constructor(bitmap.width, bitmap.height);
        copy.data = Buffer.from(bitmap.data);
        return copy;
      })
      .catch(this.error);
    image._fontPromises = this._fontPromises;
    return image;
  }

  /**
   * This callback is called when a all resources are loaded
   * @callback Image~readyCallback
   * @param {Bitmap} [image]
   * @param {...Object}  [fonts]
   * @return {Bitmap} image
   */

  /**
   * Shortcut for handling loaded event
   * @param {Image~readyCallback} callback
   * @param {Boolean} [modifyImage] Is an image will be modified in a callback
   */
  ready(callback, modifyImage) {
    const promises = [this._imgPromise].concat(
      Object.values(this._fontPromises)
    );
    const newPromise = Promise.all(promises)
      .then((values) => callback(...values))
      .catch(this.error);

    if (modifyImage) {
      this._imgPromise = newPromise;
    }

    return this;
  }

  /**
   * This callback is called when a pureimage canvas is ready
   * @callback Image~drawCallback
   * @param {Context} ctx
   */

  /**
   * Draw on image canvas
   * @param {Image~drawCallback} callback
   * @returns {Image}
   */
  draw(callback) {
    this.ready((bitmap) => {
      const ctx = bitmap.getContext('2d');
      // Now pureimage doesn't render font without this
      ctx.USE_FONT_GLYPH_CACHING = false;
      callback(ctx);
      return bitmap;
    }, true);

    return this;
  }

  /**
   * Change canvas size of the current image
   * @param {Number} width
   * @param {Number} height
   * @returns {Image}
   */
  resize(width, height) {
    this.ready((bitmap) => {
      /** @type Bitmap */
      const resized = pImage.make(width, height, {
        fillval: 0x00000000,
      });

      const ctx = resized.getContext('2d');
      ctx.mode = 'REPLACE';
      ctx.drawImage(bitmap, 0, 0);
      return resized;
    }, true);

    return this;
  }

  /**
   * Save image data to buffer
   * @param {string} [imageType=png]
   * @returns {Promise.<Buffer>}
   */
  toBuffer(imageType = 'png') {
    return this._encode(new BufferWritable(), imageType)
      .then((buffer) => buffer.buffer)
      .catch(this.error);
  }

  /**
   * Load an image from a buffer
   * @param {Buffer} buffer
   * @param {string} [imageType=png]
   * @returns {Image}
   */
  fromBuffer(buffer, imageType = 'png') {
    const imageStream = new BufferReadable(buffer);
    if (imageType === 'jpg') {
      this._imgPromise = pImage.decodeJPEGFromStream(imageStream);
    } else {
      this._imgPromise = pImage.decodePNGFromStream(imageStream);
    }

    return this;
  }

  /**
   * Save image data to file
   * @param {string} imagePath
   * @param {string} [imageType=auto]
   * @returns {Promise.<stream.Writable>}
   */
  save(imagePath, imageType = 'auto') {
    imageType = Image._getTypeByPath(imagePath, imageType);
    return this._encode(fs.createWriteStream(imagePath), imageType);
  }

  _updateLoadState(target, object) {
    /**
     * @event Image#image-loaded
     * @param {Bitmap} image
     */
    /**
     * @event Image#font-loaded
     */
    /**
     * Fired when both image data and font are loaded
     * @event Image#loaded
     */

    switch (target) {
      case LoadState.IMAGE:
        this.emit('image-loaded', object);
        this._isImageLoaded = true;
        break;
      case LoadState.FONT:
        this.emit('font-loaded');
        this._isFontsLoaded = true;
        break;
      default:
        throw new Error(`Unknown load target ${target}`);
    }

    if (!this._isImageLoaded) {
      return;
    }

    if (this._isFontsLoaded || !this._fontPromises.length) {
      this.emit('loaded');
    }
  }

  async _encode(writeStream, imageType = 'png') {
    const bitmap = await this._imgPromise;

    if (imageType === 'jpg') {
      await pImage.encodeJPEGToStream(bitmap, writeStream);
    } else {
      await pImage.encodePNGToStream(bitmap, writeStream);
    }

    this.emit('encoded');

    return writeStream;
  }

  static _getTypeByPath(imagePath, imageType = 'auto') {
    if (['png, jpg'].indexOf(imageType) === -1) {
      if (imagePath.endsWith('jpg') || imagePath.endsWith('jpeg')) {
        return 'jpg';
      }

      return 'png';
    }

    return imageType;
  }
}

module.exports = Image;
module.exports.default = Image;
