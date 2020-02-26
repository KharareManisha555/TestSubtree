import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import _ from 'underscore';
import 'bootstrap/js/tab.js';
import 'react-phone-input-2/lib/style.css';
import moment from 'moment';
class Package extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "pathname"                  : this.props.match.params.entity,
            "openForm"                  : false,
            "selectedCorporate"         : {},
            "selectedCorporateLocation" : {},
            "selectedVendor"            : {},
            "selectedVendorLocation"    : {},
            "packageArray"              : [],
            "selectedPackages"          : [],
            "packageList"               : [],
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
            "endpoint"                  : "http://localhost:3066"
        };

        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    componentDidMount() {
        this.getPackages();
        this.getCategory();
        this.getPackageDetails();
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
    handleChange(event) {
        event.preventDefault();
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: event.target.value
        });
    }
    componentWillReceiveProps(nextProps) {
        this.edit();
        this.handleChange = this.handleChange.bind(this);
    }
    edit() {
        var contractID = this.props.match.params.contractID;
        var packageID  = this.props.match.params.packageID;
        if (contractID && packageID) {
            this.setState({
                "openForm"          : true,
            })
            axios.get('/api/contract/get/one/' + contractID)
            .then((response) => {
                document.getElementById("submitbtn").innerHTML = "Update";
                var packageDetail = (response.data.packages.filter((a, i)=>a._id == packageID))[0];
                this.state.packageArray.map((a, i)=>{
                    return document.getElementById(a._id).disabled= true;
                })
                var pac = this.state.packageArray.filter((b, i)=>b._id == packageDetail.packageId);
                this.setState({
                    
                    ["package-"+packageDetail.packageId] : true,
                    selectedPackages    : [{
                        packageID       : packageDetail.packageId,
                        packageName     : packageDetail.packageName,
                        maxHours        : packageDetail.MaxHrs,
                        maxKm           : packageDetail.MaxKm,
                    }]
                })
                packageDetail.extras.map((data, j)=>{
                    var categoryId = data.categoryId;
                    Object.entries(data).map(([key, value], i) => {
                        this.setState({
                            [key+"|"+categoryId] : value
                        })
                    })
                })
            })
            .catch((error) => {
            })
        }
    }
    getPackages(){
        axios.get("/api/packagemaster/get/list")
        .then((response)=>{
            this.setState({
                "packageArray" : response.data
            })
        })
        .catch((error)=>{

        })
    }
    getCategory(){
        axios.get("/api/categorymaster/get/list")
        .then((res)=>{
            this.setState({
                "categoryArray" : res.data
            })
        })
        .catch((error)=>{

        })
    }
    submit(event) {
        event.preventDefault();
        var extraDetail = [];
        var attributeArray = this.state.attributeArray;
        var categoryArray = this.state.categoryArray;
        for(var k=0; k<categoryArray.length; k++){
            extraDetail.push({
                category                    : categoryArray[k].category,
                categoryId                  : categoryArray[k]._id,
            });
            for(var j=0; j<attributeArray.length; j++){
                if(attributeArray[j].type == 'number'){
                    extraDetail[k][attributeArray[j].field]   = this.state[attributeArray[j].field+"|"+categoryArray[k]._id] ? this.state[attributeArray[j].field+"|"+categoryArray[k]._id] : 0;
                }else if(attributeArray[j].type == 'text'){
                    extraDetail[k][attributeArray[j].field]   = this.state[attributeArray[j].field+"|"+categoryArray[k]._id] ? this.state[attributeArray[j].field+"|"+categoryArray[k]._id] : 'NA';
                }else if(attributeArray[j].type == 'time'){
                    extraDetail[k][attributeArray[j].field]   = this.state[attributeArray[j].field+"|"+categoryArray[k]._id] ? this.state[attributeArray[j].field+"|"+categoryArray[k]._id] : '00:00 00';
                }
                
            }
        }
        var selectedPackages = this.state.selectedPackages;
        var packages = [];
        for(var i=0; i<selectedPackages.length; i++){
            packages.push({
                packageId       : selectedPackages[i].packageID,
                packageName     : selectedPackages[i].packageName,
                MaxHrs          : selectedPackages[i].maxHours,
                MaxKm           : selectedPackages[i].maxKm,
                fixCharges      : this.refs["fixCharges-"+selectedPackages[i].packageID].value
            })
            packages[i].extras = extraDetail;
        }
        var formValues = {
            contractID : this.props.match.params.contractID,
            packageID  : this.props.match.params.packageID,
            packages   : packages
        }
        if(this.props.match.params.packageID){
            axios.patch("/api/contract/patch/updatepackage", formValues)
            .then((response)=>{
                document.getElementById("submitbtn").innerHTML = "Submit";
                swal("Package details updated successfully.");
                $('input').val("");
                // this.props.history.push("/condition/"+this.props.match.params.contractID);
            })
            .catch((error)=>{

            })
        }else{
            axios.patch("/api/contract/patch/addpackage", formValues)
            .then((response)=>{
                swal("Package details added successfully.");
                $('input').val("");
                // this.props.history.push("/condition/"+this.props.match.params.contractID);
            })
            .catch((error)=>{

            })
        }
    }
    selectedPackages(event){
        var check = event.target.checked;
        var id = event.target.id;
        var value = event.target.value;
        var selectedPackages = this.state.selectedPackages;
        this.setState({
            [event.target.name] : this.state[event.target.name] ? false : true
        },()=>{
            if(check == true){
                selectedPackages.push({
                    packageID       : id,
                    packageName     : value.split("|")[0],
                    maxHours        : value.split("|")[1],
                    maxKm           : value.split("|")[2],
                });
            }else{
                var index = selectedPackages.findIndex(x => x.packageID == id);
                selectedPackages.splice(index, 1);
            }
        })
    }
    getPackageDetails(){
        axios.get("/api/contract/get/one/"+this.props.match.params.contractID)
        .then((response)=>{
            var packageIds = [];
            for(var i=0; i<response.data.packages.length; i++){
                packageIds.push(response.data.packages[i].packageId);
            }
            console.log('packageIds', packageIds);
            this.setState({
                packageIds  : packageIds,
                packageList : response.data.packages
            })
        })
        .catch((error)=>{

        })
    }
    delete(event){
        var contractID = this.props.match.params.contractID;
        var packageID = event.target.id;
        axios.delete("/api/contract/deletepackageincontract/"+contractID+"/"+packageID)
        .then((response)=>{
            swal("Contract deleted successfully.")
            this.getPackageDetails();
        })
        .catch((error)=>{

        })
    }
    back(event) {
		event.preventDefault();
		var contractID = this.props.match.params.contractID;
		
		if (this.state.openForm == true) {
			swal({
				// title: 'abc',
				text: "It seem that you are trying to add a package. Click 'Cancel' to continue adding package. Click 'Ok' to go to next page. But you may lose values if already entered in the package form.",
				buttons: {
					cancel: {
						text: "Cancel",
						value: false,
						visible: true,
						className: "CancelButtonSwal"
					},
					confirm: {
						text: "OK",
						value: true,
						visible: true,
						className: "OkButtonSwal",
						closeModal: true
					}
				},
			})
			.then((value) => {
				if(value){
					if(contractID){
                        this.props.history.push("/contract-management/"+contractID);
                    }else{
                        this.props.history.push("/contract-management");
                    }
				}else{
					this.props.history.push("/package-details/" + contractID);
				}
			})
			$(".OkButtonSwal").parents('.swal-button-container').addClass('postionSwalRight');
			$(".CancelButtonSwal").parents('.swal-button-container').addClass('postionSwalLeft');

		} else {
			if(contractID){
				this.props.history.push("/contract-management/"+contractID);
			}else{
				this.props.history.push("/contract-management");
			}
		}
    }
    next(event) {
		event.preventDefault();
		var contractID = this.props.match.params.contractID;
		if (this.state.openForm == true) {
			swal({
				// title: 'abc',
				text: "It seem that you are trying to add a package. Click 'Cancel' to continue adding package. Click 'Ok' to go to next page. But you may lose values if already entered in the package form.",
				buttons: {
					cancel: {
						text: "Cancel",
						value: false,
						visible: true,
						className: "CancelButtonSwal"
					},
					confirm: {
						text: "OK",
						value: true,
						visible: true,
						className: "OkButtonSwal",
						closeModal: true
					}
				},
			})
				.then((value) => {
					if(value){
						this.props.history.push("/condition/" + contractID);
					}else{
						this.props.history.push("/package-details/" + contractID);
					}
				})
			$(".OkButtonSwal").parents('.swal-button-container').addClass('postionSwalRight');
			$(".CancelButtonSwal").parents('.swal-button-container').addClass('postionSwalLeft');

		} else {
			this.props.history.push("/condition/" + contractID);
		}
    }
    openForm() {
		this.setState({
			openForm: this.state.openForm == false ? true : false
		})
	}
    render() {
        console.log('openform', this.state.openForm);
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <section className="content">
                            <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                    <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Contract Management</h4>
                                </div>
                                <div className="nav-center OnboardingTabs col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                    <ul className="nav nav-pills vendorpills col-lg-10 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                        <li className=" col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn1 disabled">
                                            <a href="" className="basic-info-pillss pills backcolor">
                                                <i className="fa fa-file" aria-hidden="true"></i> &nbsp;
                                                Contract
                                            </a>
                                            <div className="triangleone " id="triangle-right"></div>
                                        </li>
                                        <li className="active col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn2 ">
											<div className="triangletwo" id="triangle-right1"></div>
											<a href="" className="basic-info-pillss backcolor">
												<i className="fa fa-archive iconMarginLeft" aria-hidden="true"></i> &nbsp;
												Packages
											</a>
											<div className="trianglethree triangleones forActive" id="triangle-right"></div>
										</li>
                                        
                                        <li className=" col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn1 disabled">
                                            <div className="triangletwo" id="triangle-right1"></div>
                                            <a href="" className="basic-info-pillss pills backcolor">
                                                <i className="fa fa-paste iconMarginLeft" aria-hidden="true"></i> &nbsp;
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
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <div className="col-lg-6 col-md-6 col-sm-6 col-sm-6 locationTabs">
                                                    <h4 className="MasterBudgetTitle"><i className="fa fa-database" aria-hidden="true"></i> Package Details</h4>
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-6 col-sm-6 locationTabs">
                                                    <div className="button4  pull-right" onClick={this.openForm.bind(this)}>
                                                        <i className="fa fa-plus" aria-hidden="true"></i>&nbsp;Add Packages
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formHrTag"></div>
                                            </div>
                                            {
                                                this.state.openForm == true ?
                                                <form id="ContractManagement">
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 submitForm">
                                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                                            <br />
                                                        </div>
                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  NOpadding">
                                                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"paddingBottom" : "10px"}}>
                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Select Packages <sup className="astrick">*</sup></label>
                                                                    </div>
                                                                    {
                                                                        this.state.packageArray && this.state.packageArray.length > 0?
                                                                            this.state.packageArray.map((data, i)=>{
                                                                                return(
                                                                                    <div key={i} className="col-lg-4 col-md-4 col-sm-12 col-xs-12 packages">
                                                                                        <label className="checkLabel">
                                                                                            <input  type="checkbox" id={data._id} 
                                                                                                    value={data.packageName+"|"+data.maxHours+"|"+data.maxKm} 
                                                                                                    name={"package-"+data._id} 
                                                                                                    checked={this.state["package-"+data._id] ? true : false}
                                                                                                    onChange={this.selectedPackages.bind(this)} />

                                                                                            <span className="checkmark"></span>
                                                                                        </label>
                                                                                        <span>{data.packageName}</span> &nbsp;
                                                                                        <input  className="pull-right form-control" 
                                                                                                type="number"
                                                                                                style={{"width" : "60px", "height": "25px"}}   
                                                                                                ref={"fixCharges-"+data._id}
                                                                                                name={"fixCharges-"+data._id} 
                                                                                                value={this.state["fixCharges-"+data._id] ? this.state["fixCharges-"+data._id] : data.fixCharges} 
                                                                                                onKeyDown={(event)=>(event.target.value > 10000 ? (((event.which ? event.which : event.keyCode) != 8) ? (event.preventDefault(), true) : false) : true)}
                                                                                                onChange={this.handleChange.bind(this)} /> 
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        :
                                                                        null
                                                                    }
                                                                    
                                                                </div>
                                                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                <table className="table textAlignLeft">
                                                                    <thead>
                                                                        <tr>
                                                                            <th></th>
                                                                            {
                                                                                this.state.categoryArray && this.state.categoryArray.length > 0 ?
                                                                                    this.state.categoryArray.map((data, i)=>{
                                                                                        return(
                                                                                            <th key={i}>{data.category}</th>
                                                                                        );
                                                                                    })
                                                                                :
                                                                                null
                                                                            }
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {   this.state.attributeArray && this.state.attributeArray.length > 0 ?
                                                                            this.state.attributeArray.map((updata, index)=>{
                                                                                return(
                                                                                    <tr key={index}>
                                                                                        <td>{updata.name}</td>
                                                                                        {
                                                                                            this.state.categoryArray && this.state.categoryArray.length > 0 ?
                                                                                                this.state.categoryArray.map((data, i)=>{
                                                                                                    return(
                                                                                                        <td key={i}>
                                                                                                            <input  type={updata.type} 
                                                                                                                    value={this.state[updata.field+"|"+data._id]} 
                                                                                                                    name={updata.field+"|"+data._id} 
                                                                                                                    onChange={this.handleChange}
                                                                                                                    onKeyDown={updata.max ? ((event)=>(event.target.value > updata.max ? (((event.which ? event.which : event.keyCode) != 8) ? (event.preventDefault(), true) : false) : true)): ()=>{}}
                                                                                                                    max={updata.max}
                                                                                                                    min={0}
                                                                                                                    className="form-control" style={{"width" : "90px", "height": "25px", "display": "inline-block"}} />
                                                                                                        </td>
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
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                                                        <button id="submitbtn" className="btn button3 pull-right" onClick={this.submit.bind(this)} >Submit</button>
                                                    </div>
                                                </div>
                                            </form>
                                                :
                                                null
                                            }
                                            
                                        </div>
                                        
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <button className="button2 btn" onClick={this.back.bind(this)}><i className="fa fa-angle-double-left" aria-hidden="true"></i>&nbsp;Contract</button>
                                                <button className="button1 pull-right btn" onClick={this.next.bind(this)}>Next&nbsp;<i className="fa fa-angle-double-right" aria-hidden="true"></i></button>
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										{this.state.packageList && this.state.packageList.length > 0 ?
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 foothd">
													<h4 className="MasterBudgetTitle">Packages</h4>
												</div>
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
													{this.state.packageList && this.state.packageList.length > 0 ?
														this.state.packageList.map((data, index) => {
															return (
																<div key={index} className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12 boxul1" key={index}>
																	<div className="liheader1 col-lg-1 col-md-1 col-sm-1 col-xs-1">
																		<i className="fa fa-database " aria-hidden="true"></i>
																	</div>
                                                                    <ul className="col-lg-10 col-md-10 col-sm-10 col-xs-10 palfclr addrbox">
																		<li><b>Package :</b> {data.packageName}</li>
																		<li>Max Hours : {data.MaxHrs}</li>
																		<li>Max KM : {data.MaxKm}</li>
																		<li>Fix Charges : {data.fixCharges}</li>
																	</ul>
																	<div className="liheader1 dropdown col-lg-1 col-md-1 col-sm-1 col-xs-1">
																		<i className="fa fa-ellipsis-h dropbtn" aria-hidden="true"></i>
																		<div className="dropdown-content dropdown-contractLocation">
																			<ul className="pdcls ulbtm">
																				<li name={index}>
																					<a href={"/package-details/"+this.props.match.params.contractID+"/"+data._id}><i className="fa fa-pencil penmrleft" aria-hidden="true"></i>&nbsp;&nbsp;Edit</a>
																				</li>
																				<li name={index}>
																					<span onClick={this.delete.bind(this)} id={data._id}><i className="fa fa-trash-o" aria-hidden="true"></i> &nbsp; Delete</span>
																				</li>
																			</ul>
																		</div>
																	</div>
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
export default Package;