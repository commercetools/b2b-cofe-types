<?php

header(($_SERVER["SERVER_PROTOCOL"] ?? 'HTTP/1.1') . ' 503 Service Temporarily Unavailable');
header('Status: 503 Service Temporarily Unavailable');



if (strpos($_SERVER['HTTP_ACCEPT'], 'text/html') !== false) {
    echo "<h1>Not Ready</h1>";
    echo "<h2>Project not yet deployed</h2>";
} else {
    echo json_encode([
        'ok' => false,
        'message' => 'Project not yet deployed.',
    ]);
}
