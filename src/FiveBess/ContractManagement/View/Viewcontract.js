import React, { Component } from 'react';
import $ from 'jquery';
import CKEditor from "react-ckeditor-component";
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import _ from 'underscore';
import 'bootstrap/js/tab.js';
import 'react-phone-input-2/lib/style.css';
import moment from 'moment';

class Viewcontract extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "pathname": this.props.match.params.entity,
            "selectedCorporate": {},
            "selectedCorporateLocation": {},
            "selectedVendor": {},
            "selectedVendorLocation": {},
            "contractDetails": [],
            "attributeArray"            : [
                {
                    name : 'Extra Hrs',
                    field: 'extraHours',
                    type : 'number',
                    max  : 24
                }, 
                {
                    name : 'Extra Km',
                    field: 'extraKM',
                    type : 'number',
                    max  : 1000
                }, 
                {
                    name : 'Grace Hrs',
                    field: 'graceHours',
                    type : 'number',
                    max  : 24
                }, 
                {
                    name : 'Grace KM',
                    field: 'graceKM',
                    type : 'number',
                    max  : 1000
                },
                {
                    name : 'Driver Allowance',
                    field: 'driverAllowance',
                    type : 'number',
                    max  : 10000
                }, 
                {
                    name : 'Night Charges',
                    field: 'nightCharges',
                    type : 'number',
                    max  : 1000
                }, 
                {
                    name : 'Night Charges (From Time)',
                    field: 'nightChargesFromTime',
                    type : 'time',
                    max  : 24
                }, 
                {
                    name : 'Night Charges (ToTime)',
                    field: 'nightChargesToTime',
                    type : 'time',
                    max  : 24
                }, 
                {
                    name : 'Night Charges Day',
                    field: 'nightChargesDay',
                    type : 'text',
                    // max  : 10000000
                }, 
                {
                    name : 'Early Morning Charges',
                    field: 'earlyMorningCharges',
                    type : 'number',
                    max  : 10000
                }, 
                {
                    name : 'Early Morning Charges (FromTime)',
                    field: 'earlyMorningChargesFromTime',
                    type : 'time',
                    max  : 24
                }, 
                {
                    name : 'Early Morning Charges (ToTime)',
                    field: 'earlyMorningChargesToTime',
                    type : 'time',
                    max  : 24
                }],
        };

        this.handleChange = this.handleChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    componentDidMount() {
        this.getContract();
        this.setState({
            contractID: this.props.match.params.contractID
        }, () => {
            this.edit();
        })
        window.scrollTo(0, 0);
    }
    componentWillUnmount() {
        $("script[src='/js/adminLte.js']").remove();
        $("link[href='/css/dashboard.css']").remove();
    }
    handleChange(event) {
        event.preventDefault();
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: event.target.value
        });
    }
    handleOptionChange(event) {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: event.target.value
        });
    }
    submit(event) {
        event.preventDefault();
        var formValue = {
            contractID: this.props.match.params.contractID,
            conditions: this.state.content,
        }
        axios.patch("/api/contract/patch/addcondition", formValue)
            .then((response) => {
                swal("Terms & Condition added successfully.");
                this.props.history.push("/viewcontract/" + this.props.match.params.contractID);
            })
            .catch((error) => {

            })
    }
    componentWillReceiveProps(nextProps) {
        this.edit();
        this.handleChange = this.handleChange.bind(this);
    }
    edit() {
        var contractID = this.state.contractID;
        if (contractID) {
            axios.get('/api/contract/get/one/' + contractID)
                .then((response) => {
                    document.getElementById("submitbtn").innerHTML = "Update";
                    this.setState({
                        "contractID": this.props.match.params.contractID,
                        "content": response.data.content,
                    })
                })
                .catch((error) => {
                })
        }
    }

    getContract() {
        axios.get("/api/contract/get/joincontract/" + this.props.match.params.contractID)
            .then((response) => {
                
                var contractDetails = response.data[0];
                var vendorLocation = response.data[0].vendor.locations.filter((a, i)=>a._id == contractDetails.vendorLocationId);
                contractDetails.vendor.location = vendorLocation[0];

                var corporateLocation = response.data[0].corporate.locations.filter((a, i)=>a._id == contractDetails.corporateLocationId);
                contractDetails.corporate.location = corporateLocation[0];

                console.log('contractDetails', contractDetails);
                this.setState({
                    contractDetails: contractDetails
                })
            })
            .catch((error) => {

            })
    }
    delete() {

    }
    onChange(evt) {
        var newContent = evt.editor.getData();
        this.setState({
            content: newContent
        }, () => {
            if (this.state.content) {
                this.setState({
                    messageError: ''
                });
            } else {
                this.setState({
                    messageError: 'This field is required'
                });
            }
        });
    }
    render() {
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <section className="content">
                            <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                    <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Contract Management</h4>
                                </div>
                                <div className="nav-center OnboardingTabs col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                    <ul className="nav nav-pills vendorpills col-lg-10 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                        <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn1 disabled">
                                            <a href="" className="basic-info-pillss pills backcolor">
                                                <i className="fa fa-file" aria-hidden="true"></i> &nbsp;
                                                Contract
</a>
                                            <div className="trianglethree forActive" id="triangle-right"></div>
                                        </li>
                                        <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn1 disabled">
                                            <div className="triangletwo" id="triangle-right1"></div>
                                            <a href="" className="basic-info-pillss backcolor">
                                                <i className="fa fa-archive iconMarginLeft" aria-hidden="true"></i> &nbsp;
                                                Packages
</a>
                                            <div className="triangleone " id="triangle-right"></div>
                                        </li>

                                        <li className=" col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn1 disabled">
                                            <div className="triangletwo" id="triangle-right1"></div>
                                            <a href="" className="basic-info-pillss pills backcolor">
                                                <i className="fa fa-paste iconMarginLeft" aria-hidden="true"></i>&nbsp;
                                                Conditions
</a>
                                            <div className="triangleone" id="triangle-right"></div>
                                        </li>
                                        <li className="active col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab noRightPadding pdcls btn4 disabled">
                                            <div className="trianglesix" id="triangle-right2"></div>
                                            <a href="" className="basic-info-pillss backcolor">
                                                <i className="fa fa-eye iconMarginLeft" aria-hidden="true"></i> &nbsp;
                                                View
</a>
                                        </li>
                                    </ul>
                                </div>
                                <section className="Content">
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                    {
                                                        this.state.contractDetails.corporate ?
                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 detailBox marbtm30">
                                                                <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 detailBoxImg" style={{ "backgroundImage": `url(` + this.state.contractDetails.corporate.companyLogo + `)` }}></div>
                                                                <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                                                                    <h5 className="detailtitle">{this.state.contractDetails.corporate.companyName}</h5>
                                                                    <ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                        <li><i className="fa fa-user-o "></i> {this.state.contractDetails.corporate.groupName}</li>
                                                                        <li><i className="fa fa-globe"></i> {this.state.contractDetails.corporate.website}</li>
                                                                        <li><i className="fa fa-envelope "></i> {this.state.contractDetails.corporate.companyEmail}</li>
                                                                        <li>CIN: {this.state.contractDetails.corporate.CIN}</li>
                                                                        <li>TAN: {this.state.contractDetails.corporate.TAN}</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                    {
                                                        this.state.contractDetails.corporate && this.state.contractDetails.corporate.location ?
                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 detailBox">
                                                                <div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 mapIconMargin">
                                                                    <i className="fa fa-map-marker addressIcon"></i>
                                                                </div>
                                                                <div className="col-lg-6 col-md-1 col-sm-12 col-xs-12">
                                                                    <h4>Location Details</h4>
                                                                </div>
                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                    <ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                        <li> {this.state.contractDetails.corporate.location.locationType}</li>
                                                                        <li> {this.state.contractDetails.corporate.location.addressLine1}</li>
                                                                        <li> {this.state.contractDetails.corporate.location.addressLine2}</li>
                                                                        <li> {this.state.contractDetails.corporate.location.area} {this.state.contractDetails.corporate.location.city}</li>
                                                                        <li> {this.state.contractDetails.corporate.location.district} {this.state.contractDetails.corporate.location.state} {this.state.selectedCorporateLocation.country}</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                    {
                                                        this.state.contractDetails.vendor ?
                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 detailBox marbtm30">
                                                                <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 detailBoxImg" style={{ "backgroundImage": `url(` + this.state.contractDetails.vendor.companyLogo + `)` }}></div>
                                                                <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                                                                    <h5 className="detailtitle">{this.state.contractDetails.vendor.companyName}</h5>
                                                                    <ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                        <li><i className="fa fa-user-o "></i> {this.state.contractDetails.vendor.groupName}</li>
                                                                        <li><i className="fa fa-globe"></i> {this.state.contractDetails.vendor.website}</li>
                                                                        <li><i className="fa fa-envelope "></i> {this.state.contractDetails.vendor.companyEmail}</li>
                                                                        <li>CIN: {this.state.contractDetails.vendor.CIN}</li>
                                                                        <li>TAN: {this.state.contractDetails.vendor.TAN}</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                    {
                                                        this.state.contractDetails.vendor && this.state.contractDetails.vendor.location ?
                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 detailBox marbtm30">
                                                                <div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 mapIconMargin">
                                                                    <i className="fa fa-map-marker addressIcon"></i>
                                                                </div>
                                                                <div className="col-lg-6 col-md-1 col-sm-12 col-xs-12">
                                                                    <h4>Location Details</h4>
                                                                </div>
                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                    <ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                        <li> {this.state.contractDetails.vendor.location.locationType}</li>
                                                                        <li> {this.state.contractDetails.vendor.location.addressLine1}</li>
                                                                        <li> {this.state.contractDetails.vendor.location.addressLine2}</li>
                                                                        <li> {this.state.contractDetails.vendor.location.area} {this.state.contractDetails.vendor.location.city}</li>
                                                                        <li> {this.state.contractDetails.vendor.location.district} {this.state.contractDetails.vendor.location.state} {this.state.selectedVendorLocation.country}</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 NOpadding">
                                                        <h4 className="MasterBudgetTitle">Packages</h4>
                                                    </div>
													{this.state.contractDetails.packages && this.state.contractDetails.packages.length > 0 ?
														this.state.contractDetails.packages.map((data, index) => {
															return (
																<div key={index} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 detailBox marbtm30" key={index}>
																	<div className=" col-lg-1 col-md-1 col-sm-1 col-xs-1">
																		<i className="fa fa-database " aria-hidden="true"></i>
																	</div>
                                                                    <ul className="col-lg-11 col-md-11 col-sm-11 col-xs-11 palfclr">
																		<li><b>Package :</b> {data.packageName}</li>
																		<li>Max Hours : {data.MaxHrs}</li>
																		<li>Max KM : {data.MaxKm}</li>
																		<li>Fix Charges : {data.fixCharges}</li>
																	</ul>
                                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-sm-12">
                                                                        <table className="table ">
                                                                            <thead className="">
                                                                                <tr>
                                                                                    <th></th>
                                                                                    {
                                                                                        data.extras && data.extras.length > 0 ?
                                                                                            data.extras.map((a, i)=>{
                                                                                                return(
                                                                                                    <th key={i} className="textAlignRight">{a.category}</th>
                                                                                                );
                                                                                            })
                                                                                        :
                                                                                        null
                                                                                    }
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="packageList">
                                                                            {   this.state.attributeArray && this.state.attributeArray.length > 0 ?
                                                                                this.state.attributeArray.map((updata, index)=>{
                                                                                    return(
                                                                                        <tr key={index}>
                                                                                            <td>{updata.name}</td>
                                                                                            {
                                                                                                data.extras && data.extras.length > 0 ?
                                                                                                data.extras.map((datas, i)=>{
                                                                                                    return(
                                                                                                        Object.entries(datas).map(([key, value], j)=>{
                                                                                                            if(updata.field == key){
                                                                                                                return(
                                                                                                                    <td key={j} className="textAlignRight">{datas[updata.field]}</td>
                                                                                                                );
                                                                                                            }
                                                                                                        })
                                                                                                    );
                                                                                                })
                                                                                                :
                                                                                                null
                                                                                            }
                                                                                        </tr>
                                                                                    );
                                                                                })
                                                                                :
                                                                                null
                                                                            }
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
																</div>
															);
														})
														:
														<div className="textAlign">Contract will be shown here.</div>
													}
												</div>
                                                {
                                                    this.state.contractDetails.conditions ?
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 NOpadding">
                                                                <h4 className="MasterBudgetTitle">Terms & Condition</h4>
                                                            </div>
                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 detailBox marbtm30">
                                                                <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                                                    <i className="fa fa-file" aria-hidden="true"></i>
                                                                </div>
                                                                <ul className="col-lg-11 col-md-11 col-sm-11 col-xs-11 palfclr">
                                                                    <li dangerouslySetInnerHTML={{'__html' : this.state.contractDetails.conditions}}></li>
                                                                </ul>
                                                                
                                                            </div>
                                                    </div>
                                                    :
                                                    null
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        );
    }
}
export default Viewcontract;