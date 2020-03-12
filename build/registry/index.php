<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- PAGE SPECIFIC -->
    <!-- Page Info -->
    <meta charset="utf-8" />
    <meta name="robots" content="noindex,nofollow" />
    <title>CBWT Registrant List</title>
    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="57x57" href="../images/favicons/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="../images/favicons/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="../images/favicons/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="../images/favicons/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="../images/favicons/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="../images/favicons/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="../images/favicons/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="../images/favicons/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="../images/favicons/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192" href="../images/faviconsandroid-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../images/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="../images/favicons/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../images/favicons/favicon-16x16.png">
    <link rel="manifest" href="/manifest.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">
    <!-- CSS -->
    <link rel="stylesheet" href="../css/main.css">
  </head>
  <body id="admin-page">
    
    <?php
      require_once "../includes/php/sysvars.php";

      $i = 1;
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

      try {
        $connection = new PDO( "mysql:host=$servername;dbname=$name", $username, $password );
        $connection -> setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

        $sql = "SELECT * FROM users";
        $statement = $connection -> prepare( $sql );
        $statement -> execute();
        $result = $statement;

        echo '<h1>CBWT Registrant List</h1>';
    ?>

    <p>Generated on <span id="time"></span></p>
    <script type="text/javascript">
      let now = new Date();
      let el = document.getElementById( 'time' );
      let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      function makeTime( hour, minutes ){
        if( hour > 12 ){
          return (hour - 12) + ':' + minutes + 'PM';
        } else {
          return hour + ':' + minutes + 'AM';
        }
      }
      el.innerHTML =
        '' +
        days[ now.getDay() ] +
        ' ' +
        months[ now.getMonth() ] + 
        ' ' + 
        now.getDate() +
        ', ' +
        now.getFullYear() +
        ' at ' +
        makeTime( now.getHours(), now.getMinutes() );
    </script>

    <?php
        echo '<table id="admin-display">';
        echo '<tr>';
        echo '<th></th>';
        echo '<th>Name</th>';
        echo '<th>Email</th>';
        echo '<th>Phone Number</th>';
        echo '</tr>';

        foreach( $result as $row ){
          echo '<tr>';
          echo '<td>' . $i . '</td>';
          echo '<td>' . $row['name'] . '</td>';
          echo '<td>' . $row['email'] . '</td>';
          echo '<td>' . $row['phone'] . '</td>';

          $i++;
        }

        echo '</tr>';
        echo '</table>';

      } catch( PDOException $e ){
        returnError( "Connection failed: " . $e->getMessage() . "\n" );
      };
    ?>

  </body>
</html>