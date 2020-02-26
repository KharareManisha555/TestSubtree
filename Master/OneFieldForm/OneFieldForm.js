import React, { Component } from 'react';
import $                    from 'jquery';
import jQuery               from 'jquery';
import IAssureTable         from '../../IAssureTable/IAssureTable.jsx';
import axios                from 'axios';
import swal                 from 'sweetalert';
import { withRouter }       from 'react-router-dom';
import _                    from 'underscore';
import 'bootstrap/js/tab.js';
import './OneField.css'
var apiLink = "";
class OneFieldForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "user_ID"   : "",
            "startRange": 0,
            "limitRange": 10,
            "editId"    :  '',
            "fieldValue" : ""
        };
    }
    componentDidMount() {
        apiLink =  this.props.tableObjects.apiLink;
        const user_ID = localStorage.getItem("user_ID")
        this.setState({
            user_ID : user_ID,
        })
        this.getData(this.state.startRange, this.state.limitRange);
         jQuery.validator.setDefaults({
          debug: true,
          success: "valid"
        });
        $("#vendorLocationType").validate({
          rules: {
            OneFieldInput: {
              required: true
            },
          },
          errorPlacement: function (error, element) {
            if (element.attr("name") == "OneFieldInput") {
              error.insertAfter("#OneFieldInput");
            }
          }
        });
    }
   
    componentWillReceiveProps(nextProps) {
        
        if(nextProps.editId){
            this.edit(nextProps.editId);
        }else{
            this.setState({
                fieldName: "",
                editId: ""
            })
        }

  
    }
    handleChange(event) {
        event.preventDefault();
        const target = event.target;
        const name = target.name;
        var fieldName = this.props.fields.attributeName
        this.setState({
            fieldName : event.target.value
        });

    }
    submitType(event) {
        event.preventDefault();
        if(this.props.editId)
        {
            var formValues ={
                "fieldID"       : this.props.editId,
                "fieldValue"    : this.state.fieldName,
                "updatedBy"     : this.state.user_ID
            }
        if ($('#vendorLocationType').valid()) {
            axios.patch(apiLink+'/patch', formValues)
                .then((response) => {
                    this.setState({
                        fieldName: "",
                        editId: ""
                    },()=>{
                        this.props.history.push(this.props.tableObjects.editUrl);
                    })
                    this.getData(this.state.startRange, this.state.limitRange);
                    swal(this.props.fields.title+" updated sucessfully");
                })
                .catch((error) => {
                })
        }
        }else
        {
            var formValues = {
                "fieldValue": this.state.fieldName,
                "createdBy" : this.state.user_ID
            }
        if ($('#vendorLocationType').valid()) {
            
            axios.post(apiLink+'post', formValues)
                .then((response) => {
                     console.log(response.data)
                    if (response.data.created) {
                        swal(this.state.fieldName+" "+this.props.fields.title+" submitted sucessfully");
                    }else{
                        swal(this.state.fieldName+" "+this.props.fields.title+" already exists");
                    }
                    this.getData(this.state.startRange, this.state.limitRange);
                    this.setState({
                       fieldName: ""
                     })
                })
                .catch((error) => {
                    
                })
        }

        }
      
    }
    updateType(event) {
        event.preventDefault();
            
    }
    getDataCount() {
        axios.get('/api/vendorLocationType/get/count')
            .then((response) => {
               
                this.setState({
                    dataCount: response.data.dataCount
                })
            })
            .catch((error) => {
                
            });
    }
    getData(startRange, limitRange) {
        var data = {
            startRange: startRange,
            limitRange: limitRange
        }
        axios.post(apiLink+'/get/list', data)
            .then((response) => {
                this.setState({
                    tableData: response.data
                })

            })
            .catch((error) => {
                
            });
    }
    edit(id) {
        $('label.error').html('')
        var fieldName = this.props.fields.attributeName;
        axios.get(apiLink+'get/one/' + id)
            .then((response) => {
                if (response.data) {
                    this.setState({
                        "fieldName": response.data[fieldName],
                    });
                }
            })
            .catch((error) => {
                
            });
    }

    render() {
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
                        <section className="content">
                            <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                    <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">{this.props.fields.title == "Fuel Type" || this.props.fields.title == "Vehicle Category" ||this.props.fields.title == "Package Type"? this.props.fields.title : this.props.fields.title } </h4>
                                </div>
                                <section className="Content">
                                    <div className="row">
                                        <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-12 col-xs-12">
                                            <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="vendorLocationType" onSubmit={this.submitType.bind(this)} >
                                                <div className="form-margin col-lg-8 col-lg-offset-2 col-md-6 col-sm-12 col-xs-12 pdcls">
                                                   <div id="OneFieldInput">
                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">{this.props.fields.title} <i className="astrick">*</i></label>
                                                        <input type="text"  className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.fieldName} ref={this.props.fields.attributeName} name="OneFieldInput" onChange={this.handleChange.bind(this)} placeholder={this.props.fields.placeholder} />
                                                    </div>
                                                </div>
                                                <br />
                                                <div className="form-margin col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                    {/* <button onClick={this.submitType.bind(this)} className="btn button3 pull-right">Submit</button>

                                                    {this.state.editId ?
                                                        <button onClick={this.updateType.bind(this)} className="btn button3 pull-right">Update</button>
                                                        :
                                                        <button onClick={this.submitType.bind(this)} className="btn button3 pull-right">Submit</button>
                                                    }*/}
                                                </div>
                                            </form>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <IAssureTable
                                                tableHeading={this.props.tableHeading}
                                                twoLevelHeader={this.state.twoLevelHeader}
                                                dataCount={this.state.dataCount}
                                                tableData={this.state.tableData}
                                                getData={this.getData.bind(this)}
                                                tableObjects={this.props.tableObjects}
                                            />
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
export default withRouter(OneFieldForm)


