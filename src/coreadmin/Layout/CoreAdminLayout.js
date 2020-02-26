import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getRoleWiseAccess } from '../redux/actions/index';

import CenterwiseBarChart from '../dashboard/chart1/CenterwiseBarChart1.js'
import SourcewiseBarChart from '../dashboard/chart1/SourcewiseBarChart1.js'
import Chart1           from '../dashboard/chart1/chart1.js'
import Chart            from '../dashboard/chart1/chart.js'
import CenterwiseBudget from '../dashboard/chart1/CenterwiseBudget.js'
import monthwiseCharts  from '../dashboard/chart1/monthwiseCharts.js'

import Dashboard        from '../dashboard/Dashboard.js'
import DashboardNew     from '../dashboard/DashboardNew.js'
import UMListOfUsers    from '../userManagement/UM/UMListOfUsers.js';

import EditUserProfile  from '../userManagement/UM/EditUserProfile.js';
import UserProfile      from '../userManagement/UM/UserProfile.js';
import UMRolesList      from '../userManagement/Roles/UMRolesList.js';
import OrganizationSetting from '../companysetting/Components/OrganizationSetting.js';
import ViewTemplates    from '../NotificationManagement/ViewTemplates.jsx';

//============ Vendor Management ======================
import BasicInfo        from '../Master/EntityMaster/Onboarding/basicInfo/BasicInfo.jsx';
import LocationDetails  from '../Master/EntityMaster/Onboarding/locationDetails/LocationDetails.jsx';
import ContactDetails   from '../Master/EntityMaster/Onboarding/contactDetails/ContactDetails.jsx';
import ListOfEntities   from '../Master/EntityMaster/listOfEntities/components/ListOfEntities.jsx';
import ListOfVehicles   from '../Master/VehicleMaster/listOfVehicles/components/ListOfVehicles.jsx';
import Category         from '../Master/Category/Category.jsx';
import LocationType     from '../Master/LocationType/LocationType.jsx';
import SelectVendor     from '../Master/EntityMaster/SelectVendor/SelectVendor.js';
// ============ Payment Process ======================= 
import OrderPage        from "../PaymentProcess/OrderPage.js";
import PlanPage         from "../PaymentProcess/PlanPage.js";
import InvoicePage      from "../PaymentProcess/InvoicePage.js";
import InvoicePageView  from "../PaymentProcess/InvoicePageView.js";
import PaymentResponse  from "../PaymentProcess/PaymentResponse.js";

// ============ Rate Master =========================== 
import PackageMaster    from "../PackageMaster/PackageMaster.js";

// ============= One Field Component ==================
import FuleType         from "../Master/FuleType/FuleType.js"
import PersonMaster     from "../Master/PersonMaster/PersonMaster.js"
import PersonList       from "../Master/PersonMaster/PersonList.js"
import Model            from "../Master/Model/Model.js"
import Brand            from "../Master/Brand/Brand.js"
import Designation      from "../Master/Designation/Designation.js"
import Department       from "../Master/Department/Department.js"
import PackageType      from "../Master/PackageType/PackageType.js"
import Module           from "../Master/Module/Module.js"
import Facility         from "../Master/Facility/Facility.js"

// ============= Vehicle Master =======================
import VehicleMaster    from "../Master/VehicleMaster/VehicleMaster.js"
import BookingMaster    from "../Master/BookingMaster/BookingMaster.js"
import BookingDetails   from "../Master/BookingMaster/BookingDetails.js"

// ========================== access-management ====================
import AccessManagement from "../../FiveBess/AccessManagement/AccessManagement.js"



class CoreAdminLayout extends Component {

    constructor(props) {
        super();
        this.state = {
            loggedIn: false,
        }
    }

    componentDidMount() {
        const token = localStorage.getItem("token");
        if (token != null && token != "undefined") {
            this.setState({
                loggedIn: true
            })
        } else { }

    }

    logout() {
        var token = localStorage.removeItem("token");
        if (token != null && token != "undefined") {
            this.setState({
                loggedIn: false
            })
        }
    }

