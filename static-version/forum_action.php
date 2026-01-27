<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $title = $conn->real_escape_string($_POST['title']);
    $content = $conn->real_escape_string($_POST['content']);

    $sql = "INSERT INTO forum_posts (user_id, title, content) VALUES ($user_id, '$title', '$content')";

    if ($conn->query($sql)) {
        header("Location: index.php?post=success#forum");
    } else {
        echo "Error: " . $conn->error;
    }
} else {
    header("Location: index.php");
}
?>