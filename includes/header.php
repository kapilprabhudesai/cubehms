  <body class='fixed-header login  contrast-fb'>
    <header>
      <nav class="navbar navbar-default">
        <a class="navbar-brand" href="#/clinic_dashboard">
          <img width="81" height="21" class="logo" alt="Flatty" src="assets/images/logo.png">
          <img width="21" height="21" class="logo-xs" alt="Flatty" src="assets/images/logo_xs.png">
        </a>
        <a class="toggle-nav btn pull-left" href="#">
          <i class="icon-reorder"></i>
        </a>
        <ul class="nav">
          <li class="dropdown dark user-menu">
            <a class="dropdown-toggle" data-toggle="dropdown" href="#">
              <img width="23" height="23" alt="<?php echo display_name() ?>" src="assets/images/avatar.png">
              <span class="user-name"><?php echo display_name() ?>(<?php echo current_clinic_name()?>)</span>
              <b class="caret"></b>
            </a>
            <ul class="dropdown-menu">
              <li>
                <a href="<?php echo CMS_PATH ?>index.php#change_password">
                  <i class="icon-cog"></i>
                  Change Password
                </a>
              </li>
              <li class="divider"></li>
              <li>
                <a href="<?php echo CMS_PATH ?>inc/functions.php?action=logout">
                  <i class="icon-signout"></i>
                  Sign out
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>

    <div id='wrapper'>