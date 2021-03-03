let isEqual = require('lodash.isequal'),
    forEach = require('lodash.foreach'),
    isEmpty = require('lodash.isempty'),
    cloneObject = require('lodash.clone'),
    extendObject = require('lodash.assign'),
    debouncer = require("./Debouncer")

function Scrllr(options) {
  options = extendObject(Scrllr.options, options)

  this.lastKnownScrollY = 0
  this.initialised = false
  this.onScrollCallback = options.onScrollCallback
}

Scrllr.prototype = {
  constructor : Scrllr,

  init : function() {
    this.debouncer = new debouncer(this.update.bind(this))

    // defer event registration to handle browser
    // potentially restoring previous scroll position
    setTimeout(this.attachEvent.bind(this), 100)

    return this
  },

  attachEvent : function() {
    if(!this.initialised) {
      this.lastKnownScrollY = this.getScrollY()
      this.initialised = true

      window.addEventListener('scroll', this.debouncer, false)
      this.debouncer.handleEvent()
    }
  },

  getScrollY : function() {
    return (window.pageYOffset !== undefined)
      ? window.pageYOffset
      : (window.scrollTop !== undefined)
          ? window.scrollTop
          : (document.documentElement || document.body.parentNode || document.body).scrollTop
  },

  update : function() {
    let currentScrollY  = this.getScrollY(),
        scrollDirection = currentScrollY > this.lastKnownScrollY ? 'down' : 'up'

    this.onScrollCallback(currentScrollY)
    this.lastKnownScrollY = currentScrollY
  },

  destroy : function() {
    this.initialised = false
    window.removeEventListener('scroll', this.debouncer, false)
  }

}

Scrllr.options = {
  onScrollCallback: function(){}
}

module.exports = Scrllr
