<div id='main-nav-bg'></div>
      <nav class='main-nav-fixed' id='main-nav'>
        <div class='navigation'>
          <?php if($_SESSION['current_role']=='patient'): ?>
            <ul class='nav nav-stacked'>
              <li class=''>
                <a href='#/patient_dashboard'>
                  <i class='icon-dashboard'></i>
                  <span>Dashboard</span>
                </a>
              </li>
              <li class=''>
                <a href="#/edit_me"><i class='icon-user'></i>
                <span>Edit Profile</span>
                </a>
              </li>

              <li class=''>
                <a href="#/my_appointments"><i class='icon-stethoscope'></i>
                <span>My Appointments</span>
                </a>
              </li>

            </ul>  
          <?php endif; ?>

          <?php if($_SESSION['current_role']!='patient'): ?>
          <ul class='nav nav-stacked'>
            <li class=''>
              <a href='#/clinic_dashboard'>
                <i class='icon-dashboard'></i>
                <span>Dashboard</span>
              </a>
            </li>
            <?php if($_SESSION['current_role']=='clinic_admin'): ?>
            <li class=''>
              <a href="#/edit_clinic_details"><i class='icon-stethoscope'></i>
              <span>Clinic Details</span>
              </a>
            </li>
            <?php endif; ?>
            
            <?php if($_SESSION['current_role']!='doctor'): ?>
            <li class=''>
              <a href="#/slots"><i class='icon-time'></i>
              <span>Manage Slots</span>
              </a>
            </li>
            <?php endif; ?>
            

            <?php if($_SESSION['current_role']=='clinic_admin' ||$_SESSION['current_role']=='receptionist' ||$_SESSION['current_role']=='nurse' ): ?>
            <li class=''>
              <a href="#/doctor_availability?page=availability"><i class='icon-calendar'></i>
              <span>Doctor Availability</span>
              </a>
            </li>
            <?php endif; ?>
            

            <?php if($_SESSION['current_role']=='clinic_admin' || $_SESSION['current_role']=='receptionist' || $_SESSION['current_role']=='nurse'): ?>
            <li class=''>
              <a href="#/manage_doctors"><i class='icon-plus-sign-alt'></i>
              <span>Manage Doctors</span>
              </a>
            </li>
            <?php endif; ?>

            
            <li class=''>
              <a href="#/manage_patients"><i class='icon-group'></i>
              <span>Manage Patients</span>
              </a>
            </li>

             <li class=''>
              <a href="#/appointment_status"><i class='icon-meh'></i>
              <span>Appt. Status <b class="pull-right" id="unconfirmed_appointment_count"><?php echo unconfirmed_appointments().' Unconf.' ?></b></span>
              </a>
            </li>

             <li class=''>
              <a href="#/expense"><i class='icon-inr'></i>
              <span>Expense </span>
              </a>
            </li>

            <li class=''>
              <a href="#/manage_referrals"><i class='icon-code-fork'></i>
              <span>Referrals </span>
              </a>
            </li>
            <?php if($_SESSION['current_role']=='clinic_admin'): ?>
            <li class=''>
              <a href="#/add_item"><i class='icon-bitbucket'></i>
              <span>Inventory Items </span>
              </a>
            </li>
            <?php endif; ?>
          </ul>
          <?php endif; ?>
        </div>
      </nav>
      <section id='content'>
        <div class='container'>      