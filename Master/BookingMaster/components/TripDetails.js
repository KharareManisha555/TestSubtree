import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import {withRouter}  		  from 'react-router-dom';
import swal                   from 'sweetalert';
import _                      from 'underscore';
import 'bootstrap/js/tab.js';
class SingleEmployeeDetails extends Component {
	
	constructor(props) {
      super(props);
    
      this.state = {
      	id : '',
        loadMore: false,
        loadless: false
      };
      this.camelCase = this.camelCase.bind(this);
      this.isLoaded = false
    }
  componentWillReceiveProps(nextProps){
    	this.setState({
  			id : nextProps.personID
  		},()=>{
  			console.log("id",this.state.id);

  			axios.get("/api/personmaster/get/one/"+this.state.id)
            .then((response)=>{
              this.setState({
                  personInfo : response.data,
                  type : response.data.type
              },()=>{
            
              });
            })
            .catch((error)=>{
            })
  		})
    }
	componentDidMount(){
		
		this.setState({
  			id : this.props.id
  		},()=>{

  			axios.get("/api/personmaster/get/one/"+this.state.id)
            .then((response)=>{
          	
              this.setState({
                  personInfo : response.data,
                  type : response.data.type
              },()=>{
           
              });
            })
            .catch((error)=>{
            })
  		})
  	}
    camelCase(str) {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
	render() {

       	return (	
		        <div>
		            <div className="row">	
                {
                  this.state.personInfo ?
                                   					  
					        <div id="supplierprofile" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxshade nopadding">					   
					        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-child={this.state.personInfo._id} id={this.state.personInfo._id}>
  										<h5 className="titleprofileTD col-lg-8">Trip Details</h5>
    									<label className="col-lg-12 outStatioon">Outstation  - Round Trip</label>
                      <label className="col-lg-12 outStatioon">Pickup</label>
  										<ul className="col-lg-12 col-md-5 col-sm-5 col-xs-5 listfontED ">
  											<li><i className="fa fa-user-o " aria-hidden="true"></i>&nbsp;&nbsp; Address : Amanora Chambers, Magarpatta, Pune.</li>
  											<li><i className="fa fa-envelope " aria-hidden="true"></i>&nbsp;&nbsp;Datetime :  Fri 03 Jan 20 | 10:00 AM</li>
  										</ul> 
                      <label className="col-lg-12 outStatioon">Destination</label>
                      <ul className="col-lg-12 col-md-5 col-sm-5 col-xs-5 listfontED ">
                        <li><i className="fa fa-user-o " aria-hidden="true"></i>&nbsp;&nbsp; Address :  Lokhandwala, Andheri West Mumbai.</li>
                      </ul>
                      <label className="col-lg-12 outStatioon">Return On</label>
                      <ul className="col-lg-12 col-md-5 col-sm-5 col-xs-5 listfontED ">
                        <li><i className="fa fa-user-o " aria-hidden="true"></i>&nbsp;&nbsp; DateTime :   Sun 05 Jan 20, 11:00 PM</li>
                      </ul>
									  </div>
					        </div>
                  :
                  null
                }
	             </div>
	         </div>
	       : null
	    );
	} 
}
export default withRouter(SingleEmployeeDetails); 
