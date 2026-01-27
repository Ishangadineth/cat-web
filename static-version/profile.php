<?php
require_once 'config.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$sql = "SELECT * FROM users WHERE id = $user_id";
$user = $conn->query($sql)->fetch_assoc();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        <?php echo $user['username']; ?>'s Profile | CatUniverse
    </title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    <style>
        .profile-container {
            max-width: 800px;
            margin: 100px auto;
            padding: 4rem;
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 3rem;
            text-align: center;
            box-shadow: 0 0 40px rgba(255, 107, 38, 0.1);
        }

        .profile-header img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 4px solid var(--primary);
            margin-bottom: 2rem;
            object-fit: crop;
        }

        .profile-stats {
            display: flex;
            justify-content: center;
            gap: 3rem;
            margin: 2rem 0;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 2rem;
        }

        .stat-item h3 {
            color: var(--primary);
            font-size: 1.5rem;
        }

        .stat-item p {
            font-size: 0.9rem;
            color: var(--text-muted);
        }
    </style>
</head>

<body>
    <nav>
        <div class="logo">Cat<span>Universe</span></div>
        <ul class="nav-links">
            <li><a href="index.php">Back to Home</a></li>
            <li><a href="auth.php?logout=1" style="color: #f87171;">Logout</a></li>
        </ul>
    </nav>

    <main>
        <div class="profile-container" data-aos="fade-up">
            <div class="profile-header">
                <img src="https://ui-avatars.com/api/?name=<?php echo $user['username']; ?>&background=FF6B26&color=fff"
                    alt="Avatar">
                <h1>Welcome, <span>
                        <?php echo $user['username']; ?>
                    </span></h1>
                <p style="color: var(--text-muted); margin-top: 1rem;">
                    <?php echo $user['email']; ?>
                </p>
            </div>

            <div class="profile-stats">
                <div class="stat-item">
                    <h3>0</h3>
                    <p>Forum Posts</p>
                </div>
                <div class="stat-item">
                    <h3>0</h3>
                    <p>Cats Registered</p>
                </div>
                <div class="stat-item">
                    <h3>1</h3>
                    <p>Community Rank</p>
                </div>
            </div>

            <div class="profile-bio" style="text-align: left; margin-top: 3rem;">
                <h3 style="margin-bottom: 1rem;">About Me</h3>
                <p style="color: var(--text-muted); line-height: 1.8;">
                    <?php echo $user['bio'] ? $user['bio'] : "No bio added yet. Tell us about your cats!"; ?>
                </p>
            </div>

            <a href="index.php#forum" class="btn-buy" style="margin-top: 3rem; display: inline-block;">Start a
                Discussion</a>
        </div>
    </main>
</body>

</html>