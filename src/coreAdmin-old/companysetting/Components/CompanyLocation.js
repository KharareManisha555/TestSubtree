import React, { Component }     from 'react';
import { render }               from 'react-dom';
import $ from "jquery";
import swal from 'sweetalert';
import axios from 'axios';
import InputMask  from 'react-input-mask';

import "../css/CompanySetting.css";


const companycontact  = RegExp(/^[0-9][0-9]{9}$|^$/);
const companylocation = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const companybuilding = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const companynameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const companypincodeRegex = RegExp(/^[1-9][0-9]{5}$/);
const numberRegex = RegExp(/[0-9]+(?:-[0-9]+)?(,[0-9]+(?:-[0-9]+)?)*/);
class CompanyLocation extends Component{

  constructor(props) {
    super(props);
    this.state = {
      EditLocId             : props.locId ? props.locId : "", 
      locationType          : "Head Office",
      companycontact        : "", 
      companybuildingblock  : "",
      companyArea           : "",
      companylandmark       : "",
      countryCode           : "-- Select --",
      country               : "",
      stateCode             : "-- Select --",
      state                 : "",
      companyDist           : "-- Select --",
      taluka                : "-- Select --",
      city                  : "",
      pincode               : "",
      submitVal             : true,
      allPosts              : null,
      pincodeExists         : true,
      allLoc   : null,
      editlocId : null,
      required : "",
     

    };
    this.handleChange = this.handleChange.bind(this);
    
  }
  
  componentWillReceiveProps(nextProps){
    
    this.setState({
      companyId    : nextProps.companyInfo._id,
      allLoc       : nextProps.companyInfo.companyLocationsInfo
    });
  }
   