    render() {
        return (
            <Switch >
                <Route path="/CenterwiseBarChart" component={CenterwiseBarChart} exact />
                <Route path="/SourcewiseBarChart" component={SourcewiseBarChart} exact />
                <Route path="/Chart" component={Chart} exact />
                <Route path="/monthwiseCharts" component={monthwiseCharts} exact />
                <Route path="/CenterwiseBudget" component={CenterwiseBudget} exact />
                <Route path="/Chart1" component={Chart1} exact />
                <Route path="/" component={Dashboard} exact />
                <Route path="/DashboardNew" component={DashboardNew} exact />
                <Route path="/dashboard" component={Dashboard} exact />
                <Route path="/umlistofusers" component={UMListOfUsers} exact />
                <Route path="/umroleslist" component={UMRolesList} exact />
                <Route path="/edituserprofile/:id" component={EditUserProfile} exact />
                <Route path="/profile/:id" component={UserProfile} exact />
                <Route path="/ViewTemplates" component={ViewTemplates} exact />
                <Route path="/companysetting" component={OrganizationSetting} exact />

                { /* Entity Management */}
                <Route path="/:entity/basic-details" exact strict component={BasicInfo} />
                <Route path="/:entity/basic-details/:entityID" exact strict component={BasicInfo} />
                <Route path="/:entity/location-details/:entityID" exact strict component={LocationDetails} />
                <Route path="/:entity/location-details/:entityID/:locationID" exact strict component={LocationDetails} />
                <Route path="/:entity/contact-details/:entityID" exact strict component={ContactDetails} />
                <Route path="/:entity/contact-details/:entityID/:contactID" exact strict component={ContactDetails} />

                <Route path="/:entity/list" exact strict component={ListOfEntities} />
                <Route path="/:entity/category" exact strict component={Category} />
                <Route path="/:entity/category/:entityID" exact strict component={Category} />
                <Route path="/:entity/location-type" exact strict component={LocationType} />
                <Route path="/:entity/location-type/:locationTypeID" exact strict component={LocationType} />
                <Route path="/supplier" exact strict component={SelectVendor} />
                <Route path="/category" exact strict component={Category} />
                <Route path="/category/:fieldID" exact strict component={Category} />
                <Route path="/location-type" exact strict component={LocationType} />
                <Route path="/location-type/:fieldID" exact strict component={LocationType} />
                <Route path="/package-type" exact strict component={PackageType} />

                <Route path="/package-type/:fieldID" exact strict component={PackageType} />
                <Route path="/module" exact strict component={Module} />
                <Route path="/module/:fieldID" exact strict component={Module} />

                <Route path="/facility" exact strict component={Facility} />
                <Route path="/facility/:fieldID" exact strict component={Facility} />

                { /* Payment Process */}

                <Route path="/InvoicePage/:order_id" exact strict component={InvoicePage} />
                <Route path="/payment-process" exact strict component={PlanPage} />
                <Route path="/MyOrders" exact strict component={OrderPage} />
                <Route path="/invoicePageView/:order_Id" exact strict component={InvoicePageView} />
                <Route path="/payment-response/:orderId" exact strict component={PaymentResponse} />

                { /* Payment Process */}

                <Route path="/package-master" exact strict component={PackageMaster} />
                <Route path="/package-master/:packageID" exact strict component={PackageMaster} />

                { /* Payment Process */}

                <Route path="/fuel-type" exact strict component={FuleType} />
                <Route path="/fuel-type/:fieldID" exact strict component={FuleType} />
                <Route path="/brand" exact strict component={Brand} />
                <Route path="/brand/:fieldID" exact strict component={Brand} />
                <Route path="/designation" exact strict component={Designation} />
                <Route path="/designation/:fieldID" exact strict component={Designation} />
                <Route path="/Department" exact strict component={Department} />
                <Route path="/Department/:fieldID" exact strict component={Department} />

                <Route path="/model/:fieldID" exact strict component={Model} />
                <Route path="/model" exact strict component={Model} />

                <Route path="/:type/master/:fieldID" exact strict component={PersonMaster} />
                <Route path="/:type/master" exact strict component={PersonMaster} />
                <Route path="/:type/lists" component={PersonList} />

                <Route path="/booking" component={BookingMaster} />
                <Route path="/booking-details" component={BookingDetails} />
                <Route path="/:entity/master/:fieldID" exact strict component={PersonMaster} />
                <Route path="/:entity/master" exact strict component={PersonMaster} />
                <Route path="/:entity/lists" component={PersonList} />

                { /* Vendor Management */}

                <Route path="/vendor/basic-details" exact strict component={BasicInfo} />
                <Route path="/vendor/basic-details/:vendor_ID" exact strict component={BasicInfo} />
                <Route path="/vendor/location-details/:vendor_ID" exact strict component={LocationDetails} />
                <Route path="/vendor/location-details/:vendor_ID/:location_ID" exact strict component={LocationDetails} />
                <Route path="/vendor/contact-details/:vendor_ID" exact strict component={ContactDetails} />
                <Route path="/vendor/contact-details/:vendor_ID/:contactDetails_ID" exact strict component={ContactDetails} />

                <Route path="/vendor/list" exact strict component={ListOfEntities} />
                <Route path="/vendor/category" exact strict component={Category} />

                <Route path="/vendor/category/:vendorID" exact strict component={Category} />
                <Route path="/vendor/location-type" exact strict component={LocationType} />
                <Route path="/vendor/location-type/:locationTypeID" exact strict component={LocationType} />

                {/* Vehicle Master */}
                <Route path="/vehicle-master" exact strict component={VehicleMaster} />
                <Route path="/vehicle-master/:vehicleID" exact strict component={VehicleMaster} />
                <Route path="/vehicle-list" exact strict component={ListOfVehicles} />

                {/* access-management */}
                <Route path="/access-management" exact strict component={AccessManagement} />
            </Switch>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        recentCartData: state.recentCartData
    }
}
const mapDispachToProps = (dispatch) => {
    return bindActionCreators({ fetchRoleWiseAccess: getRoleWiseAccess }, dispatch);
}
export default connect(mapStateToProps, mapDispachToProps)(CoreAdminLayout);