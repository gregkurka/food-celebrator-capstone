<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $uploadDir = "uploads/";

    if (!isset($_FILES['file'])) {
        echo json_encode(["status" => "error", "message" => "No file uploaded."]);
        exit;
    }

    $file = $_FILES['file'];
    $fileExtension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
    $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (!in_array($fileExtension, $allowedTypes)) {
        echo json_encode(["status" => "error", "message" => "Invalid file type."]);
        exit;
    }

    // Generate a unique filename
    $uniqueName = time() . "_" . bin2hex(random_bytes(4)) . "." . $fileExtension;
    $targetFilePath = $uploadDir . $uniqueName;

    if (move_uploaded_file($file["tmp_name"], $targetFilePath)) {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
        $domain = $_SERVER['SERVER_NAME'];
        $publicUrl = $protocol . $domain . "/" . $targetFilePath;

        echo json_encode(["status" => "success", "message" => "File uploaded successfully!", "url" => $publicUrl], JSON_UNESCAPED_SLASHES);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to move uploaded file."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>
