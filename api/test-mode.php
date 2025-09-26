<?php
// ARCHIVO TEMPORAL PARA PRUEBAS - BORRAR EN PRODUCCIÓN
session_start();

if (isset($_GET['phase'])) {
    $_SESSION['test_phase'] = $_GET['phase'];
    $phase = $_GET['phase'];
    echo "<!DOCTYPE html>
<html>
<head>
    <title>Test Mode</title>
    <style>
        body {
            font-family: Arial;
            background: #f5e6d3;
            padding: 50px;
            text-align: center;
        }
        .container {
            background: white;
            border: 3px solid #3e2723;
            border-radius: 10px;
            padding: 30px;
            max-width: 500px;
            margin: 0 auto;
        }
        .success {
            color: green;
            font-size: 1.2em;
            margin: 20px 0;
        }
        a {
            display: inline-block;
            padding: 10px 20px;
            background: #ffb300;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px;
        }
    </style>
</head>
<body>
    <div class='container'>
        <h1>🧪 Test Mode Activated</h1>
        <p class='success'>✅ Phase changed to: <strong>" . strtoupper($phase) . "</strong></p>
        <p>You can now test this phase regardless of the actual time.</p>
        <a href='../index.html'>Go to Homepage</a>
        <a href='../nominate.html'>Test Nominate</a>
        <a href='../vote.html'>Test Vote</a>
        <hr>
        <p><small>Remember: This is only for testing. Delete this file in production.</small></p>
    </div>
</body>
</html>";
} else {
    echo "<!DOCTYPE html>
<html>
<head>
    <title>Test Mode Selector</title>
    <style>
        body {
            font-family: Arial;
            background: #f5e6d3;
            padding: 50px;
            text-align: center;
        }
        .container {
            background: white;
            border: 3px solid #3e2723;
            border-radius: 10px;
            padding: 30px;
            max-width: 500px;
            margin: 0 auto;
        }
        h1 {
            color: #3e2723;
        }
        .button {
            display: inline-block;
            padding: 15px 30px;
            background: #ffb300;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px;
            font-size: 1.1em;
        }
        .button:hover {
            background: #ff9800;
        }
        .current {
            background: #4CAF50;
        }
        .info {
            background: #fff3e0;
            border: 2px solid #ff9800;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class='container'>
        <h1>🧪 Archive of Meme - Test Mode</h1>
        <div class='info'>
            <p><strong>Current Time:</strong> " . gmdate('H:i') . " UTC</p>
            <p><strong>Normal Phase:</strong> " . getCurrentRealPhase() . "</p>
        </div>
        <h2>Select Test Phase:</h2>
        <a href='?phase=nomination' class='button'>📝 Test NOMINATION Phase</a>
        <a href='?phase=voting' class='button'>🗳️ Test VOTING Phase</a>
        <a href='?phase=archive' class='button'>📦 Test ARCHIVE Phase</a>
        <hr>
        <p><small>This allows you to test any phase regardless of the actual UTC time.</small></p>
    </div>
</body>
</html>";
}

function getCurrentRealPhase() {
    $hour = intval(gmdate('H'));
    if ($hour < 16) {
        return 'Nomination (00:00-16:00 UTC)';
    } else if ($hour < 20) {
        return 'Voting (16:00-20:00 UTC)';
    } else {
        return 'Archive (20:00-00:00 UTC)';
    }
}
?>