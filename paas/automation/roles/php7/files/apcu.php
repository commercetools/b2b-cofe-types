<?php
// Prints the status of apcu.
// Consumed by metricbeat.
$cacheInfo = apcu_cache_info();
unset($cacheInfo['cache_list']);
unset($cacheInfo['slot_distribution']);
echo json_encode($cacheInfo);
