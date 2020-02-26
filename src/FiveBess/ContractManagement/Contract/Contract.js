import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import _ from 'underscore';
import 'bootstrap/js/tab.js';
import './Contract.css';
import 'react-phone-input-2/lib/style.css';
import moment from 'moment';
import { stat } from 'fs';
// import socketIOClient from "socket.io-client";
// const io = require('socket.io-client')

// const socket = io.connect(process.env.REACT_APP_BASE_URL)

class ContractManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "pathname"                  : this.props.match.params.entity,
            "selectedCorporate"         : {},
            "selectedCorporateLocation" : {},
            "selectedVendor"            : {},
            "selectedVendorLocation"    : {},
            "contractArray"             : [],
            "endpoint"                  : "http://localhost:3066"
        };

        this.handleChange = this.handleChange.bind(this);
        this.getCorpLocation = this.getCorpLocation.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    componentDidMount() {
        // ============= Socket Programming ===============
        // const { endpoint } = this.state;
        // const socket = socketIOClient(endpoint);
        // socket.on("FromAPI", data => this.setState({ response: data }));


        this.getCorporate();
        this.getVendor();
        this.getContract();
        this.setState({
            contractID: this.props.match.params.contractID
        }, () => {
            this.edit();
        })
        window.scrollTo(0, 0);
        $.validator.addMethod("regxcorporate", function (value, element, arg) {
            return arg !== value;
        }, "Please select the corporate");
        $.validator.addMethod("regxcorporateLocation", function (value, element, arg) {
            return arg !== value;
        }, "Please select the corporate location");
        $.validator.addMethod("regxvendor", function (value, element, arg) {
            return arg !== value;
        }, "Please select the vendor");
        $.validator.addMethod("regxvendorLocation", function (value, element, arg) {
            return arg !== value;
        }, "Please select the vendor location");

        jQuery.validator.setDefaults({
            debug: true,
            success: "valid"
        });
        $("#ContractManagement").validate({
            rules: {
                corporate: {
                    required: true,
                    regxcorporate: "--Select Corporate--"
                },
                corporateLocation: {
                    required: true,
                    regxcorporateLocation: "--Select Corporate Location--"
                },
                vendor: {
                    required: true,
                    regxvendor: "--Select Vendor--"
                },
                vendorLocation: {
                    required: true,
                    regxvendorLocation: "--Select Vendor Location--"
                },
                contractDate: {
                    required: true
                },
                effectiveUpto: {
                    required: true
                }
            },
            errorPlacement: function (error, element) {
                if (element.attr("name") == "corporate") {
                    error.insertAfter("#corporate");
                }
                if (element.attr("name") == "corporateLocation") {
                    error.insertAfter("#corporateLocation");
                }
                if (element.attr("name") == "vendor") {
                    error.insertAfter("#vendor");
                }
                if (element.attr("name") == "vendorLocation") {
                    error.insertAfter("#vendorLocation");
                }
                if (element.attr("name") == "contractDate") {
                    error.insertAfter("#contractDate");
                }
                if (element.attr("name") == "effectiveUpto") {
                    error.insertAfter("#effectiveUpto");
                }
            }
        });
    }
    componentWillUnmount() {
        $("script[src='/js/adminLte.js']").remove();
        $("link[href='/css/dashboard.css']").remove();
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
        if ($('#ContractManagement').valid()) {
            var formValues = {
                "contractID"                  : this.props.match.params.contractID,
                "contractDate"                : this.state.contractDate,
                "effectiveUpto"               : this.state.effectiveUpto, 
                "corporateId"                 : this.state.corporate,
                "corporateLocationId"         : this.state.corporateLocation,
                "vendorId"                    : this.state.vendor,
                "vendorLocationId"            : this.state.vendorLocation,
            }
            if(this.props.match.params.contractID) {
                axios.patch('/api/contract/patch', formValues)
                .then((response) => {
                    this.setState({
                        "contractDate"                : "",
                        "effectiveUpto"               : "",
                        "corporateId"                 : "",
                        "corporateLocationId"         : "",
                        "vendorId"                    : "",
                        "vendorLocationId"            : "",
                    })
                    this.props.history.push("/package-details/"+this.props.match.params.contractID);
                    swal("Contract details updated successfully.");
                    document.getElementById("submitbtn").innerHTML = "Submit";
                })
                .catch((error) => {

                })
            }else{
                axios.post('/api/contract/post', formValues)
                .then((response) => {
                    this.setState({
                        "contractDate"                : "",
                        "effectiveUpto"               : "", 
                        "corporateId"                 : "",
                        "corporateLocationId"         : "",
                        "vendorId"                    : "",
                        "vendorLocationId"            : "",
                    })
                    this.props.history.push("/package-details/"+response.data.contractID);
                    swal("Contract details created successfully.");
                })
                .catch((error) => {

                })
            }
        } else {
            $(event.target).parent().parent().find('.inputText.error:first').focus();
        }

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
                this.getCorpLocation(response.data.corporateId, response.data.corporateLocationId)
                this.getVendorLocation(response.data.vendorId, response.data.vendorLocationId);

                document.getElementById("submitbtn").innerHTML = "Update";
                this.setState({
                    "contractID"                  : this.props.match.params.contractID,
                    "contractDate"                : moment(response.data.contractDate).format("YYYY-MM-DD"),
                    "effectiveUpto"               : moment(response.data.effectiveUpto).format("YYYY-MM-DD"), 
                    "corporate"                   : response.data.corporateId,
                    "corporateLocation"           : response.data.corporateLocationId,
                    "vendor"                      : response.data.vendorId,
                    "vendorLocation"              : response.data.vendorLocationId,
                })
                
            })
            .catch((error) => {
            })
        }
    }
    handleChange(event) {
        event.preventDefault();
        const target = event.target;
        const name = target.name;
        var value = event.target.value;
        this.setState({
            [name]: event.target.value
        },()=>{
            if(this.state[name] ==  this.state.corporate){
                this.getCorpLocation(value, '');
                this.setState({
                    corporateLocation : ''
                })
            }else if(this.state[name] == this.state.vendor){
                this.getVendorLocation(value, '');
                this.setState({
                    vendorLocation : ''
                })
            }else if(this.state[name] == this.state.corporateLocation && this.state.corporate){
                this.getCorpLocation(this.state.corporate, this.state.corporateLocation)
            }else if(this.state[name] == this.state.vendorLocation && this.state.vendor){
                this.getVendorLocation(this.state.vendor, this.state.vendorLocation);
            }
        });
    }
    getCorporate(){
        axios.get('/api/entitymaster/get/corporate')
		.then((response) => {
			this.setState({
				corporateArray: response.data
			})
		})
		.catch((error) => {
			
		})
    }
    getCorpLocation(corporateId, locationId){
        axios.get('/api/entitymaster/get/one/'+corporateId)
        .then((response)=>{
            this.setState({
                selectedCorporate:  response.data,
                corporateLocationArray: response.data.locations
            },()=>{
                if(this.state.corporateLocationArray && this.state.corporateLocationArray.length > 0){
                    var selectedCorporateLocation = this.state.corporateLocationArray.filter((a)=> a._id == locationId);
                    this.setState({
                        selectedCorporateLocation : selectedCorporateLocation[0]
                    })
                }else{
                    this.setState({
                        selectedCorporateLocation : []
                    })
                }
            })
        })
        .catch((error)=>{

        })
    }
    getVendor(){
        axios.get('/api/entitymaster/get/vendor')
		.then((response) => {
			this.setState({
				vendorArray: response.data
			})
		})
		.catch((error) => {
			
		})
    }
    getVendorLocation(vendorId, vendorLocationId){
        axios.get('/api/entitymaster/get/one/'+vendorId)
        .then((response)=>{
            this.setState({
                selectedVendor : response.data,
                vendorLocationArray: response.data.locations
            },()=>{
                if(this.state.vendorLocationArray && this.state.vendorLocationArray.length>0){
                    var selectedVendorLocation = this.state.vendorLocationArray.filter((a)=> a._id == vendorLocationId);
                    console.log('selectedVendorLocation', selectedVendorLocation);
                    this.setState({
                        selectedVendorLocation : selectedVendorLocation[0]
                    })
                }else{
                    this.setState({
                        selectedVendorLocation : []
                    })
                }
            })
        })
        .catch((error)=>{

        })
    }
    getContract(){
        axios.get("/api/contract/get/joincontractlist")
        .then((response)=>{
            console.log('contractArray', response.data);
            this.setState({
                contractArray : response.data
            })
        })
        .catch((error)=>{

        })
    }
    selectVendorLocation(id){
        
    }
    delete(event){
        var contractID = event.target.id;
        axios.delete("/api/contract/delete/"+contractID)
        .then((response)=>{
            this.getContract();
            swal("Contract deleted successfully.")
        })
        .catch((error)=>{

        })
    }
    render() {
        console.log('contractArray', this.state.contractArray)
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
                                        <li className="active col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn1 disabled">
                                            <a href="" className="basic-info-pillss pills backcolor">
                                                <i className="fa fa-file" aria-hidden="true"></i> &nbsp;
                                                Contract
                                            </a>
                                            <div className="trianglethree triangleones forActive" id="triangle-right"></div>
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
                                            <div className="triangleone " id="triangle-right"></div>
                                        </li>
                                        <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab noRightPadding pdcls btn4 disabled">
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
                                            <form id="ContractManagement">
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 submitForm">
                                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                                            <br />
                                                        </div>
                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  NOpadding">
                                                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12" >
                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Contract Date <sup className="astrick">*</sup></label>
                                                                        <input  className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" type="date" ref="contractDate" name="contractDate" id="contractDate" value={this.state.contractDate} onChange={this.handleChange} />
                                                                    </div>
                                                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12" >
                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Contract Valid Upto <sup className="astrick">*</sup></label>
                                                                        <input min={moment(new Date).format("YYYY-MM-DD")} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" type="date" ref="effectiveUpto" name="effectiveUpto" id="effectiveUpto" value={this.state.effectiveUpto} onChange={this.handleChange} />
                                                                    </div>
                                                                </div>
                                                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                    <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12" >
                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Corporate <sup className="astrick">*</sup></label>
                                                                        <select id="corporate" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.corporate} ref="corporate" name="corporate" onChange={this.handleChange.bind(this)}>
                                                                            <option>--Select Corporate--</option>
                                                                            {
                                                                                this.state.corporateArray && this.state.corporateArray.length > 0 ?
                                                                                    this.state.corporateArray.map((data, i)=>{
                                                                                        return(
                                                                                            <option key={i} value={data._id}>{data.companyName}</option>
                                                                                        );
                                                                                    })
                                                                                :
                                                                                null
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12" >
                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Corporate Location <sup className="astrick">*</sup></label>
                                                                        <select id="corporateLocation" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.corporateLocation} ref="corporateLocation" name="corporateLocation" onChange={this.handleChange.bind(this)}>
                                                                            <option>--Select Corporate Location--</option>
                                                                            {
                                                                                this.state.corporateLocationArray && this.state.corporateLocationArray.length > 0 ?
                                                                                    this.state.corporateLocationArray.map((data, i)=>{
                                                                                        return(
                                                                                            <option key={i} value={data._id}>{((data.locationType).match(/\b(\w)/g)).join('')} - {data.area} {data.city}, {data.stateCode} - {(data.countryCode)}  </option>
                                                                                        );
                                                                                    })
                                                                                :
                                                                                null
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12" >
                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Vendor <sup className="astrick">*</sup></label>
                                                                        <select id="vendor" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.vendor} ref="vendor" name="vendor" onChange={this.handleChange.bind(this)}>
                                                                            <option>--Select Vendor--</option>
                                                                            {
                                                                                this.state.vendorArray && this.state.vendorArray.length > 0 ?
                                                                                    this.state.vendorArray.map((data, i)=>{
                                                                                        return(
                                                                                            <option key={i} value={data._id}>{data.companyName}</option>
                                                                                        );
                                                                                    })
                                                                                :
                                                                                null
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12" >
                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Vendor Location <sup className="astrick">*</sup></label>
                                                                        <select id="vendorLocation" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.vendorLocation} ref="vendorLocation" name="vendorLocation" onChange={this.handleChange.bind(this)}>
                                                                            <option>--Select Vendor Location--</option>
                                                                            {
                                                                                this.state.vendorLocationArray && this.state.vendorLocationArray.length > 0 ?
                                                                                    this.state.vendorLocationArray.map((data, i)=>{
                                                                                        return(
                                                                                            <option key={i} value={data._id}>{((data.locationType).match(/\b(\w)/g)).join('')} - {data.area} {data.city}, {data.stateCode} - {data.countryCode}  </option>
                                                                                        );
                                                                                    })
                                                                                :
                                                                                null
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                                    {
                                                                        this.state.selectedCorporate.companyName ? 
                                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 detailBox marbtm30">
                                                                                <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 detailBoxImg" style={{"backgroundImage":`url(`+this.state.selectedCorporate.companyLogo +`)`}}></div>
                                                                                <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                                                                                    <h5 className="detailtitle">{this.state.selectedCorporate.companyName}</h5>
                                                                                    <ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                                        <li><i className="fa fa-user-o "></i> {this.state.selectedCorporate.groupName}</li>
                                                                                        <li><i className="fa fa-globe"></i> {this.state.selectedCorporate.website}</li>
                                                                                        <li><i className="fa fa-envelope "></i> {this.state.selectedCorporate.companyEmail}</li>
                                                                                        <li>CIN: {this.state.selectedCorporate.CIN}</li>
                                                                                        <li>TAN: {this.state.selectedCorporate.TAN}</li>
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                        :
                                                                        null
                                                                    }
                                                                    {
                                                                        this.state.selectedCorporateLocation && this.state.selectedCorporateLocation.locationType ? 
                                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 detailBox">
                                                                                <div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 mapIconMargin">
                                                                                    <i className="fa fa-map-marker addressIcon"></i>
                                                                                </div>
                                                                                <div className="col-lg-6 col-md-1 col-sm-12 col-xs-12">
                                                                                    <h4>Location Details</h4>
                                                                                </div>
                                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                                    <ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                                        <li> {this.state.selectedCorporateLocation.locationType}</li>
                                                                                        <li> {this.state.selectedCorporateLocation.addressLine1}</li>
                                                                                        <li> {this.state.selectedCorporateLocation.addressLine2}</li>
                                                                                        <li> {this.state.selectedCorporateLocation.area} {this.state.selectedCorporateLocation.city}</li>
                                                                                        <li> {this.state.selectedCorporateLocation.district} {this.state.selectedCorporateLocation.state} {this.state.selectedCorporateLocation.country}</li>
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                        :
                                                                        null
                                                                    }
                                                                    </div>
                                                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                                    {
                                                                        this.state.selectedVendor.companyName ? 
                                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 detailBox marbtm30">
                                                                                <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 detailBoxImg" style={{"backgroundImage":`url(`+this.state.selectedVendor.companyLogo+`)`}}></div>
                                                                                <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                                                                                    <h5 className="detailtitle">{this.state.selectedVendor.companyName}</h5>
                                                                                    <ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                                        <li><i className="fa fa-user-o "></i> {this.state.selectedVendor.groupName}</li>
                                                                                        <li><i className="fa fa-globe"></i> {this.state.selectedVendor.website}</li>
                                                                                        <li><i className="fa fa-envelope "></i> {this.state.selectedVendor.companyEmail}</li>
                                                                                        <li>CIN: {this.state.selectedVendor.CIN}</li>
                                                                                        <li>TAN: {this.state.selectedVendor.TAN}</li>
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                        :
                                                                        null
                                                                    }
                                                                    {
                                                                        this.state.selectedVendorLocation && this.state.selectedVendorLocation.locationType ? 
                                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 detailBox">
                                                                                <div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 mapIconMargin">
                                                                                    <i className="fa fa-map-marker addressIcon"></i>
                                                                                </div>
                                                                                <div className="col-lg-6 col-md-1 col-sm-12 col-xs-12">
                                                                                    <h4>Location Details</h4>
                                                                                </div>
                                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                                    <ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                                        <li> {this.state.selectedVendorLocation.locationType}</li>
                                                                                        <li> {this.state.selectedVendorLocation.addressLine1}</li>
                                                                                        <li> {this.state.selectedVendorLocation.addressLine2}</li>
                                                                                        <li> {this.state.selectedVendorLocation.area} {this.state.selectedVendorLocation.city}</li>
                                                                                        <li> {this.state.selectedVendorLocation.district} {this.state.selectedVendorLocation.state} {this.state.selectedVendorLocation.country}</li>
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                        :
                                                                        null
                                                                    }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                                                            <button id="submitbtn" className="btn button3 pull-right" onClick={this.submit.bind(this)} >Save & Next</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										{this.state.contractArray && this.state.contractArray.length > 0 ?
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 foothd">
													<h4 className="MasterBudgetTitle">Contract Details</h4>
												</div>
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
													{this.state.contractArray && this.state.contractArray.length > 0 ?
														this.state.contractArray.map((data, index) => {
															return (
																<div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-12 boxul1" key={index}>
																	<div className="liheader1 col-lg-1 col-md-1 col-sm-1 col-xs-1">
																		<i className="fa fa-handshake-o " aria-hidden="true"></i>
																	</div>
                                                                    <ul className="col-lg-10 col-md-10 col-sm-10 col-xs-10 palfclr addrbox">
																		<li><b>Corporate :</b> {data.corporate.companyName}</li>
																		<li>{data.corporate.website}</li>
																		<li>{data.corporate.companyEmail}</li>
                                                                        <br />
																		<li><b>Vendor :</b> {data.vendor.companyName}</li>
																		<li>{data.vendor.website}</li>
																		<li>{data.vendor.companyEmail}</li>
																	</ul>
																	<div className="liheader1 dropdown col-lg-1 col-md-1 col-sm-1 col-xs-1">
																		<i className="fa fa-ellipsis-h dropbtn" aria-hidden="true"></i>
																		<div className="dropdown-content dropdown-contractLocation">
																			<ul className="pdcls ulbtm">
																				<li name={index}>
																					<a href={"/contract-management/"+data._id}><i className="fa fa-pencil penmrleft" aria-hidden="true"></i>&nbsp;&nbsp;Edit</a>
																				</li>
																				<li name={index}>
																					<span onClick={this.delete.bind(this)} id={data._id}><i className="fa fa-trash-o" aria-hidden="true"></i> &nbsp; Delete</span>
																				</li>
																			</ul>
																		</div>
																	</div>
																</div>
															);
														})
														:
														<div className="textAlign">Contract will be shown here.</div>
													}
												</div>
											</div>
											:
											null
										}
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
export default ContractManagement;