#! /usr/bin/env node
var opts     = require('rc')('lq', {encoding: 'json'})
var levelup  = require('level')
var sublevel = require('level-sublevel')
var path     = require('path')


var db = sublevel(levelup(path.resolve(opts._[0] || '.'), opts))

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
  opts.min = '',
  opts.max = '\xff\xff\xff'
}

db.createReadStream({
  min: opts.min,
  max: opts.max,
  reverse: opts.reverse
})
.on('data', console.log)
