import React, { Component } from 'react';
import { render }           from 'react-dom';
import TimePicker           from 'rc-time-picker';
import moment               from 'moment';
import jQuery               from 'jquery';
import $                    from 'jquery';
import OneFieldForm         from '../OneFieldForm/OneFieldForm.js';
import 'rc-time-picker/assets/index.css';

const format = "h:mm a";
class Module extends Component{
   constructor(props) {
    super(props);
    this.state = {
      "tableHeading": {
          moduleName   : "Module",
          actions  : 'Action',
      },
      "tableObjects": {
          deleteMethod    : 'delete',
          apiLink         : '/api/modulemaster/',
          paginationApply : false,
          searchApply     : false,
          editUrl         : '/module'
      },
      "startRange"    : 0,
      "limitRange"    : 10,
      "fields" : {
        placeholder   : "Enter module name..",
        title         : "Module",
        attributeName : "moduleName"
      }
    };
  }
  componentDidMount(){
    
 
  }
  componentDidMount() {
      var editId = this.props.match.params.fieldID;
     
      this.setState({
          editId: editId
      })
      var editId = this.props.match.params.fieldID;
      window.scrollTo(0, 0);
  }
   componentWillReceiveProps(nextProps) {
      var editId = nextProps.match.params.fieldID;
      if (nextProps.match.params.fieldID) {
          this.setState({
              editId: editId
          })
      }
  }
 
  render(){
    return(
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
              <div>
               <OneFieldForm fields={this.state.fields}
                              tableHeading={this.state.tableHeading}
                              tableObjects={this.state.tableObjects}
                              editId ={this.props.match.params.fieldID}
                              history={this.props.history} />
              </div>
          </div>       
    );
  }
 }

 export default Module;