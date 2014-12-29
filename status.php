    <?php
     
    $ip = '168.235.146.88';
    $port = '9339';
     
    $online = @fsockopen( $ip, $port, $errno, $errstr, 200);
    if($online >= 1) {
    echo '<font color="green">Online</font>';
    }
    else {
    echo '<font color="red">Offline</font>';
    }
    ?>
