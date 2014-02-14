#! /usr/bin/env node
var opts     = require('rc')('lq', {encoding: 'json'})
var levelup  = require('level')
var path     = require('path')
var through  = require('through')

if(opts.v || opts.version)
  return console.log(require('./package.json').version)

var db = levelup(path.resolve(opts._[0] || '.'), opts)

if(opts.max)
  opts.max = opts.max.split('\\xff').join('\xff')
if(opts.min)
  opts.min = opts.min.split('\\xff').join('\xff')
if(opts.pre)
  opts.pre = opts.pre.split('\\xff').join('\xff')

if(opts.pre) {
  opts.min = opts.pre
  opts.max = opts.pre + '\xff'
}

if(opts.all) {
  opts.start = '',
  opts.end = '\xff\xff\xff'
}

opts.start = opts.min
opts.end = opts.max

function stringify () {
  var first = true
  return through(function (data) {
    if(first) this.queue('[\n'), first = false
    else      this.queue(',\n')
    this.queue(JSON.stringify(data, null, 2))
  }, function () {
    if(first) this.queue('[]\n')
    else      this.queue(']\n')
    this.queue(null)
  })
}

db.createReadStream(opts)
  .pipe(stringify())
  .pipe(process.stdout)

