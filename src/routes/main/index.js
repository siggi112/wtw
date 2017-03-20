'use strict';
const express = require('express');
const router = require('express').Router();

router.get('/', function(req, res, next) {
  return res.render('pages/index', {title: 'What to Watch'});
});




module.exports = router;
