<div id='main-nav-bg'></div>
      <nav class='main-nav-fixed' id='main-nav'>
        <div class='navigation'>
          <ul class='nav nav-stacked'>
            <li class=''>
              <a href='#/clinic_dashboard'>
                <i class='icon-dashboard'></i>
                <span>Dashboard</span>
              </a>
            </li>
            <?php if($_SESSION['current_role']=='clinic_admin'): ?>
            <li class=''>
              <a href="#/edit_clinic_details"><i class='icon-edit'></i>
              <span>Clinic Details</span>
              </a>
            </li>
            <?php endif; ?>
            
            <?php if($_SESSION['current_role']!='doctor'): ?>
            <li class=''>
              <a href="#/slots"><i class='icon-edit'></i>
              <span>Manage Slots</span>
              </a>
            </li>
            <?php endif; ?>
            

            <?php if($_SESSION['current_role']=='clinic_admin' ||$_SESSION['current_role']=='receptionist' ||$_SESSION['current_role']=='nurse' ): ?>
            <li class=''>
              <a href="#/doctor_availability?page=availability"><i class='icon-edit'></i>
              <span>Doctor Availability</span>
              </a>
            </li>
            <?php endif; ?>
            

            <?php if($_SESSION['current_role']=='clinic_admin'): ?>
            <li class=''>
              <a href="#/manage_doctors"><i class='icon-edit'></i>
              <span>Manage Doctors</span>
              </a>
            </li>
            <?php endif; ?>

            
            <li class=''>
              <a href="#/manage_patients"><i class='icon-edit'></i>
              <span>Manage Patients</span>
              </a>
            </li>

             <li class=''>
              <a href="#/appointment_status"><i class='icon-edit'></i>
              <span>Appt. Status <b class="pull-right" id="unconfirmed_appointment_count"><?php echo unconfirmed_appointments().' Unconf.' ?></b></span>
              </a>
            </li>

             <li class=''>
              <a href="#/expense"><i class='icon-edit'></i>
              <span>Expense </span>
              </a>
            </li>

            <li class=''>
              <a href="#/manage_referrals"><i class='icon-edit'></i>
              <span>Referrals </span>
              </a>
            </li>
            <?php if($_SESSION['current_role']=='clinic_admin'): ?>
            <li class=''>
              <a href="#/add_item"><i class='icon-edit'></i>
              <span>Inventory Items </span>
              </a>
            </li>
            <?php endif; ?>
          </ul>
        </div>
      </nav>
      <section id='content'>
        <div class='container'>      