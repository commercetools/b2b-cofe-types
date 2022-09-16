<?php
// Prints the status of the opcache.
// Consumed by metricbeat.
echo json_encode(opcache_get_status(false));