  componentDidMount(){
    $.validator.addMethod("regxpincode", function (value, element, regexpr) {
        return regexpr.test(value);
    }, "Please enter valid pincode");
    $.validator.addMethod("regxmobileNumber", function (value, element, regexpr) {
        return regexpr.test(value);
    }, "Please enter valid contact number");
    
    $("#companyLocationForm").validate({
      rules: {
        locationType: {
          required: true,
        },
        companycontact: {
          required: true,
          regxmobileNumber: /^([7-9][0-9]{9})$/
        },
        companybuildingblock: {
          required: true,
        },
        companyArea: {
          required: true,
        },
        countryCode: {
          required: true,
        },
        stateCode: {
          required: true,
        },
        companyDist: {
          required: true,
        },
        taluka: {
          required: true,
        },
        companyCity: {
          required: true,
        },
        companyPincode: {
          required: true,
          regxpincode : /^[1-9][0-9]{5}$/
        },
      },
      errorPlacement: function(error, element) {
              if (element.attr("name") == "locationType"){
                error.insertAfter("#locationType");
              }
              if (element.attr("name") == "companycontact"){
                error.insertAfter("#companycontact");
              }
              if (element.attr("name") == "companybuildingblock"){
                error.insertAfter("#companybuildingblock");
              }
              if (element.attr("name") == "companyArea"){
                error.insertAfter("#companyArea");
              }
              
              if (element.attr("name") == "countryCode"){
                error.insertAfter(".datacountryError");
              }
              if (element.attr("name") == "stateCode"){
                error.insertAfter(".StatedataError");
              }
              if (element.attr("name") == "companyDist"){
                error.insertAfter(".districtDataError");
              }
              if (element.attr("name") == "taluka"){
                error.insertAfter(".BlocksdataError");
              }
              if (element.attr("name") == "companyCity"){
                error.insertAfter(".companyCity");
              }
              if (element.attr("name") == "companyPincode"){
                error.insertAfter(".companyPincode");
              }
            }
    });
           
  }
  handleChange(event){
    const {name,value} = event.target;
    this.setState({ 
      [name]:value
    });
  }
  handleChangeCountry(event){
    const target = event.target;
    this.setState({
      countryCode: target.value,
      country : target.options[target.selectedIndex].innerHTML })
    this.getStates(target.value)
  }
    getStates(StateCode){
      axios.get("http://locations2.iassureit.com/api/states/get/list/"+StateCode)
            .then((response)=>{
          
              this.setState({
                  stateArray : response.data
              })
              
              $('#Statedata').val(this.state.stateCode);
            })
            .catch((error)=>{
            })
    }
    handleChangeState(event){
      const target = event.target;
      const stateCode = event.target.value;
      const countryCode = this.state.countryCode;
      this.setState({stateCode: target.value, state : target.options[target.selectedIndex].innerHTML })
      this.getDistrict(stateCode,countryCode);
       
    }
    getDistrict(stateCode,countryCode){
      axios.get("http://locations2.iassureit.com/api/districts/get/list/"+countryCode+"/"+stateCode)
            .then((response)=>{
              this.setState({
                  districtArray : response.data
              })
             
              $('#districtData').val(this.state.companyDist);
            })
            .catch((error)=>{
            })
    }
    handleChangeDistrict(event){
      const target = event.target;
      const districtName = target.value;
      const stateCode = this.state.stateCode;
      const countryCode = this.state.countryCode;
      this.setState({companyDist: target.value })
      this.getBlocks(districtName,stateCode,countryCode);
    }
    getBlocks(districtName,stateCode,countryCode){
      axios.get("http://locations2.iassureit.com/api/blocks/get/list/"+countryCode+'/'+stateCode+"/"+districtName)
            .then((response)=>{
              var flags = [], output = [], l = response.data.length, i;
              for( i=0; i<l; i++) {
                  if( flags[response.data[i].blockName]) continue;
                  flags[response.data[i].blockName] = true;
                  output.push(response.data[i]);
              }
              
              this.setState({
                blocksArray : output
              })
              $('#Blocksdata').val(this.state.taluka);
            })
            .catch((error)=>{
            })
    }
    handleChangeBlock(event){
      this.setState({taluka: event.target.value })
    }
  submitCompanyLocation=(event)=>{
    event.preventDefault();
    var companyLocationFormValue ={
      locationType              : this.state.locationType,
      companyId                 : this.state.companyId,
      contactnumber             : this.state.companycontact,
      blockname                 : this.state.companybuildingblock,
      area                      : this.state.companyArea,
      landmark                  : this.state.companylandmark,
      countryCode               : this.state.countryCode,
      country                   : this.state.country,
      stateCode                 : this.state.stateCode,
      state                     : this.state.state,
      district                  : this.state.companyDist,
      taluka                    : this.state.taluka,
      companyCity               : this.state.companyCity,
      companyPincode            : this.state.companyPincode
      
    }//close array

    var companyLocationFormValueupdate ={
      
      locationID                : this.state.editlocId,
      locationType              : this.state.locationType,
      companyId                 : this.state.companyId,
      contactnumber             : this.state.companycontact,
      blockname                 : this.state.companybuildingblock,
      area                      : this.state.companyArea,
      landmark                  : this.state.companylandmark,
      countryCode               : this.state.countryCode,
      country                   : this.state.country,
      stateCode                 : this.state.stateCode,
      state                     : this.state.state,
      district                  : this.state.companyDist,
      taluka                    : this.state.taluka,
      companyCity               : this.state.companyCity,
      companyPincode            : this.state.companyPincode
    }

   if($("#companyLocationForm").valid() && this.state.pincodeExists ){
      
      if(this.state.submitVal == true)
      {
        axios.patch('/api/companysettings/addLocation',companyLocationFormValue)
          .then( (response)=> {
            
            swal({
              title: "Location is added successfully",
              text: "Location is added successfully",
            });
            this.setState({
              locationType         :"",
              companycontact          :"",
              companybuildingblock    :"",
              companylandmark         :"",
              countryCode             :"-- Select --",
              country                 :"",
              stateCode               :"-- Select --",
              state                   :"",
              companyDist             :"-- Select --",
              taluka                  :"-- Select --",
              companyCity             :"-- Select --",
              companyPincode          :"",
              companyArea             :""
            });
            axios.get('/api/companysettings/')
            .then( (res)=>{   
              this.setState({allLoc: res.data.companyLocationsInfo}) 
            })
            .catch((error)=>{
            });
          })
          .catch(function (error) {
          })
      }
      else{
        axios.patch('/api/companysettings/update_location',companyLocationFormValueupdate)
        .then( (response)=> {
          // handle success
          swal({
              title: "Location is updated successfully",
              text: "Location is updated successfully",
            });
          this.setState({
            locationType         :"",
            companycontact          :"",
            companybuildingblock    :"",
            companylandmark         :"",
            countryCode             :"-- Select --",
            country                 :"",
            stateCode               :"-- Select --",
            state                   :"",
            companyDist             :"-- Select --",
            taluka                  :"-- Select --",
            companyCity             :"-- Select --",
            companyPincode          :"",
            companyArea             :"",
            submitVal               : false,
          });
            axios.get('/api/companysettings/')
            .then( (res)=>{   
              this.setState({allLoc: res.data.companyLocationsInfo}) 
            })
            .catch((error)=>{
            });

        })
        .catch(function (error) {
          // handle error
        })  
      }
    }
  }

selectType(event){
    event.preventDefault();
    const target = event.target;
    const name   = target.name;
    this.setState({
      [name]: event.target.value,
    });  
}

