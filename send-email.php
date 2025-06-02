<?php
// Retrieve the form data
$name = $_POST['name'];
$email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];

// Build the email content
$body = "Name: $name\n\nEmail: $email\n\nSubject: $subject\n\nMessage:\n$message";

// Send the email
$to = "chitransh.atre@gmail.com";
$headers = "From: $email";
if (mail($to, $subject, $body, $headers)) {
  echo "Thank you for your message!";
} else {
  echo "There was a problem sending your message.";
}
?>

