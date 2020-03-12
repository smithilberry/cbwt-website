<?php
  require_once "sysvars.php";
  require_once "recaptchalib.php";

  $formData = (object) array(
    'name' => null,
    'email' => null,
    'number' => null,
    'size' => null,
    'arrival' => null,
    'recaptcha' => null,
  );

  $returnedData = (object) array(
    'success' => false,
    'fail' => null,
    'notes' => null,
  );

  function returnError( $err ){
    global $returnedData;
    $returnedData->fail = true;
    $returnedData->notes = $err;
    exit( json_encode( $returnedData ) );
  };

  function cleanData( $data ){
    $cleanData = htmlspecialchars(strip_tags(trim( $data )));
    return $cleanData;
  };

  if ( $_SERVER['REQUEST_METHOD'] == 'POST' ){
    if( isset($_POST['name']) &&
        isset($_POST['email']) &&
        isset($_POST['phone']) &&
        isset($_POST['g-recaptcha-response'])
    ){
      $formData->name         =     cleanData($_POST['name']);
      $formData->phone        =     cleanData($_POST['phone']);
      $formData->size         =     "";
      $formData->arrival      =     "";
      $formData->email        =     cleanData(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL));
      $formData->recaptcha    =     $_POST['g-recaptcha-response'];

      if( filter_var( $formData->email, FILTER_VALIDATE_EMAIL) ){
        $formData->email      =     $formData->email;

        $url = 'https://www.google.com/recaptcha/api/siteverify';
        $data = array(
          'secret' => $privatekey,
          'response' => $formData->recaptcha,
          'remoteip' => $_SERVER['REMOTE_ADDR']
        );

        $curlConfig = array(
            CURLOPT_URL => $url,
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POSTFIELDS => $data
        );

        $ch = curl_init();
        curl_setopt_array($ch, $curlConfig);
        $response = curl_exec($ch);
        curl_close($ch);

        $jsonResponse = json_decode($response);
        if( $jsonResponse->success === true ){
          try {
            ////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////
            //
            // Begin connection to server for SQL Injection and Mailer function
            //
            ////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////
            $connection = new PDO( "mysql:host=$servername;dbname=$name", $username, $password );
            $connection -> setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

            $checkNameSql = "SELECT name from users";
            $checkNameStatement = $connection -> prepare( $checkNameSql );
            $checkNameStatement -> execute();
            $checkNameResult = $checkNameStatement->fetchAll();

            foreach( $checkNameResult as $checkedName ){
              if( $formData->name == $checkedName['name'] ){
                $connection = null;
                returnError( "That name has already been used" );
              };
            };

            $checkEmailSql = "SELECT email from users";
            $checkEmailStatement = $connection -> prepare( $checkEmailSql );
            $checkEmailStatement -> execute();
            $checkEmailResult = $checkEmailStatement->fetchAll();

            foreach( $checkEmailResult as $checkedEmail ){
              if( $formData->email == $checkedEmail['email'] ){
                $connection = null;
                returnError( "That email has already been used" );
              };
            };

            $sql = "INSERT INTO users(name, email, phone, size, arrival) VALUES(?,?,?,?,?)";
            $statement = $connection -> prepare( $sql );
            $statement -> execute( array(
              $formData->name,
              $formData->email,
              $formData->phone,
              $formData->size,
              $formData->arrival
            ) );

            $connection = null;

            $subject = "Someone has signed up for the CBWT mailing list!";
            $message = "" . $formData->email . " would like to join the mailing list.";
            $headers = 'From: ' . $email_home . "\r\n" .
            'Reply-To: '. $formData->email . "\r\n" .
            'X-Mailer: PHP/' . phpversion();
            
            mail( $email_home, $subject, $message, $headers ) or exit( "Error!" );

            $returnedData->success = true;
            echo json_encode( $returnedData );
          } catch( PDOException $e ){
            returnError( "Connection failed: " . $e->getMessage() . "\n" );
          };
        } else {
          returnError( "reCaptcha response was not successful." );
        };
      } else {
        returnError( "Email field is not valid." );
      };
    } else {
      returnError( "One or more form fields is empty or invalid." );
    };
  } else {
    returnError( "Form was not submitted properly. Please check the AJAX call." );
  };
?>



