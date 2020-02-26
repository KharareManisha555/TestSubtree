import React, { Component }     from 'react';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import axios                    from 'axios';
import swal                     from 'sweetalert';
import TimePicker               from 'rc-time-picker';
import moment                   from 'moment';

import _                        from 'underscore';
import 'bootstrap/js/tab.js';
const format = "h:mm a";

class BookingForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDiv                 : false,
            toggleButtonValue       :"Round Trip",
            fromTime                :"",
            toTime                  :"",
            valueOfTab              :this.props.valueOfTab,
            idOfTab                 :this.props.idOfTab,
        };
    }
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    componentWillReceiveProps(nextProps) {
        
    }
    handleChange(event)
    {
        event.preventDefault();
        const target = event.target;
        const name = target.name;

        this.setState({
          [name]: event.target.value
        });
    }
    submitData(event)
    {
        event.preventDefault();
        this.setState({
            showDiv : true,
               //packageTypeId           : req.body.packageTypeId,
                //packageId               : req.body.packageId,
                  
                // vehicleCategoryId       : req.body.vehicleCategoryId,
                // employeeId              : req.body.employeeId,
                // corporateId             : req.body.corporateId,
                // managerId               : req.body.managerId,
                // intermediateStops       : req.body.intermediateStops,
                // status                  : req.body.status,
                // createdBy               : req.body.createdBy,
        })
        var formValues={

                tripType                : this.state.toggleButtonValue,
                from                    : this.state.from,
                to                      : this.state.to,
                pickupDate              : this.state.pickupDate,
                pickupTime              : this.state.fromTime,
                returnDate              : this.state.returnDate,
                returnTime              : this.state.toTime,
        }
        console.log("formValues",formValues);

    }
    getSelectedTrip(val,event) {

        this.setState({
          toggleButtonValue : val
        })
    }
    fromTime(value) {
        this.setState({
          fromTime: value
        })
    }
    toTime(value) {
        this.setState({
          toTime: value
        })
    }
    render() {
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
               
                 <div className={this.state.showDiv ? "col-lg-6 col-md-6 col-sm-6 col-xs-6 showDivOnClick": "col-lg-6 col-md-6 col-sm-6 col-xs-6 hideUntilClick"} >
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pickupType nopadding">
                        <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 customLabelCar nopadding"> Select Car</label>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 premiumCar carContainer nopadding">
                            <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 headCar textAlignCenter"> Premium</label>
                            <h6 className="col-lg-12 col-md-12 col-sm-12 col-xs-12 textAlignCenter">Seat Capacity : 4+1</h6>
                            <img src="/images/premiumCar.png"/>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <button className="col-lg-10 col-lg-offset-1 col-md-2 col-sm-12 col-xs-12 btn button3" id="btnCheck" onClick={this.submitData.bind(this)} >
                                Book Now
                              </button>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 miniCar carContainer nopadding">
                            <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 headCar textAlignCenter"> Mini</label>
                            <h6 className="col-lg-12 col-md-12 col-sm-12 col-xs-12 textAlignCenter">Seat Capacity : 4+1</h6>
                            <img src="/images/premiumCar.png"/>
                             <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <button className="col-lg-10 col-lg-offset-1 col-md-2 col-sm-12 col-xs-12 btn button3" id="btnCheck" onClick={this.submitData.bind(this)} >
                                Book Now
                              </button>
                            </div>

                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 premiumCar carContainer nopadding">
                            <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 headCar textAlignCenter"> SUV</label>
                            <h6 className="col-lg-12 col-md-12 col-sm-12 col-xs-12 textAlignCenter">Seat Capacity : 7+1</h6>
                            <img src="/images/premiumCar.png"/>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <button className="col-lg-10 col-lg-offset-1 col-md-2 col-sm-12 col-xs-12 btn button3" id="btnCheck" onClick={this.submitData.bind(this)} >
                                Book Now
                              </button>
                            </div>

                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 miniCar carContainer nopadding">
                            <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 headCar textAlignCenter"> Sedan</label>
                            <h6 className="col-lg-12 col-md-12 col-sm-12 col-xs-12 textAlignCenter">Seat Capacity : 4+1</h6>
                            <img src="/images/premiumCar.png"/>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <button className="col-lg-10 col-lg-offset-1 col-md-2 col-sm-12 col-xs-12 btn button3" id="btnCheck" onClick={this.submitData.bind(this)} >
                                Book Now
                              </button>
                            </div>

                        </div>
                    </div>
                </div>
        </div>
        );
    }
}
export default BookingForm;

