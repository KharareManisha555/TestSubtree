import React, { Component }     from 'react';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import axios                    from 'axios';
import swal                     from 'sweetalert';
import S3FileUpload             from 'react-s3';
import moment                   from 'moment';
import PhoneInput               from 'react-phone-input-2';
import _                        from 'underscore';
import "./PersonMaster.css";

class PersonMaster extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      "pathname"         : this.props.match.params.type,
      "companyLogo"      : [],
      "districtArray"    : [],
      "designationArray" : [],
      "departmentArray"  : [],
      'toggleButtonValue': "Male",
      'country'          : "",
      "stateArray"       : [],
      "licenseProof"     : [],
      "panProof"         : [],
      "aadharProof"      : [],
      "voterIDProof"     : [],
      "profilePhoto"     : [],
      "passportProof"    : [],
      "COI"              : []

    };

    this.handleChange             = this.handleChange.bind(this);
    this.keyPress                 = this.keyPress.bind(this);
    this.handleOptionChange       = this.handleOptionChange.bind(this);
    this.submitPerson             = this.submitPerson.bind(this);
    this.camelCase                = this.camelCase.bind(this)
    this.handleChangeCountry      = this.handleChangeCountry.bind(this);
    this.handleChangeState        = this.handleChangeState.bind(this);
    this.handleChangeDesignation  = this.handleChangeDesignation.bind(this);
    this.handleChangeDepartment   = this.handleChangeDepartment.bind(this);

  }

  componentDidMount() {
    this.getDesignation();
    this.getDepartment();
    this.setState({
      personID: this.props.match.params.fieldID
    }, () => {
      this.edit();
    })
    if(this.state.pathname == "driver")
    {
      $(".person").hide();
      $(".driver").show();
    $.validator.addMethod("regxEmail", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid Email Id");
    $.validator.addMethod("regxLicenseNumber", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid License Number");
    $.validator.addMethod("regxAadharNumber", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid Aadhar Number");

    $.validator.addMethod("regxVoterId", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid Voter Id");

    $.validator.addMethod("regxPassport", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid Passport Number");
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
    $("#BasicInfo").validate({
      rules: {
     
        firstName: {
          required: true
        },
        middleName: {
          required: true
        },
        lastName: {
          required: true
        },
        DOB: {
          required: true
        },
        contactNumber: {
          required: true,
        },
        alternateNumber: {
          required: true,
        },
        email: {
          required: true,
          regxEmail :/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$|^$)/,
        },
        department: {
          required: true,
        },
        designation: {
          required: true,
        }, 
        addressLine1: {
          required: true,
        },
        addressLine2: {
          required: true,
        },
        landmark: {
          required: true,
        },
        country: {
          required: true,
        },
        states: {
          required: true,
        },
        district: {
          required: true,
        },
        area: {
          required: true,
        },
        city: {
          required: true,
        },
        pincode: {
          required: true,
        },
        licenseNumber: {
          required: true,
          regxLicenseNumber :/^[a-zA-Z]{2}[0-9]{13}$/,
        },
        effectiveUpto: {
          required: true,
        },
        panNumber: {
          required: true,
        },
        aadharNumber: {
          required: true,
          regxAadharNumber :/^[0-9]{12}$/,

        },
        voterId: {
          required: true,
          regxVoterId :/^[a-zA-Z]{3}[0-9]{7}$/,

        },
        passportNumber: {
          required: true,
          regxPassport :/^[a-zA-Z]{2}[0-9]{7}$/,

        },
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") == "firstName") {
          error.insertAfter("#firstName");
        }
        if (element.attr("name") == "lastName") {
          error.insertAfter("#lastName");
        }
        if (element.attr("name") == "middleName") {
          error.insertAfter("#middleName");
        }
        if (element.attr("name") == "DOB") {
          error.insertAfter("#DOB");
        }
        if (element.attr("name") == "contactNumber") {
          error.insertAfter("#contactNumber");
        }
        if (element.attr("name") == "alternateNumber") {
          error.insertAfter("#alternateNumber");
        }
        if (element.attr("name") == "email") {
          error.insertAfter("#email");
        }
        if (element.attr("name") == "department") {
          error.insertAfter("#department");
        }
        if (element.attr("name") == "designation") {
          error.insertAfter("#designation");
        }
        if (element.attr("name") == "designation") {
          error.insertAfter("#designation");
        }
        if (element.attr("name") == "addressLine1") {
          error.insertAfter("#addressLine1");
        }
        if (element.attr("name") == "addressLine2") {
          error.insertAfter("#addressLine2");
        }
        if (element.attr("name") == "landmark") {
          error.insertAfter("#landmark");
        }
        if (element.attr("name") == "country") {
          error.insertAfter("#country");
        }
        if (element.attr("name") == "states") {
          error.insertAfter("#states");
        }
        if (element.attr("name") == "district") {
          error.insertAfter("#district");
        }
        if (element.attr("name") == "area") {
          error.insertAfter("#area");
        }
        if (element.attr("name") == "city") {
          error.insertAfter("#city");
        }
        if (element.attr("name") == "pincode") {
          error.insertAfter("#pincode");
        }
        if (element.attr("name") == "passportNumber") {
          error.insertAfter("#passportNumber");
        }
        if (element.attr("name") == "effectiveUpto") {
          error.insertAfter("#effectiveUpto");
        }
        if (element.attr("name") == "licenseNumber") {
          error.insertAfter("#licenseNumber");
        }
        if (element.attr("name") == "panNumber") {
          error.insertAfter("#panNumber");
        }
        if (element.attr("name") == "aadharNumber") {
          error.insertAfter("#aadharNumber");
        }
        if (element.attr("name") == "voterId") {
          error.insertAfter("#voterId");
        }
      }
    });
    }else if(this.state.pathname == "employee"){
      $(".person").hide();
      $(".employee").show();
    $.validator.addMethod("regxEmail", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid Email Id");
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
    $("#BasicInfo").validate({
      rules: {
     
        firstName: {
          required: true
        },
        middleName: {
          required: true
        },
        lastName: {
          required: true
        },
        DOB: {
          required: true
        },
        contactNumber: {
          required: true,
        },
        alternateNumber: {
          required: true,
        },
        email: {
          required: true,
          regxEmail :/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$|^$)/,
        },
        department: {
          required: true,
        },
        designation: {
          required: true,
        }, 
        
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") == "firstName") {
          error.insertAfter("#firstName");
        }
        if (element.attr("name") == "lastName") {
          error.insertAfter("#lastName");
        }
        if (element.attr("name") == "middleName") {
          error.insertAfter("#middleName");
        }
        if (element.attr("name") == "DOB") {
          error.insertAfter("#DOB");
        }
        if (element.attr("name") == "contactNumber") {
          error.insertAfter("#contactNumber");
        }
        if (element.attr("name") == "alternateNumber") {
          error.insertAfter("#alternateNumber");
        }
        if (element.attr("name") == "email") {
          error.insertAfter("#email");
        }
        if (element.attr("name") == "department") {
          error.insertAfter("#department");
        }
        if (element.attr("name") == "designation") {
          error.insertAfter("#designation");
        }
        
      }
    });
    }else if(this.state.pathname == "guest"){
      $(".person").hide();
      $(".guest").show();
    $.validator.addMethod("regxEmail", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid Email Id");
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
    $("#BasicInfo").validate({
      rules: {
     
        firstName: {
          required: true
        },
        middleName: {
          required: true
        },
        lastName: {
          required: true
        },
       
        contactNumber: {
          required: true,
        },
        email: {
          required: true,
          regxEmail :/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$|^$)/,
        },
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") == "firstName") {
          error.insertAfter("#firstName");
        }
        if (element.attr("name") == "lastName") {
          error.insertAfter("#lastName");
        }
        if (element.attr("name") == "middleName") {
          error.insertAfter("#middleName");
        }
        if (element.attr("name") == "contactNumber") {
          error.insertAfter("#contactNumber");
        }
        if (element.attr("name") == "email") {
          error.insertAfter("#email");
        }
      }
    });
    }
    
  }
  componentWillUnmount() {
    $("script[src='/js/adminLte.js']").remove();
    $("link[href='/css/dashboard.css']").remove();
  }
  camelCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
  submitPerson(event) {
    event.preventDefault();

    if ($('#BasicInfo').valid()) {
      if (this.state.pathname == 'employee' ) {
        var userDetails = {
          type            : this.state.pathname,
          firstName       : this.state.firstName,
          middleName      : this.state.middleName,
          lastName        : this.state.lastName,
          DOB             : this.state.DOB,
          gender          : this.state.toggleButtonValue,
          contactNo       : this.state.contactNumber,
          altContactNo    : this.state.alternateNumber,
          email           : this.state.email,
          whatsappNo      : this.state.whatsappNumber,
          department      : this.state.department,
          designation     : this.state.designation,
          profilePhoto    : this.state.profilePhoto,

        }
      }else if(this.state.pathname == 'driver' ){

        var userDetails = {
          type            : this.state.pathname,
          firstName       : this.state.firstName,
          middleName      : this.state.middleName,
          lastName        : this.state.lastName,
          DOB             : this.state.DOB,
          email           : this.state.email,
          gender          : this.state.toggleButtonValue,
          contactNo       : this.state.contactNumber,
          altContactNo    : this.state.alternateNumber,
          whatsappNo      : this.state.whatsappNumber,
          department      : this.state.department,
          designation     : this.state.designation,
          profilePhoto    : this.state.profilePhoto,
          address         : {
                              addressLine1    : this.state.addressLine1,
                              addressLine2    : this.state.addressLine2,
                              landmark        : this.state.landmark,
                              area            : this.state.area,
                              city            : this.state.city,
                              district        : this.state.district,
                              state           : this.state.states.split('|')[1],
                              stateCode       : this.state.states.split('|')[0],
                              country         : this.state.country.split('|')[1],
                              countryCode     : this.state.country.split('|')[0],
                              pincode         : this.state.pincode,
                            },
          drivingLicense  : {
                              licenseNo       : this.state.licenseNumber,
                              effectiveTo     : this.state.effectiveUpto,
                              licenseProof    : this.state.licenseProof
                            },
          pan             : {
                              PAN             : this.state.panNumber,
                              PANProof        : this.state.panProof
                            },
          aadhar          : {
                              aadharNo        : this.state.aadharNumber,
                              aadharProof     : this.state.aadharProof
                            },
          voterID         : {
                              voterID         : this.state.voterId,
                              voterIDProof    : this.state.voterIDProof
                            },
          passport        : {
                              passportNo      : this.state.passportNumber,
                              passportProof   : this.state.passportProof
                            }
        }
      }else{
        var userDetails = {
          firstName       : this.state.firstName,
          middleName      : this.state.middleName,
          lastName        : this.state.lastName,
          gender          : this.state.toggleButtonValue,
          contactNo       : this.state.contactNumber,
          type            : this.state.pathname,
          email           : this.state.email,
          profilePhoto    : this.state.profilePhoto,

        }
      }
        console.log("userDetails",userDetails)
         axios.post('/api/personmaster/post', userDetails)
          .then((response) => {
            swal("Data submitted sucessfully");
            this.setState({

                firstName       : "",
                middleName      : "",
                lastName        : "",
                DOB             : "",
                gender          : "",
                contactNumber   : "",
                alternateNumber : "",
                whatsappNumber  : "",
                department      : "-- Select --",
                designation     : "-- Select --",
               
                addressLine1    : "",
                addressLine2    : "",
                landmark        : "",
                area            : "",
                city            : "",
                district        : "-- Select --",
                states          : "-- Select --",
                country         : "-- Select --",
                pincode         : "",
                email         : "",
                licenseNumber   : "",
                effectiveUpto   : "",
                panNumber       : "",
                aadharNumber    : "",
                voterId         : "",
                passportNumber  : "",
                licenseProof    : [],
                panProof        : [],
                profilePhoto    : [],

                aadharProof     : [],
                voterIDProof    : [],
                passportProof   : [],

            })
          })
          .catch((error) => {

          })
      } 
  }
  updatePerson(event){
  event.preventDefault();
  if(this.state.personID)
  {
     if (this.state.pathname == 'employee' ) {
        var userDetails = {
          personID        : this.state.personID,
          firstName       : this.state.firstName,
          middleName      : this.state.middleName,
          lastName        : this.state.lastName,
          DOB             : this.state.DOB,
          gender          : this.state.toggleButtonValue,
          contactNo       : this.state.contactNumber,
          altContactNo    : this.state.alternateNumber,
          whatsappNo      : this.state.whatsappNumber,
          email           : this.state.email,
          department      : this.state.department,
          designation     : this.state.designation,
          profilePhoto    : this.state.profilePhoto,
          updatedBy       : localStorage.getItem("user_ID")
        }
     }else if(this.state.pathname == 'driver' ){
        var userDetails = {
          personID        : this.state.personID,
          firstName       : this.state.firstName,
          middleName      : this.state.middleName,
          lastName        : this.state.lastName,
          DOB             : this.state.DOB,
          gender          : this.state.toggleButtonValue,
          contactNo       : this.state.contactNumber,
          altContactNo    : this.state.alternateNumber,
          whatsappNo      : this.state.whatsappNumber,
          department      : this.state.department,
          designation     : this.state.designation,
          profilePhoto    : this.state.profilePhoto,

          address         : {
                              addressLine1    : this.state.addressLine1,
                              addressLine2    : this.state.addressLine2,
                              landmark        : this.state.landmark,
                              area            : this.state.area,
                              city            : this.state.city,
                              district        : this.state.district,
                              state           : this.state.states.split('|')[1],
                              stateCode       : this.state.states.split('|')[0],
                              country         : this.state.country.split('|')[1],
                              countryCode     : this.state.country.split('|')[0],
                              pincode         : this.state.pincode,
                            },
          drivingLicense  : {
                              licenseNo       : this.state.licenseNumber,
                              effectiveTo     : this.state.effectiveUpto,
                              licenseProof    : this.state.licenseProof
                            },
          pan             : {
                              PAN             : this.state.panNumber,
                              PANProof        : this.state.panProof
                            },
          aadhar          : {
                              aadharNo        : this.state.aadharNumber,
                              aadharProof     : this.state.aadharProof
                            },
          voterID         : {
                              voterID         : this.state.voterId,
                              voterIDProof    : this.state.voterIDProof
                            },
          passport        : {
                              passportNo      : this.state.passportNumber,
                              passportProof   : this.state.passportProof
                            },
          updatedBy       : localStorage.getItem("user_ID")
        }
     }else{
        var userDetails = {
          firstName       : this.state.firstName,
          middleName      : this.state.middleName,
          lastName        : this.state.lastName,
          gender          : this.state.toggleButtonValue,
          contactNo       : this.state.contactNumber,
          email           : this.state.email,
          profilePhoto    : this.state.profilePhoto,

          updatedBy       : localStorage.getItem("user_ID")
        }
    }
     axios.patch('/api/personmaster/patch', userDetails)
      .then((response) => {
        
       
        this.setState({
            personID        :"",
            firstName       : "",
            middleName      : "",
            lastName        : "",
            DOB             : "",
            gender          : "",
            contactNumber   : "",
            alternateNumber : "",
            whatsappNumber  : "",
            department      : "-- Select --",
            designation     : "-- Select --",
           
            addressLine1    : "",
            addressLine2    : "",
            landmark        : "",
            area            : "",
            city            : "",
            district        : "-- Select --",
            states          : "-- Select --",
            country         : "-- Select --",
            pincode         : "",
            email         : "",
            licenseNumber   : "",
            effectiveUpto   : "",
            panNumber       : "",
            aadharNumber    : "",
            voterId         : "",
            passportNumber  : "",
            licenseProof    : [],
            panProof        : [],
            aadharProof     : [],
            voterIDProof    : [],
            passportProof   : [],

        },()=>{
        })
         swal({ 
           text: "Record Updated Sucessfully",
           type: "sucess" 
          },
          function(){
          this.props.history.push("/"+this.state.pathname+"/lists")
          });
      })
      .catch((error) => {
      })
    }
  }
  imgBrowse(event) {
    event.preventDefault();
    var companyLogo = [];
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      for(var i=0; i<event.currentTarget.files.length; i++){
      var file = event.currentTarget.files[i];

      if (file) {
        var fileName = file.name;
        var ext = fileName.split('.').pop();
        if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "JPG" || ext === "PNG" || ext === "JPEG") {
          if (file) {
            var objTitle = { fileInfo: file }
            companyLogo.push(objTitle);

          } else {
            swal("Images not uploaded");
          }//file
        } else {
          swal("Allowed images formats are (jpg,png,jpeg)");
        }//file types
      }//file
      }//for 

      if (event.currentTarget.files) {
        main().then(formValues => {
          var companyLogo = this.state.companyLogo;
          for(var k = 0; k < formValues.length; k++){
            companyLogo.push(formValues[k].companyLogo)
          }
          
          this.setState({
            companyLogo: companyLogo
          })
        });
        
          async function main() {
            var formValues = [];
            for(var j = 0; j < companyLogo.length; j++){
              var config = await getConfig();
              var s3url = await s3upload(companyLogo[j].fileInfo, config, this);
              const formValue = {
                "companyLogo": s3url,
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
                          console.log("docBrowse",docBrowse)

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
                    console.log("docBrowse",docBrowse);
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

    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190, 110,48,49,50,51,52,53,54,55,56,57]) !== -1 ||
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
  /*======== alphanumeric  =========*/
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
  isTextKey(evt)  {
   var charCode = (evt.which) ? evt.which : evt.keyCode;
   if (charCode!=189 && charCode > 32 && (charCode < 65 || charCode > 90) )
   {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    }
  }
  componentWillReceiveProps(nextProps,prevProps) {
    var splitslash =  nextProps.location.pathname.split("/");
    this.setState({
      pathname : splitslash[1]
    })
    if(splitslash[1] == "driver")
    {
      $(".person").hide();
      $(".driver").show();
    }else if(splitslash[1] == "employee"){
      $(".person").hide();
      $(".employee").show();
    }else if(splitslash[1] == "guest"){
      $(".person").hide();
      $(".guest").show();
       
    }
    this.edit();
    this.handleChange = this.handleChange.bind(this);
  }
  admin(event) {
    event.preventDefault();
    this.props.history.push('/adminDashboard');
  }
  edit() {
    var personID = this.state.personID;
    if (personID) {
      axios.get('/api/personmaster/get/one/' + personID)
        .then((response) => {
        
          if (response.data.address.length>0) {
            this.getStates(response.data.address[0].countryCode);
            this.getDistrict(response.data.address[0].stateCode, response.data.address[0].countryCode);
          
          }
          // this.getBlocks(response.data.address[0].district, response.data.address[0].stateCode, response.data.address[0].countryCode);
          console.log("response11",response.data)
          this.setState({
            firstName       : response.data.firstName,
            middleName      : response.data.middleName,
            lastName        : response.data.lastName,
            DOB             : moment(response.data.DOB).format("YYYY-MM-DD"),
            toggleButtonValue: response.data.gender,
            contactNumber   : response.data.contactNo,
            alternateNumber : response.data.altContactNo,
            whatsappNumber  : response.data.whatsappNo,
            department      : response.data.department,
            designation     : response.data.designation,
            type            : response.data.pathname,
            addressLine1    : response.data.address[0] ? response.data.address[0].addressLine1 : "",
            addressLine2    : response.data.address[0] ? response.data.address[0].addressLine2 : "",
            landmark        : response.data.address[0] ? response.data.address[0].landmark : "",
            area            : response.data.address[0] ? response.data.address[0].area : "",
            city            : response.data.address[0] ? response.data.address[0].city : "",
            district        : response.data.address[0] ? response.data.address[0].district : "",
            states          : response.data.address[0] ? response.data.address[0].stateCode+"|"+response.data.address[0].state : "",
            country         : response.data.address[0] ? response.data.address[0].countryCode+"|"+ response.data.address[0].country : "",
            pincode         : response.data.address[0] ? response.data.address[0].pincode : "",
            email         : response.data.email,
            licenseNumber   : response.data.drivingLicense.length>0 ? response.data.drivingLicense[0].licenseNo : "",
            effectiveUpto   : moment(response.data.effectiveTo).format("YYYY-MM-DD"),
            panNumber       : response.data.pan[0] ? response.data.pan[0].PAN : "",
            aadharNumber    : response.data.aadhar[0] ? response.data.aadhar[0].aadharNo : "",
            voterId         : response.data.voterID[0] ? response.data.voterID[0].voterID : "",
            passportNumber  : response.data.passport[0] ? response.data.passport[0].passportNo : [],
            licenseProof    : response.data.drivingLicense[0] ? response.data.drivingLicense[0].licenseProof : [],
            panProof        : response.data.pan[0] ? response.data.pan[0].PANProof : [],
            aadharProof     : response.data.aadhar[0] ? response.data.aadhar[0].aadharProof : [],
            voterIDProof    : response.data.voterID[0] ? response.data.voterID[0].voterIDProof : [],
            passportProof   : response.data.passport[0] ? response.data.passport[0].passportProof : [],
            profilePhoto    : response.data.profilePhoto,
            createdBy       : localStorage.getItem("user_ID")
          },()=>{
            
          })
        })
        .catch((error) => {
        })
    }
  }
  changeMobile(event){
    this.setState({
      companyPhone : event
    },()=>{ 
      if(this.state.companyPhone){
        this.setState({
          companyPhoneError : this.state.companyPhone == "+" ? 'Please enter valid mobile number.' : ""
        })
      } 
    })
  }
  deleteLogo(event){
    event.preventDefault();
    var companyLogo = this.state.companyLogo;
    const index = companyLogo.indexOf(event.target.id);
    if (index > -1) {
      companyLogo.splice(index, 1);
    }
    this.setState({
      companyLogo : companyLogo
    })
  }
  deleteDoc(event){
    event.preventDefault();
        var name = event.target.getAttribute("name");
        var deleteDoc = this.state[name];
        console.log(deleteDoc)
        const index = deleteDoc.indexOf(event.target.getAttribute("id"));
        if (index > -1) {
            deleteDoc.splice(index, 1);
        }
        this.setState({
            [name]: deleteDoc
        })
  }
  changeMobile(event){
    this.setState({
      contactNumber : event
    })
  }
  changeMobileAlternate(event){
    this.setState({
      alternateNumber : event
    })
  }
  changeMobileWhatsapp(event){
    this.setState({
      whatsappNumber : event
    })
  }
  handleChangeCountry(event) {
    const target = event.target;
    this.setState({
      [event.target.name]: event.target.value
    });
    this.getStates(event.target.value.split('|')[0])
  }
  handleChangeDesignation(event) {
    const target = event.target;
    this.setState({
      [event.target.name]: event.target.value
    },()=>{
    });
   
  }
  handleChangeDepartment(event) {
    const target = event.target;
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  handleChangeState(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
    const target = event.target;
    const stateCode = $(target).val();
    const countryCode = $("#countryVal").val();
    this.getDistrict(stateCode, countryCode);

  }
  getStates(StateCode) {
    axios.get("http://locations2.iassureit.com/api/states/get/list/" + StateCode)
      .then((response) => {
        this.setState({
          stateArray: response.data
        })
        $('#state').val(this.state.states);
      })
      .catch((error) => {
      })
  }
  getDistrict(stateCode, countryCode) {
    axios.get("http://locations2.iassureit.com/api/districts/get/list/" + countryCode + "/" + stateCode)
      .then((response) => {
        this.setState({
          districtArray: response.data
        },()=>{
        })

        $('#Citydata').val(this.state.city);
      })
      .catch((error) => {
      })
  }
  getDesignation() {
    axios.get("/api/designationmaster/get/list")
      .then((response) => {
        this.setState({
          designationArray: response.data
        })
      })
      .catch((error) => {
      })
  }
  getDepartment() {
    axios.get("/api/departmentmaster/get/list")
      .then((response) => {
        this.setState({
          departmentArray: response.data
        })
      })
      .catch((error) => {
      })
  }
  Capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  getSelectedGender(val,event) {
    this.setState({
      toggleButtonValue : val
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
                  <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">{"Add "+this.Capitalize(this.state.pathname)}</h4>
                </div>
                <section className="Content">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <form id="BasicInfo">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding ">
                          <div className="col-lg-12 col-md-12 col-sm-12 supplierForm">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                              <br />
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls NOpadding-left driver guest employee person NOpadding-right">
                                <label className="subHead col-lg-12 col-md-12 col-sm-12 col-xs-12 person "> Basic Details</label>
                                <div className=" col-lg-2 col-md-12 col-sm-12 col-xs-12 ">
                                  <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 uploadImage ">
                                    <div className="col-lg-12 col-md-2 col-sm-12 col-xs-12 driver employee guest person nopadding ">
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                            <div><i className="fa fa-camera"></i> <br /><p>Upload Photo</p></div>
                                            <input onChange={this.docBrowse.bind(this)}  id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="profilePhoto" />
                                        </div>
                                        {
                                          this.state.profilePhoto && this.state.profilePhoto.length > 0 ?
                                              this.state.profilePhoto.map((logo, i) => {
                                                  return (
                                                      <div key={i} className="col-lg-12 col-md-2 col-sm-12 col-xs-12 nopadding CustomImageUpload">
                                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                              <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" id={logo} name="profilePhoto" onClick={this.deleteDoc.bind(this)}>x</label>
                                                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="profilePhoto">
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
                                <div className="form-margin col-lg-10 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12  driver employee guest person" >
                                    <div id="firstName">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">First Name <i className="astrick">*</i></label>
                                      <input type="text"  className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.firstName} ref="firstName" name="firstName" onChange={this.handleChange} onKeyDown={this.isTextKey.bind(this)}/>
                                    </div>
                                  </div>
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12  driver employee guest person" >
                                    <div id="middleName">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Middle Name <i className="astrick">*</i></label>
                                      <input type="text"  className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.middleName} ref="middleName" name="middleName" onChange={this.handleChange} onKeyDown={this.isTextKey.bind(this)}  />
                                    </div>
                                  </div>
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee guest person">
                                    <div id="lastName">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Last Name <i className="astrick">*</i></label>
                                      <input type="text"  className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.lastName} ref="lastName" name="lastName" onChange={this.handleChange} onKeyDown={this.isTextKey.bind(this)} />
                                    </div>
                                  </div>
                                </div>
                                <div className="form-margin col-lg-10 col-md-12 col-sm-12 col-xs-12 driver guest employee person NOpadding-left NOpadding-right">
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee person">
                                    <div id="DOB">    
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">DOB <i className="astrick">*</i></label>
                                      <input type="date" id="DOB" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.DOB} max={moment(new Date).format("YYYY-MM-DD")} ref="DOB" name="DOB" onChange={this.handleChange} />
                                    </div>
                                  </div>
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee guest person">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Gender <i className="astrick">*</i></label>
                                      <div className="btn-group btn-group-toggle col-lg-12 nopadding" data-toggle="buttons">
                                       <label className={this.state.toggleButtonValue == "Male" ? "btn toggleButton customToggleButton col-lg-3 btn-secondary active" : "btn toggleButton customToggleButton col-lg-3 btn-secondary "} value="Male" onClick={this.getSelectedGender.bind(this,"Male")}  >
                                          <input type="radio"
                                           name="options" 
                                           id="Male"
                                           value="male"
                                           autoComplete="off"
                                           checked={this.state.toggleButtonValue == "Male" ? "checked" : "unchecked" }
                                           /> Male
                                        </label>
                                        <label className={this.state.toggleButtonValue == "Female" ? "btn toggleButton customToggleButton col-lg-3 btn-secondary active" : "btn toggleButton customToggleButton col-lg-3 btn-secondary "} value="Female" onClick={this.getSelectedGender.bind(this,"Female")}>
                                          <input type="radio" name="options" id="Female"  value="Female" autoComplete="off" checked={this.state.toggleButtonValue == "Female" ? "checked" : "unchecked" }  /> Female
                                        </label>
                                        <label className={this.state.toggleButtonValue == "Transgender" ? "btn toggleButton customToggleButton col-lg-5 noRightMargin btn-secondary active" : "btn toggleButton customToggleButton noRightMargin col-lg-5 btn-secondary "} value="Transgender" onClick={this.getSelectedGender.bind(this,"Transgender")}>
                                          <input type="radio" name="options" id="Transgender" autoComplete="off" checked={this.state.toggleButtonValue == "Transgender" ? "checked" : "unchecked" }  /> Transgender
                                        </label>
                                      </div>
                                    
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 driver guest employee person" >
                                    <div id="email"> 
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Email <i className="astrick">*</i>
                                        <a data-tip data-for='basicInfo4Tooltip' className="pull-right"> <i title="testemail@gmail.com" className="fa fa-question-circle"></i> </a>

                                      </label>
                                      <input type="email"  className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" value={this.state.email} ref="email" name="email" onChange={this.handleChange} placeholder="testemail@gmail.com" />
                                    </div>
                                  </div>
                                  
                                </div>
                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 driver guest employee person NOpadding-left NOpadding-right">
                                  
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver guest employee person">
                                    <div id="contactNumber">
                                      <label className="labelform  NOpadding-left">Contact Number <i className="astrick">*</i></label>
                                      <PhoneInput
                                        country={'in'}
                                        value={this.state.contactNumber}
                                        name="contactNumber"
                                        inputProps={{
                                          name: 'contactNumber',
                                          required: true
                                        }}
                                        onChange={this.changeMobile.bind(this)}
                                      />
                                    </div>
                                  </div>
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee person">
                                    <label className="labelform  NOpadding-left">Alternate Number <i className="astrick">*</i></label>
                                    <PhoneInput
                                      country={'in'}
                                      value={this.state.alternateNumber}
                                      name="alternateNumber"
                                      inputProps={{
                                        name: 'alternateNumber',
                                        required: true
                                      }}
                                       onChange={this.changeMobileAlternate.bind(this)}
                                    />
                                  </div>
                                  
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee person">
                                   
                                    <label className="labelform  NOpadding-left">Whatsapp Number <i className="astrick">*</i></label>
                                    <PhoneInput
                                      country={'in'}
                                      value={this.state.whatsappNumber}
                                      name="whatsappNumber"
                                      inputProps={{
                                        name: 'whatsappNumber',
                                        required: true
                                      }}
                                      onChange={this.changeMobileWhatsapp.bind(this)}
                                    />
                                  </div>
                                </div>
                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12  driver employee person NOpadding-left NOpadding-right">
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee person">
                                    <div id="department">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Department <i className="astrick">*</i></label>
                                      <select className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                        ref="department" value={this.state.department} name="department" onChange={this.handleChangeDepartment} >
                                        <option selected={true} disabled={true} >-- Select --</option>
                                        {
                                          this.state.departmentArray && this.state.departmentArray.length > 0 ?
                                            this.state.departmentArray.map((deptData, index) => {
                                              return (
                                                <option key={index} value={deptData.department}>{(deptData.department)}</option>
                                              );
                                            }
                                            ) : ''
                                        }
                                      </select>
                                    </div>
                                  </div>
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee person">
                                    <div id="designation">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Designation <i className="astrick">*</i></label>
                                      <select  className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" ref="designation" value={this.state.designation} name="designation" onChange={this.handleChangeDesignation}>
                                        <option selected={true} disabled={true} >-- Select --</option>
                                        {
                                          this.state.designationArray && this.state.designationArray.length > 0 ?
                                            this.state.designationArray.map((desData, index) => {
                                              return (
                                                <option key={index} value={desData.designation}>{(desData.designation)}</option>
                                              );
                                            }) : ''
                                        }
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  person borderBottom">
                                </div>
                                <label className="subHead col-lg-12 col-md-12 col-sm-12 col-xs-12 driver person"> Address Details</label>
                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person">
                                    <div id="addressLine1"> 
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Address Line 1 <i className="astrick">*</i></label>
                                      <input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.addressLine1} ref="addressLine1" name="addressLine1" onChange={this.handleChange} />
                                    </div>
                                  </div>
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person">
                                    <div id="addressLine2"> 
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Address Line 2 <i className="astrick">*</i></label>
                                      <input type="text" id="addressLine2" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.addressLine2} ref="addressLine2" name="addressLine2" onChange={this.handleChange} required />
                                    </div>
                                  </div>
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person">
                                    <div id="landmark"> 
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Landmark <i className="astrick">*</i></label>
                                      <input type="text" id="landmark" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.landmark} ref="landmark" name="landmark" onChange={this.handleChange} required />
                                    </div>
                                  </div>
                                </div>
                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12  driver employee person NOpadding-left NOpadding-right">
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person">
                                    <div id="country"> 
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Country <i className="astrick">*</i></label>
                                      <select className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                        ref="country" name="country" id="countryVal" value={this.state.country} onChange={this.handleChangeCountry} >
                                        <option selected={true}>-- Select --</option>
                                        <option value="IN|India">India</option>
                                      </select>
                                   </div>
                                  </div>
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person">
                                    <div id="states"> 
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">State <i className="astrick">*</i></label>
                                      <select className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                        ref="states" value={this.state.states} name="states" onChange={this.handleChangeState} >
                                        <option selected={true} disabled={true}>-- Select --</option>
                                        {
                                          this.state.stateArray && this.state.stateArray.length > 0 ?
                                            this.state.stateArray.map((stateData, index) => {
                                              return (
                                                <option key={index} value={stateData.stateCode+"|"+stateData.stateName}>{this.camelCase(stateData.stateName)}</option>
                                              );
                                            }) : ''
                                        }
                                      </select>
                                    </div>
                                  </div>
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person">
                                    <div id="district">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">District <i className="astrick">*</i></label>
                                      <select id="district" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                        ref="district" name="district" value={this.state.district} onChange={this.handleChange} >
                                        <option selected={true} disabled={true}>-- Select --</option>
                                        {
                                          this.state.districtArray && this.state.districtArray.length > 0 ?
                                            this.state.districtArray.map((districtdata, index) => {
                                              return (
                                                <option key={index} value={districtdata.districtName}>{this.camelCase(districtdata.districtName)}</option>
                                              );
                                            }
                                          ) : ''
                                        }
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12   driver employee person NOpadding-left NOpadding-right">
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12  driver person">
                                    <div id="area">  
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Area <i className="astrick">*</i></label>
                                      <input type="text" id="area" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.area} ref="area" name="area" onChange={this.handleChange} />
                                    </div>
                                  </div>
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12  driver person">
                                    <div id="city">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">City <i className="astrick">*</i></label>
                                      <input type="text" id="city" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.city} ref="city" name="city" onChange={this.handleChange} required />
                                    </div>
                                  </div>
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver  person">
                                    <div id="pincode">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Pincode <i className="astrick">*</i></label>
                                      <input maxLength="6" onChange={this.handleChange.bind(this)} type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.pincode} ref="pincode" name="pincode" onKeyDown={this.keyPressNumber.bind(this)} />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 person borderBottom">
                                </div>
                                <label className="subHead col-lg-12 col-md-12 col-sm-12 col-xs-12 driver  person">License Details</label>
                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver  person">
                                    <div id="licenseNumber">  
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">License Number <i className="astrick">*</i>
                                        <a data-tip data-for='basicInfo4Tooltip' className="pull-right"> <i title="MH2220675583563" className="fa fa-question-circle"></i> </a>
                                      </label>
                                      <input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.licenseNumber} ref="licenseNumber" name="licenseNumber" placeholder="MH2220675583563" onChange={this.handleChange} />
                                    </div>
                                  </div>
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver  person">
                                    <div id="effectiveUpto">  
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Effective Upto <i className="astrick">*</i>
                                      </label>
                                      <input type="date" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.effectiveUpto} ref="effectiveUpto" name="effectiveUpto" min={moment(new Date).format("YYYY-MM-DD")} onChange={this.handleChange} />
                                    </div>
                                  </div>
                                </div>
                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right person">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">License Proof (jpg, jpeg, png, pdf)  <i className="astrick">*</i></label>
                                  </div>
                                  <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 driver person ">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                          <div><i className="fa fa-camera"></i> <br /><p>ADD DOCUMENT</p></div>
                                          <input multiple onChange={this.docBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="licenseProof" />
                                      </div>
                                    </div>
                                  </div>
                                  {
                                    this.state.licenseProof && this.state.licenseProof.length > 0 ?
                                        this.state.licenseProof.map((logo, i) => {
                                            return (
                                                <div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                        <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" id={logo} name="licenseProof" onClick={this.deleteDoc.bind(this)}>x</label>
                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="licenseProof">
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
                                 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 person borderBottom">
                                </div>
                                <label className="subHead col-lg-12 col-md-12 col-sm-12 col-xs-12 driver person">PAN Card Details</label>
                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person">
                                     <div id="panNumber">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">PAN Number <i className="astrick">*</i>
                                        <a data-tip data-for='basicInfo4Tooltip' className="pull-right"> <i title="AYBOL0998L" className="fa fa-question-circle"></i> </a>
                                      </label>
                                      <input type="text"  className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.panNumber} ref="panNumber" placeholder="AYBOL0998L" name="panNumber" onChange={this.handleChange} />
                                    </div>
                                  </div>
                                </div>
                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12  driver person NOpadding-left NOpadding-right">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding driver person">PAN Proof (jpg, jpeg, png, pdf)  <i className="astrick">*</i></label>
                                  </div>
                                  <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 person driver">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                          <div><i className="fa fa-camera"></i> <br /><p>ADD DOCUMENT</p></div>
                                          <input multiple onChange={this.docBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="panProof" />
                                      </div>
                                    </div>
                                  </div>
                                  {
                                    this.state.panProof && this.state.panProof.length > 0 ?
                                        this.state.panProof.map((logo, i) => {
                                            return (
                                                <div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                        <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" id={logo} name="panProof" onClick={this.deleteDoc.bind(this)}>x</label>
                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="panProof">
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
                                 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 person borderBottom">
                                </div>
                                <label className="subHead col-lg-12 col-md-12 col-sm-12 col-xs-12 driver person">Aadhar Details</label>
                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12  driver person NOpadding-left NOpadding-right">
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person">
                                    <div id="aadharNumber">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Aadhar Number <i className="astrick">*</i>
                                        <a data-tip data-for='basicInfo4Tooltip' className="pull-right"> <i title="628758647321" className="fa fa-question-circle"></i> </a>
                                      </label>
                                      <input type="text"  className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.aadharNumber} placeholder="620876674532" ref="aadharNumber" name="aadharNumber" onChange={this.handleChange} />
                                    </div>
                                  </div>
                                </div>
                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12  driver person NOpadding-left NOpadding-right">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding driver person">Aadhar Proof (jpg, jpeg, png, pdf)  <i className="astrick">*</i></label>
                                  </div>
                                  <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 driver person">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                          <div><i className="fa fa-camera"></i> <br /><p>ADD DOCUMENT</p></div>
                                          <input multiple onChange={this.docBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="aadharProof" />
                                      </div>
                                    </div>
                                  </div>
                                  {
                                    this.state.aadharProof && this.state.aadharProof.length > 0 ?
                                        this.state.aadharProof.map((logo, i) => {
                                            return (
                                                <div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                        <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" id={logo} name="aadharProof" onClick={this.deleteDoc.bind(this)}>x</label>
                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="aadharProof">
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
                                 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 person borderBottom">
                                </div>
                                <label className="subHead col-lg-12 col-md-12 col-sm-12 col-xs-12 driver person">Voting Details</label>
                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 driver person NOpadding-left NOpadding-right">
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person">
                                    <div id="voterId">    
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Voter ID <i className="astrick">*</i>
                                        <a data-tip data-for='basicInfo4Tooltip' className="pull-right"> <i title="YUC1234567" className="fa fa-question-circle"></i> </a>
                                      </label>
                                      <input type="text"  className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.voterId} ref="voterId" name="voterId" placeholder="YUC1234567" onChange={this.handleChange} />
                                    </div> 
                                  </div>
                                </div>
                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 driver person NOpadding-left NOpadding-right">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding driver person">Voter ID Proof (jpg, jpeg, png, pdf)  <i className="astrick">*</i></label>
                                  </div>
                                  <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 driver person">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                          <div><i className="fa fa-camera"></i> <br /><p>ADD DOCUMENT</p></div>
                                          <input multiple onChange={this.docBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="voterIDProof" />
                                      </div>
                                    </div>
                                  </div>
                                  {
                                    this.state.voterIDProof && this.state.voterIDProof.length > 0 ?
                                        this.state.voterIDProof.map((logo, i) => {
                                            return (
                                                <div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                        <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" id={logo} name="voterIDProof" onClick={this.deleteDoc.bind(this)}>x</label>
                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="voterIDProof">
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
                                 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 person borderBottom">
                                </div>
                                <label className="subHead col-lg-12 col-md-12 col-sm-12 col-xs-12 driver person">Passport Details</label>
                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 driver person NOpadding-left NOpadding-right">
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person">
                                    <div id="passportNumber">  
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Passport Number <i className="astrick">*</i>
                                        <a data-tip data-for='basicInfo4Tooltip' className="pull-right"> <i title="UC1234567" className="fa fa-question-circle"></i> </a>
                                      </label>
                                      <input type="text"  className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.passportNumber} ref="passportNumber" placeholder="UC1234567" name="passportNumber" onChange={this.handleChange} />
                                    </div>
                                  </div>
                                </div>
                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 driver person NOpadding-left NOpadding-right">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding driver person">Passport Proof (jpg, jpeg, png, pdf)  <i className="astrick">*</i></label>
                                  </div>
                                  <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 driver person">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                          <div><i className="fa fa-camera"></i> <br /><p>ADD DOCUMENT</p></div>
                                          <input multiple onChange={this.docBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="passportProof" />
                                      </div>
                                    </div>
                                  </div>
                                  {
                                    this.state.passportProof && this.state.passportProof.length > 0 ?
                                        this.state.passportProof.map((logo, i) => {
                                            return (
                                                <div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                        <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" id={logo} name="passportProof" onClick={this.deleteDoc.bind(this)}>x</label>
                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="passportProof">
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
                                 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 person borderBottom">
                                </div>

                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                            {
                              this.state.personID?
                              <button className="btn button3 pull-right" onClick={this.updatePerson.bind(this)} >Update&nbsp;</button>
                                :
                              <button className="btn button3 pull-right" onClick={this.submitPerson.bind(this)} >Submit&nbsp;</button>
                            }
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
export default PersonMaster;