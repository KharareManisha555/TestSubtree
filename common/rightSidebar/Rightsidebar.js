import React,{Component}                      from 'react';
import {BrowserRouter as Router, Route,Link } from 'react-router-dom';
import $                                      from "jquery";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './Rightsidebar.css';

export default class Rightsidebar extends Component{
  
  constructor(props) {
   super(props);
    this.state = {}
  }
 
  render(){
    return(
      <Router>
        <div>
          <aside className="leftsidebar">
            <div className="wrapper">
              <nav id="sidebar1">       
                <ul className="list-unstyled components">
                  <li className="active">
                    <div className="rightsideHeading ">
                      Core Admin Modules
                    </div>
                  </li>
                  <li className="sidebarMenuText">
                    <a href="/companysetting" >
                      <i className="fa fa-building addCircle" />
                      Organization Setting
                    </a>
                  </li>
                  <li className="sidebarMenuText">
                    <a href="/ViewTemplates" >
                      <i className="fa fa-envelope yellowColor" />
                      Notification Management
                    </a>
                  </li>
                  <li className="sidebarMenuText">
                    <a href="/umlistofusers" >
                       <i className="glyphicon fa fa-users greenColor"></i> 
                         User Management
                    </a>
                  </li>
                  <li className="sidebarMenuText">
                      <a href="/module" title="Module Master">
                        <i className="fa fa-th-large aquaColor"></i>  
                        <span className="sidebarMenuSubText">Module Master</span>
                      </a>
                  </li>
                  <li>
                      <a href="/facility" title="Module Master">
                        <i class="fa fa-briefcase darkGreenColor"></i>
                        <span className="sidebarMenuSubText">Facility Master</span>
                      </a>
                  </li>
                  <li>
                      <a href="/access-management" title="Access Management">
                      <i class="fa fa-user-plus blueColor"></i>
                        <span className="sidebarMenuSubText">Access Management</span>
                      </a>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      </Router>
    );
  }
}
