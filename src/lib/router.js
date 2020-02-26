
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

//========  layoutPostLoginis HOC  =========== 
import layoutPostLogin from '../coreAdmin/Layout/layoutPostLogin.js';



import UMListOfUsers from '../coreAdmin/userManagement/UM/UMListOfUsers.js';
import EditUserProfile from '../coreAdmin/userManagement/UM/EditUserProfile.js';
import UMRolesList from '../coreAdmin/userManagement/Roles/UMRolesList.js';


const UMListOfUsersPage = layoutPostLogin(UMListOfUsers);
const UMRolesListPage = layoutPostLogin(UMRolesList);
const EditUserProfilePage = layoutPostLogin(EditUserProfile);


export const routes  = (
        <div className="col-lg-10 col-lg-offset-2">
            <Router>
                  <Route path="/umroleslist"      component={UMRolesListPage}   exact />
                  <Route path="/edituserprofile"  component={EditUserProfilePage}   exact />
            </Router>
        </div>
);

