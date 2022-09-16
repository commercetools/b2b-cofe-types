<?php

use Frontastic\Catwalk\Catwalk;

$autoloader = require_once __DIR__ . "/../vendor/autoload.php";

// @HACK: Allow for Vercel prototype to access API
ini_set('session.cookie_secure', 'true');
ini_set('session.cookie_samesite', 'None');

Catwalk::runWeb(__DIR__ . '/..', $autoloader);