  editLoc(event){
      event.preventDefault();
      var id = event.target.id;
      
      this.setState({
        editlocId:id,
        submitVal:false,
      });   

      axios.get('/api/companysettings/singleLocation/'+id)
      .then( (response)=> {
        
        var maindata = response.data.companyLocationsInfo[0];
        this.getStates(maindata.countryCode);
        this.getDistrict(maindata.stateCode, maindata.countryCode);
        this.getBlocks(maindata.district, maindata.stateCode, maindata.countryCode);
      
        this.setState({
          locationType              : maindata.locationType,
          companycontact            : maindata.contactNumber,
          companybuildingblock      : maindata.blockName,
          companyArea               : maindata.area,
          companylandmark           : maindata.landmark,
          countryCode               : maindata.countryCode,
          country                   : maindata.country,
          stateCode                 : maindata.stateCode,
          state                     : maindata.state,
          companyDist               : maindata.district,
          taluka                    : maindata.taluka,
          companyCity               : maindata.city,
          companyPincode            : maindata.pincode
        });

      })
      .catch(function (error) {
      })
    }

  deleteLoc(event){
      event.preventDefault();
      var id = event.target.id;
      axios.patch('/api/companysettings/deleteLocation/'+this.state.companyId+'/'+id)
        .then( (response)=> {
          // handle success
          swal({
              title: "Location is deleted successfully",
              text: "Location is deleted successfully",
            });
          axios.get('/api/companysettings/')
            .then( (res)=>{   
              this.setState({allLoc: res.data.companyLocationsInfo}) 
            })
            .catch((error)=>{
            });
        })
        .catch(function (error) {
      })
  }
  handlePincode(event){
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value
        })
        if (event.target.value != '') {
            axios.get("https://api.postalpincode.in/pincode/" + event.target.value,{ crossDomain: true,
              headers: {
              'Access-Control-Allow-Origin': true,
              } })
            .then((response) => {
                
                if ($("[name='companyPincode']").valid()) {

                    if (response.data[0].Status == 'Success' ) {
                        this.setState({pincodeExists : true})
                    }else{
                        this.setState({pincodeExists : false})
                    }
                }else{
                    this.setState({pincodeExists : true})
                }
                
            })
            .catch((error) => {
            })
        }else{
            this.setState({pincodeExists : true})
        }
    }
  render(){   
    return(
        <div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyDisplayForm">
            
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <h4 className="">Location Details</h4>
              </div>
               <hr className="compySettingHr" />
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <form id="companyLocationForm" className="companyLocationForm">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  compForm">
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls ">
                        <div className="form-group margin15">
                            <label className="labelform" >Company Location</label><span className="astrick">*</span>
                            <select className="form-control" value={this.state.locationType} onChange={this.selectType.bind(this)} ref ="locationType" id="locationType" name="locationType" data-text="locationType">
                                <option selected={true} disabled={true}>-- Select --</option>
                                <option value="Head Office" > Head Office </option>
                                <option value="Sales Agent Office" > Sales Agent Office </option>
                                <option value="Field Agent Office" > Field Agent Office </option>
                            </select>
                            <div id="locationTypeError"></div>
                        </div>
                    </div> 
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls">
                        <div className="form-group margin15">
                           <label className="labelform" >Contact Number</label><span className="astrick">*</span>
                           <input type="text" id="companycontact" maxLength="10" className="form-control" value={this.state.companycontact} ref="companycontact" name="companycontact" pattern="[0-9]+" onChange={this.handleChange.bind(this)} required/>
                        </div>
                    </div> 
                  </div>
                </div>

                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls">
                        <div className="form-group margin15">
                            <label className="labelform" >Block Name/Building</label><span className="astrick">*</span>
                            <input value={this.state.companybuildingblock} onChange={this.handleChange} data-text="blockName" type="text" id="companybuildingblock" title="Please enter valid address" name="companybuildingblock" className="form-control CLcompanyAddress inputValid " required/>
                        </div>
                    </div> 
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls">
                        <div className="form-group margin15">
                          <label className="labelform" >Area Name</label><span className="astrick">*</span>
                          <input value={this.state.companyArea} onChange={this.handleChange} type="text" data-text="companyArea" id="companyArea" ref="companyArea" name="companyArea" className="form-control CLcompanylandmark inputValid" />
                    </div> 
                  </div>
                </div>

                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm marbtm30">

                 <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls   ">
                        <div className="form-group margin15">
                            <label className="labelform" >Near by Landmark</label>
                             <input value={this.state.companylandmark} onChange={this.handleChange} type="text" id="companylandmark"  name="companylandmark" className="form-control CLcompanylandmark inputValid" />
                        </div>
                    </div> 
                  </div>
                </div>

                <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                  <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="form-group">
                          <label className="labelform" >
                            Country
                          </label>
                          <span className="astrick">*</span>
                        <select id="datacountry" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12" 
                          value={this.state.countryCode} ref="countryCode" name="countryCode" onChange={this.handleChangeCountry.bind(this)} >
                          <option selected={true} disabled={true}>-- Select --</option>
                          <option value="IN">India</option>
                        </select>
                        <div className="datacountryError"></div>
                      </div>  
                    </div>

                    <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="form-group">
                          <label className="labelform" >
                            State
                          </label>
                          <span className="astrick">*</span>
                          <select id="Statedata" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12" 
                            value={this.state.stateCode} ref="stateCode" name="stateCode" onChange={this.handleChangeState.bind(this)} >
                            <option selected={true} disabled={true}>-- Select --</option>
                            {
                              this.state.stateArray && this.state.stateArray.length > 0 ?
                              this.state.stateArray.map((stateData, index)=>{
                                return(      
                                    <option key={index} value={stateData.stateCode}>{stateData.stateName}</option>
                                  );
                                }
                              ) : ''
                            }
                          </select>
                          <div className="StatedataError"></div>
                      </div>  
                    </div>

                    <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="form-group">
                          <label className="labelform" >
                            District
                          </label>
                          <span className="astrick">*</span>
                          <select id="districtData" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12" 
                            value={this.state.companyDist} ref="district" name="companyDist" onChange={this.handleChangeDistrict.bind(this)} >
                            <option selected={true} disabled={true}>-- Select --</option>
                            {  
                              this.state.districtArray && this.state.districtArray.length > 0 ?
                              this.state.districtArray.map((districtdata, index)=>{
                                return(      
                                    <option  key={index} value={districtdata.districtName}>{districtdata.districtName}</option>
                                  );
                                }
                              ) : ''
                            }
                          </select>
                          <div className="districtDataError"></div>
                      </div>  
                    </div>

                  </div>
                  <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                    <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="form-group">
                          <label className="labelform" >
                            Taluka
                          </label>
                          <span className="astrick">*</span>
                          <select id="Blocksdata" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12" 
                           value={this.state.taluka} ref="taluka" name="taluka" onChange={this.handleChange} >
                            <option selected="true" disabled="true">-- Select --</option>
                            {
                              this.state.blocksArray && this.state.blocksArray.length > 0 ?
                              this.state.blocksArray.map((blockdata, index)=>{
                                return(      
                                    <option  key={index} value={blockdata.blockName}>{blockdata.blockName}</option>
                                  );
                                }
                              ) : ''
                            }
                          </select>
                          <div className="BlocksdataError"></div>
                      </div>  
                    </div>

                    <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="form-group">
                          <label className="labelform" >
                            City
                          </label>
                          <span className="astrick">*</span>
                          <input
                            onChange={this.handleChange} 
                            type="text" name="companyCity" 
                            data-text="city"
                            value={this.state.companyCity}
                            className="form-control companyCity"/>

                      </div>  
                    </div>

                    <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="form-group">
                          <label className="labelform" >
                            Pincode
                          </label>
                          <span className="astrick">*</span>
                          <input
                            type="text" name="companyPincode" onChange={this.handlePincode.bind(this)}
                            data-text="pincode"
                            value={this.state.companyPincode}
                            className="form-control companyPincode" />
                            {this.state.pincodeExists ? null : <label className="error" style={{color: "red", fontWeight: "100"}}>This pincode does not exists!</label>}
                      </div>  
                    </div>
                  </div>

                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn button3 pull-right" id="btnCheck" onClick={this.submitCompanyLocation.bind(this)} >
                    {this.state.submitVal
                      ? "Submit" : "Update"
                    }  
                  </button>
                </div>
                </div>
              </div>
            </form>  
          </div>
        </div>
        <div className="tablebox">  
          <div className="table-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12 zeropadd">
            <table className="table iAssureITtable-bordered table-striped table-hover">
              <thead className="tempTableHeader">
                <tr className="">
                  <th className="umDynamicHeader srpadd textAlignCenter"> Company Location </th>
                  <th className="umDynamicHeader srpadd textAlignCenter"> Contact Number </th>
                  <th className="umDynamicHeader srpadd textAlignCenter"> State </th>
                  <th className="umDynamicHeader srpadd textAlignCenter"> District </th>
                  <th className="umDynamicHeader srpadd textAlignCenter"> City </th>
                  <th className="umDynamicHeader srpadd textAlignCenter"> Actions </th>

                </tr>
              </thead>
              <tbody>
              { this.state.allLoc &&  this.state.allLoc.length>0 ?
                this.state.allLoc.map( (locData, index)=>{
                 return( 
                  <tr>
                  
                    <td className="textAlignLeft">{locData.locationType}</td>
                    <td className="textAlignLeft">{locData.contactNumber}</td>
                    <td className="textAlignLeft">{locData.state}</td>
                    <td className="textAlignLeft">{locData.district}</td>
                    <td className="textAlignLeft">{locData.city}</td>

                    <td className="roleTextCenter">         
                      <i className="fa fa-pencil editTcon editIcon pointerCls" title="Edit" id={locData._id} onClick={this.editLoc.bind(this)} ></i>
                      &nbsp;&nbsp;
                      <i className="deleteIcon roleDelete  redFont fa fa-trash delIcon mar0 detailsCenter"  id="" title="Edit Department Name" data-toggle="modal" title="Delete" data-target={`#${locData._id}-rm`} ></i>
                    </td>

                    <div className="modal fade col-lg-12 col-md-12 col-sm-12 col-xs-12" id={`${locData._id}-rm`}  role="dialog">
                        <div className=" modal-dialog adminModal adminModal-dialog">
                          <div className="modal-content adminModal-content col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                            <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <h4 className="CreateTempModal col-lg-11 col-md-11 col-sm-11 col-xs-11" id="exampleModalLabel"></h4>
                              <div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
                                <button type="button" className="adminCloseButton" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                            </div>
                            <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                               <h4 className="blackFont textAlignCenter col-lg-12 col-md-12 col-sm-12 col-xs-12 examDeleteFont">Are you sure you want to delete this location?</h4>
                            </div>
                            <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
                               <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
                               </div>
                               <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <button id={locData._id} onClick={this.deleteLoc.bind(this)} type="button" className="btn examDelete-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">DELETE</button>
                               </div>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div className="modal fade col-lg-12 col-md-12 col-sm-12 col-xs-12" id={`${locData._id}-edit`}  role="dialog">
                    <div className=" modal-dialog adminModal adminModal-dialog">
                        <div className="modal-content adminModal-content col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                          <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <h4 className="CreateTempModal col-lg-11 col-md-11 col-sm-11 col-xs-11" id="exampleModalLabel"></h4>
                          <div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
                            <button type="button" className="adminCloseButton" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          </div>
                          <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <label className="textAlignLeft">Location </label>
                            <input type="text" ref="roleName" className="form-control rolesField" required/>
                          </div>
                          <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
                               <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
                               </div>
                               <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <button id={locData._id} onClick={this.editLoc.bind(this)} type="button" className="btn examDelete-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">SUBMIT</button>
                               </div>
                          </div>
                         </div>
                    </div>
                    </div>

                    <div id="edit" className="modal fade col-lg-12 col-md-12 col-sm-12 col-xs-12" role="dialog">
                      <div className="modal-dialog adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12" role="document">
                        <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                          <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <h4 className="WightFont textAlignCenter col-lg-11 col-md-11 col-sm-11 col-xs-11" id="exampleModalLabel1">Edit Role</h4>
                            <div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-12 NOpadding-left NOpadding-right">
                                <button type="button" className="adminCloseButton" data-dismiss="modal" data-target="edit">&times;</button>
                            </div>
                          </div>
                          <div className="modal-body addressModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                          <form className="editroles">
                            <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-xs-12 col-sm-12 paddingLeftz addRoleMarginBtm">
                              <label className="textAlignLeft">Location </label>
                              <input type="text" ref="roleName" className="form-control rolesField" required/>
                            </div>
                            <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <div className="form-group col-lg-4 col-lg-offset-8 col-md-4 col-md-offset-8 col-xs-12 col-sm-12">
                                <label>&nbsp;</label>
                                  <button type="button" id="" className="btn adminFinish-btn" data-dismiss="modal">Edit Role</button>
                              </div>
                            </div>
                          </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </tr>
                
                )
                
                })
              
              :
              <tr> <td colspan="7" align="center">No Data</td> </tr>
              }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default CompanyLocation;
