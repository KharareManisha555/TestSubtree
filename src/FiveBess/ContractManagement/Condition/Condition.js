import React, { Component } from 'react';
import $ from 'jquery';
import CKEditor 				  from "react-ckeditor-component";
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import _ from 'underscore';
import 'bootstrap/js/tab.js';
import 'react-phone-input-2/lib/style.css';

class Condition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "conditions"                : ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    componentDidMount() {
        this.getCondition();
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
            contractID      : this.props.match.params.contractID,
            conditions      : this.state.content,
        }
        axios.patch("/api/contract/patch/addcondition", formValue)
        .then((response)=>{
            swal("Terms & Condition added successfully.");
            this.getCondition();
            this.props.history.push("/viewcontract/"+this.props.match.params.contractID);
        })
        .catch((error)=>{

        })
    }
    componentWillReceiveProps(nextProps) {
        this.edit();
        this.handleChange = this.handleChange.bind(this);
    }
    edit() {
        var contractID = this.state.contractID;
        if(contractID){
            axios.get('/api/contract/get/one/' + contractID)
            .then((response) => {
                this.setState({
                    "contractID"                  : this.props.match.params.contractID,
                    "content"                     : response.data.conditions,
                })
            })
            .catch((error) => {
            })
        } 
    }
    
    getCondition(){
        axios.get("/api/contract/get/one/"+this.props.match.params.contractID)
        .then((response)=>{
            this.setState({
                conditions : response.data.conditions
            })
        })
        .catch((error)=>{

        })
    }
    delete(){
        var formValue = {
            contractID      : this.props.match.params.contractID,
            conditions      : "",
        }
        axios.patch("/api/contract/patch/addcondition", formValue)
        .then((response)=>{
            swal("Terms & Condition deleted successfully.");
            this.setState({
                "content"                     : "",
            })
            this.getCondition();
        })
        .catch((error)=>{

        })
    }
    onChange(evt){
        var newContent = evt.editor.getData();
        this.setState({
          content: newContent
        },()=>{
            if(this.state.content){
                this.setState({
                    messageError : ''
                });
            }else{
                this.setState({
                    messageError : 'This field is required'
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
                                        
                                        <li className="active col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn1 disabled">
                                            <div className="triangletwo" id="triangle-right1"></div>
                                            <a href="" className="basic-info-pillss pills backcolor">
                                                <i className="fa fa-paste iconMarginLeft" aria-hidden="true"></i>&nbsp;
                                                Conditions
                                            </a>
                                            <div className="triangleone triangleones" id="triangle-right"></div>
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
                                            <form id="Condition">
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 submitForm">
                                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                                            <br />
                                                        </div>
                                                        <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                        <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12">Terms & Conditions <sup className="astrick">*</sup></label>
                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                <CKEditor activeClass="p15" id="editor"  className="conditions" content={this.state.content} events={{"change": this.onChange}}/>
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
                                        {
                                            this.state.conditions ?
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 foothd">
                                                        <h4 className="MasterBudgetTitle">Terms & Condition</h4>
                                                    </div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                        <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-12 boxul1">
                                                            <div className="liheader1 col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                            </div>
                                                            <ul className="col-lg-10 col-md-10 col-sm-10 col-xs-10 palfclr addrbox">
                                                                <li dangerouslySetInnerHTML={{'__html' : this.state.conditions}}></li>
                                                            </ul>
                                                            <div className="liheader1 dropdown col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                                                <i className="fa fa-ellipsis-h dropbtn" aria-hidden="true"></i>
                                                                <div className="dropdown-content dropdown-contentLocation">
                                                                    <ul className="pdcls ulbtm">
                                                                        <li>
                                                                            <a href={"/condition/"+ this.props.match.params.contractID}><i className="fa fa-pencil penmrleft" aria-hidden="true"></i>&nbsp;&nbsp;Edit</a>
                                                                        </li>
                                                                        <li>
                                                                            <span onClick={this.delete.bind(this)} id={this.props.match.params.contractID}><i className="fa fa-trash-o" aria-hidden="true"></i> &nbsp; Delete</span>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            null
                                        }
                                        
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
export default Condition;