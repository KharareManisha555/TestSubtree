import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import _ from 'underscore';
import moment from 'moment';
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-react-dropdowns/styles/material.css";
import { CheckBoxSelection, Inject, MultiSelectComponent }  from '@syncfusion/ej2-react-dropdowns';
import "./AccessManagement.css";


class AccessManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
           rolesArray : [],
           allModules : []
        };
    }
    componentDidMount() {
        this.getRoles();
        this.getFacilitiesWithModules();

        axios.get('/api/accessmaster/get')
        .then((response) => {
            this.setState({ accessArray: response.data })
           var selectedRoles = []; 
            for (var i = 0; i < response.data.length; i++) {
                
                if (response.data[i].role != 'authuser' && response.data[i].role != 'admin') {
                    selectedRoles.push(response.data[i].role)
                }
                
                for (var k = 0; k < response.data[i].module.length; k++) {
                   console.log((response.data[i].module[k].module+response.data[i].role).split(' ').join('_'))
                   this.setState({
                    selectedRoles : selectedRoles,
                    [(response.data[i].module[k].module+response.data[i].role).split(' ').join('_')] : true,
                    [(response.data[i].module[k].facility+response.data[i].role).split(' ').join('_')] : true
                   })
                }
                
              //this.setState({[response.data[i].getAttribute("data-facilityroleref")] : true})
            }
            
        })
        .catch((error) => {
            console.log('error', error);
        })
    }
    getRoles(){
        axios.get('/api/roles/get/list')
        .then((response) => {

            var rolesArray = [];
            response.data.map((data, ind) => {
                if (data.role != "admin") {
                    rolesArray.push({ id: data._id, role: data.role })    
                }
                
            });

            this.setState({ rolesArray: rolesArray })

        })
        .catch((error) => {
            console.log('error', error);
        })
    }
    getFacilitiesWithModules(){
        
        axios.get('/api/modulemaster/get/groupbylist')
        .then((response) => {
            this.setState({ allModules: response.data })
        })
        .catch((error) => {
            console.log('error', error);
        })    
    }

    handleChangeRoles(event){
        console.log(event.value)
        this.setState({
            selectedRoles : event.value
        })
    }
    selectFacility(event){
        
        var moduleroleref = event.target.getAttribute("data-moduleroleref");
        var facilityroleref = event.target.getAttribute("data-facilityroleref");
        
        event.target.checked ? this.setState({[facilityroleref]:true,[moduleroleref]:true }) : this.setState({[facilityroleref]:false,[moduleroleref]:false})
    }
    onModuleChange(event){
        

        var moduleroleref = event.target.getAttribute("data-moduleroleref");
        
        event.target.checked ? this.setState({[moduleroleref]:true}) : this.setState({[moduleroleref]:false})
        
        var FacilityObject = document.querySelectorAll("#"+moduleroleref)
        console.log(FacilityObject)

        if (event.target.checked) {
            for (var i = 0; i < FacilityObject.length; i++) {
              console.log(FacilityObject[i].getAttribute("data-facilityroleref"))
              this.setState({[FacilityObject[i].getAttribute("data-facilityroleref")] : true})
            }
        }else{
            for (var i = 0; i < FacilityObject.length; i++) {
              console.log(FacilityObject[i].getAttribute("data-facilityroleref"))
              this.setState({[FacilityObject[i].getAttribute("data-facilityroleref")] : false})
            }
        }
        
    }
    submitData(event){
        event.preventDefault();
        // access : {
        //     role:
        //     modules: [{m1,sm1},{m1,sm2}]
        // }
        var checkedElem = $("input[type='checkbox']:checked");

        var selectedRoles = [];
        var access = [];

        for (var i = 0; i < checkedElem.length; i++) {
            selectedRoles.push(checkedElem[i].getAttribute('data-role'));
        }

        selectedRoles = _.uniq(selectedRoles)
        //console.log('selectedRoles',selectedRoles)

        for (var i = 0; i < selectedRoles.length; i++) {
            var modulesArray = [];
            var roleWiseModule = $('[data-role="' + selectedRoles[i] + '"]:checked') ;
            
            for (var j = 0; j < roleWiseModule.length; j++) {
               console.log('roleWiseModule',roleWiseModule[j] )
               //console.log('roleWiseModule',roleWiseModule[j].getAttribute('name') )
               
               if (roleWiseModule[j].getAttribute('name') == 'facility' ) {
                    modulesArray.push({module : roleWiseModule[j].getAttribute('data-module'), facility : roleWiseModule[j].value})
               }else if(roleWiseModule[j].getAttribute('name') == 'module'){
                    modulesArray.push({module : roleWiseModule[j].value })
               }
            }
            access.push({role:selectedRoles[i], module:modulesArray})
            //console.log('modulesArray',modulesArray)
        }

        access["createdBy"] = localStorage.getItem("user_ID");

        console.log('access',access)


        axios.post('/api/accessmaster/post', access)
            .then((response)=>{
                swal("Access for roles are defined");
            })
            .catch((error)=>{

            })
    }
    render() {
        //console.log(this.state)
        const rolesfields: object = { text: 'role', value: 'role' };
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <section className="content">
                        <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                            <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Access Management</h4>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <br/>
                            <form id="ContractManagement">
                                <div className="col-lg-3 col-md-12 col-xs-12 col-sm-12">
                                    <label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Roles</label>
                                    <MultiSelectComponent id="categoryChange" ref={(scope) => { this.dropDownListObject = scope; }} 
                                        dataSource={this.state.rolesArray} value={this.state.selectedRoles}
                                        change={this.handleChangeRoles.bind(this)} mode='box' 
                                        fields={rolesfields} placeholder="Select Roles" mode="CheckBox" 
                                        selectAllText="Select All" unSelectAllText="Unselect All" 
                                        showSelectAll={true}   hideSelectedItem={false} >
                                        <Inject services={[CheckBoxSelection]} />
                                    </MultiSelectComponent>

                                </div>
                                <div className="col-lg-3 col-md-12 col-xs-12 col-sm-12 pull-right">
                                    <button className="col-lg-8 col-md-2 col-sm-12 col-xs-12 btn button3 pull-right" id="submitbtn" onClick={this.submitData.bind(this)} >
                                        Submit
                                    </button>
                                </div>
                                <br/>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                                <br/>
                                <table className="table textAlignLeft AccessManagementTable">
                                <col width="60" />
                                    <thead>
                                        <tr>
                                            <th>Sr.No.</th>
                                            <th>List of Modules & Facilities</th>
                                            <th>Authenticated User</th>
                                            <th>Admin</th>
                                            {
                                                this.state.selectedRoles && this.state.selectedRoles.map((selRole,ind)=>{
                                                    return(<th>{selRole}</th>);
                                                })
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.allModules.map((data,index)=>{
                                            return(
                                                <tr>
                                                    <td><b>{index+1}</b></td>
                                                    <td>{data.modules[0].moduleName}
                                                    {   data.modules[0].facility.map((fc, ind)=>{
                                                            return(
                                                                <ul>
                                                                    <li>{fc.facility}</li>
                                                                </ul>
                                                                );
                                                        })
                                                    }
                                                        
                                                    </td>
                                                    <td>
                                                    <label className="checkboxLabel">
                                                    <input  type="checkbox" 
                                                        value={data.modules[0].moduleName} checked={this.state[(data.modules[0].moduleName+"authuser").split(' ').join('_')]}
                                                        name= "module" data-role="authuser" data-moduleroleref={(data.modules[0].moduleName+"authuser").split(' ').join('_')}
                                                        onChange={this.onModuleChange.bind(this)} />
                                                        <span className="checkmark"></span>
                                                    </label>

                                                    {   data.modules[0].facility.map((fc, ind)=>{
                                                            return(
                                                            <tr>
                                                               <label className="checkboxLabel" >
                                                               <input  type="checkbox" id={(data.modules[0].moduleName+"authuser").split(' ').join('_')}
                                                                onChange={this.selectFacility.bind(this)} data-role="authuser" data-module = {data.modules[0].moduleName}
                                                                    value={fc.facility} data-facilityroleref={(fc.facility+"authuser").split(' ').join('_')}
                                                                    data-moduleroleref={(data.modules[0].moduleName+"authuser").split(' ').join('_')}
                                                                    name= "facility" checked={this.state[(fc.facility+"authuser").split(' ').join('_')]}
                                                                    />
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            </tr>    
                                                                );
                                                        })
                                                    }
                                                    </td>

                                                    <td>
                                                    <label className="checkboxLabel">
                                                    <input  type="checkbox" 
                                                        value={data.modules[0].moduleName} checked={this.state[(data.modules[0].moduleName+"admin").split(' ').join('_')]}
                                                        name= "module" data-role="admin" data-moduleroleref={(data.modules[0].moduleName+"admin").split(' ').join('_')}
                                                        onChange={this.onModuleChange.bind(this)} />
                                                        <span className="checkmark"></span>
                                                    </label>

                                                    {   data.modules[0].facility.map((fc, ind)=>{
                                                            return(
                                                            <tr>
                                                               <label className="checkboxLabel">
                                                               <input  type="checkbox" id={(data.modules[0].moduleName+"admin").split(' ').join('_')}
                                                                onChange={this.selectFacility.bind(this)}  data-role="admin" data-module = {data.modules[0].moduleName}
                                                                    value={fc.facility} data-facilityroleref={(fc.facility+"admin").split(' ').join('_')}
                                                                    data-moduleroleref={(data.modules[0].moduleName+"admin").split(' ').join('_')}
                                                                    name= "facility" checked={this.state[(fc.facility+"admin").split(' ').join('_')]}
                                                                    />
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            </tr>    
                                                                );
                                                        })
                                                    }
                                                    </td>
                                                    {
                                                        this.state.selectedRoles && this.state.selectedRoles.map((selRole,ind)=>{
                                                            return (
                                                            <td>
                                                            <label className="checkboxLabel">
                                                            <input  type="checkbox" 
                                                                value={data.modules[0].moduleName} data-role={selRole} checked={this.state[(data.modules[0].moduleName+selRole).split(' ').join('_')]}
                                                                name= "module" data-moduleroleref={(data.modules[0].moduleName+selRole).split(' ').join('_')}
                                                                onChange={this.onModuleChange.bind(this)} />
                                                                <span className="checkmark"></span>
                                                            </label>

                                                            {   data.modules[0].facility.map((fc, ind)=>{
                                                                    return(
                                                                    <tr>
                                                                       <label className="checkboxLabel">
                                                                       <input  type="checkbox" id={(data.modules[0].moduleName+selRole).split(' ').join('_')}
                                                                        onChange={this.selectFacility.bind(this)} data-role={selRole} data-module = {data.modules[0].moduleName}
                                                                            value={fc.facility} data-facilityroleref={(fc.facility+selRole).split(' ').join('_')}
                                                                            data-moduleroleref={(data.modules[0].moduleName+selRole).split(' ').join('_')}
                                                                            name= "facility" checked={this.state[(fc.facility+selRole).split(' ').join('_')]}
                                                                             />
                                                                            <span className="checkmark"></span>
                                                                        </label>
                                                                    </tr>    
                                                                        );
                                                                })
                                                            }
                                                            </td>
                                                            )
                                                        })
                                                    }
                                                    
                                                </tr>

                                                );
                                        }) 
                                    }

                                        
                                    </tbody>
                                </table>            
                                </div>
                            </form>
                            </div>
                            </div> 

                    </section> 
                    </div>   
                </div>   
             </div>   
            )         
    }
}
export default AccessManagement;    