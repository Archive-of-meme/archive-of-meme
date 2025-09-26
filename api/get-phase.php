<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$current_phase = getCurrentPhase();
$utc_hour = intval(gmdate('H'));
$utc_minute = intval(gmdate('i'));
$utc_time = gmdate('Y-m-d H:i:s');

// Calculate next phase time
$next_phase_time = '';
$time_remaining = '';

if ($current_phase === 'nomination') {
    $next_phase_time = gmdate('Y-m-d') . ' 16:00:00';
    $seconds_remaining = strtotime($next_phase_time) - time();
} elseif ($current_phase === 'voting') {
    $next_phase_time = gmdate('Y-m-d') . ' 20:00:00';
    $seconds_remaining = strtotime($next_phase_time) - time();
} else {
    // Archive phase - next phase is tomorrow at 00:00
    $next_phase_time = gmdate('Y-m-d', strtotime('+1 day')) . ' 00:00:00';
    $seconds_remaining = strtotime($next_phase_time) - time();
}

$hours_remaining = floor($seconds_remaining / 3600);
$minutes_remaining = floor(($seconds_remaining % 3600) / 60);
$seconds_remaining = $seconds_remaining % 60;

$response = [
    'success' => true,
    'current_phase' => $current_phase,
    'utc_time' => $utc_time,
    'utc_hour' => $utc_hour,
    'utc_minute' => $utc_minute,
    'next_phase_time' => $next_phase_time,
    'time_remaining' => [
        'hours' => $hours_remaining,
        'minutes' => $minutes_remaining,
        'seconds' => $seconds_remaining,
        'formatted' => sprintf('%02d:%02d:%02d', $hours_remaining, $minutes_remaining, $seconds_remaining)
    ],
    'phases' => [
        'nomination' => [
            'start' => '00:00 UTC',
            'end' => '16:00 UTC',
            'active' => $current_phase === 'nomination'
        ],
        'voting' => [
            'start' => '16:00 UTC',
            'end' => '20:00 UTC',
            'active' => $current_phase === 'voting'
        ],
        'archive' => [
            'start' => '20:00 UTC',
            'end' => '00:00 UTC',
            'active' => $current_phase === 'archive'
        ]
    ]
];

echo json_encode($response);
?>