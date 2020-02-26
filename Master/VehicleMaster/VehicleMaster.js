import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import S3FileUpload from 'react-s3';
import _ from 'underscore';
import 'bootstrap/js/tab.js';
import './VehicleMaster.css';
import 'react-phone-input-2/lib/style.css';
import moment from 'moment';
class VehicleMaster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "pathname"          : this.props.match.params.entity,
            "RCDoc"             : [],
            "insuranceDoc"      : [],
            "permitDoc"         : [],
            "authorizationDoc"  : [],
            "PUCDoc"            : [],
            "categoryArray"     : [],
            "brandArray"        : [],
            "modelArray"        : [],
            "fuelTypeArray"     : []
        };

        this.handleChange = this.handleChange.bind(this);
        this.keyPress = this.keyPress.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    componentDidMount() {
        this.getVehicleCategory();
        this.getBrand();
        this.getModel();
        this.getFuelType();
        this.setState({
            vehicleID: this.props.match.params.vehicleID
        }, () => {
            this.edit();
        })
        window.scrollTo(0, 0);
        $.validator.addMethod("regxcategory", function (value, element, arg) {
            return arg !== value;
        }, "Please select the category");
        $.validator.addMethod("regxbrand", function (value, element, arg) {
            return arg !== value;
        }, "Please select the brand");
        $.validator.addMethod("regxmodel", function (value, element, arg) {
            return arg !== value;
        }, "Please select the model");
        $.validator.addMethod("regxA1", function (value, element, regexpr) {
            return regexpr.test(value);
        }, "Please enter valid capacity");
        $.validator.addMethod("regxfuelType", function (value, element, arg) {
            return arg !== value;
        }, "Please select the Fuel Type");
        $.validator.addMethod("regxownership", function (value, element, arg) {
            return arg !== value;
        }, "Please select the Owner");
        $.validator.addMethod("regxvehicleDriveType", function (value, element, arg) {
            return arg !== value;
        }, "Please select the Vehicle Drive Type");
        $.validator.addMethod("regxpermitType", function (value, element, arg) {
            return arg !== value;
        }, "Please select the Permit Type");
        $.validator.addMethod("regxA5", function (value, element, regexpr) {
            return regexpr.test(value);
        }, "Please enter valid Vehicle Number");

        jQuery.validator.setDefaults({
            debug: true,
            success: "valid"
        });
        $("#VehicleMaster").validate({
            rules: {
                category: {
                    required: true,
                    regxcategory: "--Select Vehicle Category--"
                },
                brand: {
                    required: true,
                    regxbrand: "--Select Brand--"
                },
                model: {
                    required: true,
                    regxmodel: "--Select Model--"
                },
                capacity: {
                    required: true,
                    regxA1: /^[0-9]/,
                },
                fuelType: {
                    required: true,
                    regxfuelType: "--Select Fuel Type--"
                },
                ownership: {
                    required: true,
                    regxownership: "--Select Owner--"
                },
                vehicleDriveType: {
                    required: true,
                    regxvehicleDriveType: "--Select Vehicle Drive Type--"
                },
                permitType: {
                    required: true,
                    regxpermitType: "--Select Permit Type--"
                },
                vehicleNumber: {
                    required: true,
                    regxA5: /^[A-Za-z][A-Za-z0-9\-\s]/,
                },
                registrationDate: {
                    required: true,
                },
                insuranceDate: {
                    required: true,
                },
                permitValidUpto: {
                    required: true,
                },
                authorizationUpto: {
                    required: true,
                },
                PUCValidUpto: {
                    required: true,
                },
            },
            errorPlacement: function (error, element) {
                if (element.attr("name") == "category") {
                    error.insertAfter("#category");
                }
                if (element.attr("name") == "brand") {
                    error.insertAfter("#brand");
                }
                if (element.attr("name") == "model") {
                    error.insertAfter("#model");
                }
                if (element.attr("name") == "capacity") {
                    error.insertAfter("#capacity");
                }
                if (element.attr("name") == "fuelType") {
                    error.insertAfter("#fuelType");
                }
                if (element.attr("name") == "ownership") {
                    error.insertAfter("#ownership");
                }
                if (element.attr("name") == "vehicleDriveType") {
                    error.insertAfter("#vehicleDriveType");
                }
                if (element.attr("name") == "permitType") {
                    error.insertAfter("#permitType");
                }
                if (element.attr("name") == "vehicleNumber") {
                    error.insertAfter("#vehicleNumber");
                }
                if (element.attr("name") == "registrationDate") {
                    error.insertAfter("#registrationDate");
                }
                if (element.attr("name") == "insuranceDate") {
                    error.insertAfter("#insuranceDate");
                }
                if (element.attr("name") == "permitValidUpto") {
                    error.insertAfter("#permitValidUpto");
                }
                if (element.attr("name") == "authorizationUpto") {
                    error.insertAfter("#authorizationUpto");
                }
                if (element.attr("name") == "PUCValidUpto") {
                    error.insertAfter("#PUCValidUpto");
                }
            }
        });
    }
    componentWillUnmount() {
        $("script[src='/js/adminLte.js']").remove();
        $("link[href='/css/dashboard.css']").remove();
    }
    getUploadFileAttachPercentage() {
        var uploadProgressPercent = localStorage.getItem("uploadUserImageProgressPercent");
        if (uploadProgressPercent) {
            var percentVal = parseInt(uploadProgressPercent);
            if (percentVal) {
                var styleC = {
                    width: percentVal + "%",
                    display: "block",
                    height: "8px",
                }
                var styleCBar = {
                    display: "block",
                    marginTop: 10,
                    height: "8px",
                }
            }
            if (!percentVal) {
                var percentVal = 0;

                var styleC = {
                    width: 0 + "%",
                    display: "none",
                    height: "8px",
                }
                var styleCBar = {
                    display: "none",
                    marginTop: 10,
                    height: "8px",
                }

            }
            if (percentVal == 100) {
                var percentVal = 0;

                var styleC = {
                    width: 0 + "%",
                    display: "none",
                    height: "8px",
                }
                var styleCBar = {
                    display: "none",
                    marginTop: 10,
                    height: "8px",
                }

            }
            return (
                <div>
                    <div className="progress col-lg-12" style={styleCBar}>
                        <div className="progress-bar progress-bar-striped active" role="progressbar"
                            aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={styleC}>
                        </div>
                    </div>
                </div>
            );
        }
    }
    getUploadLogoPercentage() {
        var uploadProgressPercent = localStorage.getItem("imageprogress");
        if (uploadProgressPercent) {
            var percentVal = parseInt(uploadProgressPercent);
            if (percentVal) {
                var styleC = {
                    width: percentVal + "%",
                    display: "block",
                    height: "8px",
                }
                var styleCBar = {
                    display: "block",
                    marginTop: 10,
                    height: "8px",
                    padding: "0px",
                }
            }
            if (!percentVal) {
                var percentVal = 0;

                var styleC = {
                    width: 0 + "%",
                    display: "none",
                    height: "8px",
                }
                var styleCBar = {
                    display: "none",
                    marginTop: 10,
                    height: "8px",
                    padding: "0px",
                }

            }
            if (percentVal == 100) {
                var percentVal = 0;

                var styleC = {
                    width: 0 + "%",
                    display: "none",
                    height: "8px",
                }
                var styleCBar = {
                    display: "none",
                    marginTop: 10,
                    height: "8px",
                    padding: "0px",
                }

            }
            return (
                <div>
                    <div className="progress col-lg-12" style={styleCBar}>
                        <div className="progress-bar progress-bar-striped active" role="progressbar"
                            aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={styleC}>
                        </div>
                    </div>
                </div>
            );
        }
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
        if ($('#VehicleMaster').valid()) {
            var formValues = {
                "vehicleID"                 : this.props.match.params.vehicleID,
                "categoryId"                : this.state.category.split('|')[0],
                "category"                  : this.state.category.split('|')[1],  
                "brandId"                   : this.state.brand.split('|')[0],
                "brand"                     : this.state.brand.split('|')[1],
                "modelId"                   : this.state.model.split('|')[0], 
                "model"                     : this.state.model.split('|')[1],
                "capacity"                  : this.state.capacity,  
                "fuelTypeId"                : this.state.fuelType.split('|')[0], 
                "fuelType"                  : this.state.fuelType.split('|')[1],
                "vehicleDriveType"          : this.state.vehicleDriveType,  
                "ownership"                 : this.state.ownership,  
                "vehicleNumber"             : this.state.vehicleNumber,
                "registrationDate"          : this.state.registrationDate,   
                "RCDoc"                     : this.state.RCDoc,
                "insuranceDate"             : this.state.insuranceDate,  
                "insuranceDoc"              : this.state.insuranceDoc,
                "permitType"                : this.state.permitType,
                "permitValidUpto"           : this.state.permitValidUpto,  
                "permitDoc"                 : this.state.permitDoc,
                "authorizationUpto"         : this.state.authorizationUpto,
                "authorizationDoc"          : this.state.authorizationDoc,
                "PUCValidUpto"              : this.state.PUCValidUpto,
                "PUCDoc"                    : this.state.PUCDoc,
                "createdBy"                 : localStorage.getItem("user_ID")
            }
            if (this.props.match.params.vehicleID) {
                axios.patch('/api/vehiclemaster/patch', formValues)
                .then((response) => {
                    this.setState({
                        "vehicleID"                 : "",
                        "categoryId"                : "",
                        "category"                  : "",
                        "brandId"                   : "",
                        "brand"                     : "",
                        "modelId"                   : "",
                        "model"                     : "",
                        "capacity"                  : "",
                        "fuelTypeId"                : "",
                        "fuelType"                  : "",
                        "vehicleDriveType"          : "",
                        "ownership"                 : "",
                        "vehicleNumber"             : "",
                        "registrationDate"          : "",
                        "RCDoc"                     : [],
                        "insuranceDate"             : "",
                        "insuranceDoc"              : [],
                        "permitType"                : "",
                        "permitValidUpto"           : "", 
                        "permitDoc"                 : [],
                        "authorizationUpto"         : "",
                        "authorizationDoc"          : [],
                        "PUCValidUpto"              : "",
                        "PUCDoc"                    : [],
                    })
                    swal("Vehicle details updated successfully.");
                    document.getElementById("submitbtn").innerHTML = "Submit";
                    this.props.history.push('/vehicle-master');
                })
                .catch((error) => {

                })
            } else {
                axios.post('/api/vehiclemaster/post', formValues)
                .then((response) => {
                    this.setState({
                        "vehicleID"                 : "",
                        "categoryId"                : "",
                        "category"                  : "",
                        "brandId"                   : "",
                        "brand"                     : "",
                        "modelId"                   : "",
                        "model"                     : "",
                        "capacity"                  : "",
                        "fuelTypeId"                : "",
                        "fuelType"                  : "",
                        "vehicleDriveType"          : "",
                        "ownership"                 : "",
                        "vehicleNumber"             : "",
                        "registrationDate"          : "",
                        "RCDoc"                     : [],
                        "insuranceDate"             : "",
                        "insuranceDoc"              : [],
                        "permitType"                : "",
                        "permitValidUpto"           : "", 
                        "permitDoc"                 : [],
                        "authorizationUpto"         : "",
                        "authorizationDoc"          : [],
                        "PUCValidUpto"              : "",
                        "PUCDoc"                    : [],
                    })
                    swal("Vehicle details created successfully.");
                })
                .catch((error) => {

                })
            }
        } else {
            $(event.target).parent().parent().find('.inputText.error:first').focus();
        }

    }
    docBrowse(event) {
        event.preventDefault();
        var name = event.target.name
        var docBrowse = [];
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            for (var i = 0; i < event.currentTarget.files.length; i++) {
                var file = event.currentTarget.files[i];

                if (file) {
                    var fileName = file.name;
                    var ext = fileName.split('.').pop();
                    if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "pdf" || ext === "JPG" || ext === "PNG" || ext === "JPEG" || ext === "PDF") {
                        if (file) {
                            var objTitle = { fileInfo: file }
                            docBrowse.push(objTitle);

                        } else {
                            swal("Files not uploaded");
                        }//file
                    } else {
                        swal("Allowed images formats are (jpg,png,jpeg, pdf)");
                    }//file types
                }//file
            }//for 

            if (event.currentTarget.files) {
                main().then(formValues => {
                    var docBrowse = this.state[name];
                    for (var k = 0; k < formValues.length; k++) {
                        docBrowse.push(formValues[k].docBrowse)
                    }

                    this.setState({
                        [name]: docBrowse
                    },()=>{
                    })
                });

                async function main() {
                    var formValues = [];
                    for (var j = 0; j < docBrowse.length; j++) {
                        var config = await getConfig();
                        var s3url = await s3upload(docBrowse[j].fileInfo, config, this);
                        const formValue = {
                            "docBrowse": s3url,
                            "status": "New"
                        };
                        formValues.push(formValue);
                    }
                    return Promise.resolve(formValues);
                }


                function s3upload(image, configuration) {

                    return new Promise(function (resolve, reject) {
                        S3FileUpload
                            .uploadFile(image, configuration)
                            .then((Data) => {
                                resolve(Data.location);
                            })
                            .catch((error) => {
                            })
                    })
                }
                function getConfig() {
                    return new Promise(function (resolve, reject) {
                        axios
                            .get('/api/projectsettings/get/S3')
                            .then((response) => {
                                const config = {
                                    bucketName: response.data.bucket,
                                    dirName: 'propertiesImages',
                                    region: response.data.region,
                                    accessKeyId: response.data.key,
                                    secretAccessKey: response.data.secret,
                                }
                                resolve(config);
                            })
                            .catch(function (error) {
                            })

                    })
                }
            }
        }
    }
    keyPressWeb = (e) => {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190, 110]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode === 190 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode === 110 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode === 189 || e.keyCode === 32) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 90)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    }
    keyPress = (e) => {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode === 189 || e.keyCode === 32) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if (((e.keyCode < 48 || e.keyCode > 90)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode === 190 || e.keyCode === 46)) {
            e.preventDefault();
        }
    }
    keyPressNumber = (e) => {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 189]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode === 189 || e.keyCode === 32) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 58)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode === 190 || e.keyCode === 46)) {
            e.preventDefault();
        }
    }
    componentWillReceiveProps(nextProps) {
        this.edit();
        this.handleChange = this.handleChange.bind(this);
    }
    admin(event) {
        event.preventDefault();
        this.props.history.push('/adminDashboard');
    }
    edit() {
        var vehicleID = this.state.vehicleID;
        if (vehicleID != '') {
            
            axios.get('/api/vehiclemaster/get/one/' + vehicleID)
            .then((response) => {
                document.getElementById("submitbtn").innerHTML = "Update";
                this.setState({
                    "vehicleID"                 : this.props.match.params.vehicleID,
                    "category"                  : response.data.categoryId+"|"+response.data.category,  
                    "brand"                     : response.data.brandId+"|"+response.data.brand,
                    "model"                     : response.data.modelId+"|"+response.data.model,
                    "capacity"                  : response.data.capacity,  
                    "fuelType"                  : response.data.fuelTypeId+"|"+response.data.fuelType,
                    "vehicleDriveType"          : response.data.vehicleDriveType,  
                    "ownership"                 : response.data.ownership,  
                    "vehicleNumber"             : response.data.vehicleNumber,
                    "registrationDate"          : moment(response.data.registrationDate).format("YYYY-MM-DD"),
                    "RCDoc"                     : response.data.RCDoc,
                    "insuranceDate"             : moment(response.data.insuranceDate).format("YYYY-MM-DD"),  
                    "insuranceDoc"              : response.data.insuranceDoc,
                    "permitType"                : response.data.permitType,
                    "permitValidUpto"           : moment(response.data.permitValidUpto).format("YYYY-MM-DD"),  
                    "permitDoc"                 : response.data.permitDoc,
                    "authorizationUpto"         : moment(response.data.authorizationUpto).format("YYYY-MM-DD"),
                    "authorizationDoc"          : response.data.authorizationDoc,
                    "PUCValidUpto"              : moment(response.data.PUCValidUpto).format("YYYY-MM-DD"),
                    "PUCDoc"                    : response.data.PUCDoc,
                })
            })
            .catch((error) => {
            })
        }
    }
    deleteDoc(event) {
        event.preventDefault();
        var name = event.target.getAttribute("name");
        var deleteDoc = this.state[name];
        const index = deleteDoc.indexOf(event.target.getAttribute("id"));
        if (index > -1) {
            deleteDoc.splice(index, 1);
        }
        this.setState({
            [name]: deleteDoc
        })
    }
    getVehicleCategory(){
        axios.get('/api/categorymaster/get/list')
		.then((response) => {
			this.setState({
				categoryArray: response.data
			})
		})
		.catch((error) => {
			
		})
    }
    getBrand(){
        axios.get('/api/brandmaster/get/list')
		.then((response) => {
			this.setState({
				brandArray: response.data
			})
		})
		.catch((error) => {
			
		})
    }
    getModel(){
        axios.get('/api/modelmaster/get/list')
		.then((response) => {
			this.setState({
				modelArray: response.data
			})
		})
		.catch((error) => {
			
		})
    }
    getFuelType(){
        axios.get('/api/fueltypemaster/get/list')
		.then((response) => {
			this.setState({
				fuelTypeArray: response.data
			})
		})
		.catch((error) => {
			
		})
    }
    render() {
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
                        <section className="content">
                            <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                    <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Vehicle Master</h4>
                                </div>
                                <section className="Content">
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <form id="VehicleMaster">
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 submitForm">
                                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                                            <br />
                                                        </div>
                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls NOpadding">
                                                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" >
                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Vehicle Category <sup className="astrick">*</sup></label>
                                                                        <select id="category" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.category} ref="category" name="category" onChange={this.handleChange}>
                                                                            <option>--Select Vehicle Category--</option>
                                                                            {
                                                                                this.state.categoryArray && this.state.categoryArray.length > 0 ?
                                                                                    this.state.categoryArray.map((data, i)=>{
                                                                                        return(
                                                                                            <option key={i} value={data._id+"|"+data.category}>{data.category}</option>
                                                                                        );
                                                                                    })
                                                                                :
                                                                                null
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" >
                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Brand <sup className="astrick">*</sup></label>
                                                                        <select id="brand" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.brand} ref="brand" name="brand" onChange={this.handleChange}>
                                                                            <option>--Select Brand--</option>
                                                                            {
                                                                                this.state.brandArray && this.state.brandArray.length > 0 ?
                                                                                    this.state.brandArray.map((data, i)=>{
                                                                                        return(
                                                                                            <option key={i} value={data._id+"|"+data.brand}>{data.brand}</option>
                                                                                        );
                                                                                    })
                                                                                :
                                                                                null
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" >
                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Model <sup className="astrick">*</sup></label>
                                                                        <select id="model" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.model} ref="model" name="model" onChange={this.handleChange}>
                                                                            <option>--Select Model--</option>
                                                                            {
                                                                                this.state.modelArray && this.state.modelArray.length > 0 ?
                                                                                    this.state.modelArray.map((data, i)=>{
                                                                                        return(
                                                                                            <option key={i} value={data._id+"|"+data.model}>{data.model}</option>
                                                                                        );
                                                                                    })
                                                                                :
                                                                                null
                                                                            }
                                                                            <option value="5e31730c71c2006931010cdc|S1">S1</option>
                                                                            <option value="5e31730c71c2006931010cdc|F2">F2</option>
                                                                            <option value="5e31730c71c2006931010cdc|Other">Other</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                    <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Capacity <i className="astrick">*</i></label>
                                                                        <input type="text" id="capacity" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.capacity} ref="capacity" name="capacity" onChange={this.handleChange} />
                                                                    </div>
                                                                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" >
                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Fuel Type <sup className="astrick">*</sup></label>
                                                                        <select id="fuelType" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.fuelType} ref="fuelType" name="fuelType" onChange={this.handleChange}>
                                                                            <option>--Select Fuel Type--</option>
                                                                            {
                                                                                this.state.fuelTypeArray && this.state.fuelTypeArray.length > 0 ?
                                                                                    this.state.fuelTypeArray.map((data, i)=>{
                                                                                        return(
                                                                                            <option key={i} value={data._id+"|"+data.fuelType}>{data.fuelType}</option>
                                                                                        );
                                                                                    })
                                                                                :
                                                                                null
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" >
                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Vehicle Drive Type <sup className="astrick">*</sup></label>
                                                                        <select id="vehicleDriveType" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.vehicleDriveType} ref="vehicleDriveType" name="vehicleDriveType" onChange={this.handleChange}>
                                                                            <option>--Select Vehicle Drive Type--</option>
                                                                            <option value="Private">Private</option>
                                                                            <option value="Commercial">Commercial</option>
                                                                            <option value="Self Drive">Self Drive</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                    <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Vehicle Number <i className="astrick">*</i></label>
                                                                        <input type="text" id="vehicleNumber" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.vehicleNumber} ref="vehicleNumber" name="vehicleNumber" onChange={this.handleChange} required />
                                                                    </div>
                                                                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" >
                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Ownership<sup className="astrick">*</sup></label>
                                                                        <select id="ownership" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.ownership} ref="ownership" name="ownership" onChange={this.handleChange}>
                                                                            <option>--Select Owner--</option>
                                                                            <option >Own</option>
                                                                            <option >Supplier</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" >
                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Permit Type<sup className="astrick">*</sup></label>
                                                                        <select id="permitType" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.permitType} ref="permitType" name="permitType" onChange={this.handleChange}>
                                                                            <option>--Select Permit Type--</option>
                                                                            <option >All India</option>
                                                                            <option >State</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                    <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Registration Date <i className="astrick">*</i></label>
                                                                        <input type="date" max={moment(new Date).format("YYYY-MM-DD")} id="registrationDate" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.registrationDate} ref="registrationDate" name="registrationDate" onChange={this.handleChange} required />
                                                                    </div>
                                                                </div>
                                                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                            <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Add RC Document (jpg, jpeg, png, pdf)</label>
                                                                        </div>
                                                                        <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 ">
                                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                                                                    <div><i className="fa fa-camera"></i> <br /><p>ADD DOCUMENT</p></div>
                                                                                    <input multiple onChange={this.docBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="RCDoc" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {
                                                                            this.state.RCDoc && this.state.RCDoc.length > 0 ?
                                                                                this.state.RCDoc.map((logo, i) => {
                                                                                    return (
                                                                                        <div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                                                                <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" id={logo} name="RCDoc" onClick={this.deleteDoc.bind(this)}>x</label>
                                                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                                                                                    <img src={logo} className="img-responsive logoStyle" />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })
                                                                                :
                                                                                null
                                                                        }
                                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                            <div className="border col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                </div>                                                                
                                                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                                                                    <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Insurance Valid Upto <i className="astrick">*</i></label>
                                                                        <input type="date" min={moment(new Date).format("YYYY-MM-DD")} id="insuranceDate" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.insuranceDate} ref="insuranceDate" name="insuranceDate" onChange={this.handleChange} required />
                                                                    </div>
                                                                </div>
                                                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                        <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                            <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Add Insurance Document (jpg, jpeg, png, pdf)</label>
                                                                        </div>
                                                                        <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                                                                    <div><i className="fa fa-camera"></i> <br /><p>ADD DOCUMENT</p></div>
                                                                                    <input multiple onChange={this.docBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="insuranceDoc" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {
                                                                            this.state.insuranceDoc && this.state.insuranceDoc.length > 0 ?
                                                                                this.state.insuranceDoc.map((logo, i) => {
                                                                                    return (
                                                                                        <div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12 ">
                                                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                                                                <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" id={logo} name="insuranceDoc" onClick={this.deleteDoc.bind(this)}>x</label>
                                                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                                                                                    <img src={logo} className="img-responsive logoStyle" />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })
                                                                                :
                                                                                null
                                                                        }
                                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                            <div className="border col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                    <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Permit Valid Upto <i className="astrick">*</i></label>
                                                                        <input type="date" min={moment(new Date).format("YYYY-MM-DD")} id="permitValidUpto" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.permitValidUpto} ref="permitValidUpto" name="permitValidUpto" onChange={this.handleChange} required />
                                                                    </div>
                                                                </div>
                                                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                        <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                            <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Add Permit Document (jpg, jpeg, png, pdf)</label>
                                                                        </div>
                                                                        <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                                                                    <div><i className="fa fa-camera"></i> <br /><p>ADD DOCUMENT</p></div>
                                                                                    <input multiple onChange={this.docBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="permitDoc" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {
                                                                            this.state.permitDoc && this.state.permitDoc.length > 0 ?
                                                                                this.state.permitDoc.map((logo, i) => {
                                                                                    return (
                                                                                        <div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                                                                <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" id={logo} name="permitDoc" onClick={this.deleteDoc.bind(this)}>x</label>
                                                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                                                                                    <img src={logo} className="img-responsive logoStyle" />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })
                                                                                :
                                                                                null
                                                                        }
                                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                            <div className="border col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                    <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Authorization Upto <i className="astrick">*</i></label>
                                                                        <input type="date" min={moment(new Date).format("YYYY-MM-DD")} id="authorizationUpto" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.authorizationUpto} ref="authorizationUpto" name="authorizationUpto" onChange={this.handleChange} required />
                                                                    </div>
                                                                </div>
                                                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                        <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                            <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Add Authorization Document (jpg, jpeg, png, pdf)</label>
                                                                        </div>
                                                                        <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                                                                    <div><i className="fa fa-camera"></i> <br /><p>ADD DOCUMENT</p></div>
                                                                                    <input multiple onChange={this.docBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="authorizationDoc" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {
                                                                            this.state.authorizationDoc && this.state.authorizationDoc.length > 0 ?
                                                                                this.state.authorizationDoc.map((logo, i) => {
                                                                                    return (
                                                                                        <div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12 ">
                                                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                                                                <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" id={logo} name="authorizationDoc" onClick={this.deleteDoc.bind(this)}>x</label>
                                                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                                                                                    <img src={logo} className="img-responsive logoStyle" />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })
                                                                                :
                                                                                null
                                                                        }
                                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                            <div className="border col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                    <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">PUC Valid Upto <i className="astrick">*</i></label>
                                                                        <input type="date" min={moment(new Date).format("YYYY-MM-DD")} id="PUCValidUpto" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.PUCValidUpto} ref="PUCValidUpto" name="PUCValidUpto" onChange={this.handleChange} required />
                                                                    </div>
                                                                </div>
                                                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                        <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                            <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Add PUC Document (jpg, jpeg, png, pdf)</label>
                                                                        </div>
                                                                        <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                                                                    <div><i className="fa fa-camera"></i> <br /><p>ADD DOCUMENT</p></div>
                                                                                    <input multiple onChange={this.docBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="PUCDoc" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {
                                                                            this.state.PUCDoc && this.state.PUCDoc.length > 0 ?
                                                                                this.state.PUCDoc.map((logo, i) => {
                                                                                    return (
                                                                                        <div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                                                                <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" id={logo} name="PUCDoc" onClick={this.deleteDoc.bind(this)}>x</label>
                                                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                                                                                    <img src={logo} className="img-responsive logoStyle" />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })
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
                                                            <button id="submitbtn" className="btn button3 pull-right" onClick={this.submit.bind(this)} >Submit</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
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
export default VehicleMaster;