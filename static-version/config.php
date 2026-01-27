<?php
// Database Configuration
$db_host = 'sql311.infinityfree.com';
$db_user = 'if0_39232866'; // Assuming this based on your database name
$db_pass = 'hFynheu8Bxz5J';
$db_name = 'if0_39232866_ids_petgoofy';

// Create connection
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Start Session
session_start();
?>
