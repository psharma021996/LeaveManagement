import { LightningElement, api , track, wire } from 'lwc';
import ApxmyLeaveHistory from "@salesforce/apex/LM_LeaveManagementController.getMyLeaveHistory";
import myteamLeaveRequests from "@salesforce/apex/LM_LeaveManagementController.getTeamLeaveRequests";
import myLeaveBalance from "@salesforce/apex/LM_LeaveManagementController.getMyLeaveBalance";
import pickListValueDynamically from '@salesforce/apex/LM_LeaveManagementController.pickListValueDynamically';
import ApxgetCreateleave from '@salesforce/apex/LM_LeaveManagementController.getCreateleave';
import ApxApproveOrRejectLeave from '@salesforce/apex/LM_LeaveManagementController.ApproveOrRejectLeave';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class LM_LeaveManagement extends LightningElement {
    //variables to save data in Leave
    @track startDateValue;
    @track endDatevalue;
    @track ReasonValue;
    @track picklistVal;
    applyforLeave = true;
    bmyLeaveHistory = false;
    bTeamLeaveRequest = false;
    leaveHistory =[]; 
    TeamLeaveRequests =[];
    TeamLeaveRowSelected=false;
    varMyleaveBalance;
    selectedRows =[];
    setofApproveOrRejectLeaveId =[];
    @wire(pickListValueDynamically, {customObjInfo: {'sobjectType' : 'Leave__c'},
    selectPicklistApi: 'Leave_Type__c'}) selectTargetValues;

    MyLeaveHistoryColumns = [
        { label: 'Leave Start Date', fieldName: 'Start_Date__c' },
        { label: 'Leave End Date', fieldName: 'End_Date__c' },
        { label: 'No. of Days', fieldName: 'No_of_Days_Leave_Applied__c' },
        { label: 'Leave Type', fieldName: 'Leave_Type__c' },
        { label: 'Status', fieldName: 'Status__c' }
    ];    
    LeaveType = [
        { label: 'Casual', fieldName: 'Casual' },
        { label: 'Sick', fieldName: 'Sick' },
        { label: 'No. of Days', fieldName: 'No_of_Days_Leave_Applied__c' }
    ];
    TeamLeaveRequestColumns = [
        { label: 'EmployeeName', fieldName: 'Submitted_By' },
        { label: 'Leave Start Date', fieldName: 'StartDate' },
        { label: 'Leave End Date', fieldName: 'EndDate' },
        { label: 'No. of Days', fieldName: 'NoOfDaysLeaveApplied' },
        { label: 'Reason', fieldName: 'Reason' }
    ];
    selectOptionChanveValue(event){       
        this.picklistVal = event.target.value;
    }  
    applyForLeaveMethod(event){
        this.applyforLeave =true;
        this.bmyLeaveHistory = false;
        this.bTeamLeaveRequest = false;  
    }
    myleaveHistoryMethod(event){
        this.applyforLeave =false;
        this.bmyLeaveHistory = true;
        this.bTeamLeaveRequest = false;  
    }
    teamLeaveRequestMethod(event){
        this.applyforLeave =false;
        this.bmyLeaveHistory = false;
        this.bTeamLeaveRequest = true;  
    }
    enableApproveButton(event){
        this.selectedRows = event.detail.selectedRows;

        this.TeamLeaveRowSelected =true;
        /*ApxApproveOrRejectLeave({lstLeave : this.selectedRows, strApproveReject: 'Approve' }).then(result=>{
            //calling approve method
        }) */
    }
    approveLeaveM(event){
        var varApprove ='Approved';
        let message ='You have Approved the Leaves';
        for(var i=0;i<this.selectedRows.length;i++){
            let dataParse = this.selectedRows[i].leaveId;
            this.setofApproveOrRejectLeaveId.push(dataParse);            
        }
        ApxApproveOrRejectLeave({setLeave :  this.setofApproveOrRejectLeaveId, strApproveReject: varApprove }).then(result=>{
            setTimeout(() =>{
                this.fetchmyLeaveHistory();
                this.fetchmyteamLeaveRequests();
                this.fetchmyLeaveBalance();
            },200)
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Sucess',
                    message,
                    variant: 'Sucess',
                }),
            );
        })
    }
    rejectLeaveM(event){
        var varReject ='Rejected';
        let message ='You have Rejected the Leaves';
        for(var i=0;i<this.selectedRows.length;i++){
            let dataParse = this.selectedRows[i].leaveId;
            this.setofApproveOrRejectLeaveId.push(dataParse);            
        }
        ApxApproveOrRejectLeave({setLeave :  this.setofApproveOrRejectLeaveId, strApproveReject: varReject }).then(result=>{
            setTimeout(() =>{
                this.fetchmyLeaveHistory();
                this.fetchmyteamLeaveRequests();
                this.fetchmyLeaveBalance();
            },200)
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Sucess',
                    message,
                    variant: 'Sucess',
                }),
            );
        })
    }
    connectedCallback(){
        this.fetchmyLeaveHistory();
        this.fetchmyteamLeaveRequests();
        this.fetchmyLeaveBalance();
    }
    fetchmyLeaveHistory(){
        ApxmyLeaveHistory().then(result =>{
            console.log(result);
            this.leaveHistory=result;
            console.log('leaveHistory '+this.leaveHistory);
        }) 
    }
    fetchmyteamLeaveRequests(){        
        myteamLeaveRequests().then(result =>{
            console.log(result);
            this.TeamLeaveRequests=result;
            /*for(let i =0; result.length;i++){
                console.log(result[0]);
            }*/
            console.log('TeamLeaveRequests '+this.TeamLeaveRequests);
            console.log('TeamLeaveRequests '+JSON.stringify(this.TeamLeaveRequests));
        })  
    }
    fetchmyLeaveBalance(){        
        myLeaveBalance().then(result =>{
            console.log('result :: '+result);
            this.varMyleaveBalance=result;
            /*for(let i =0; result.length;i++){
                console.log(result[0]);
            }*/
            console.log('varMyleaveBalance '+this.varMyleaveBalance);
        })  
    }
    handleStartDateChange(event){
        this.startDateValue = event.target.value;
       // console.log(this.picklistVal);
    }
    handleEndDateChange(event){
        this.endDatevalue = event.target.value;
        //console.log(this.picklistVal);
    }
    handleReasonChange(event){
        this.ReasonValue = event.target.value;
    }
    BlankPopulatedValue(event){
        this.picklistVal ='';
        this.startDateValue='';
        this.endDatevalue='' ;
        this.ReasonValue='';
    }
    createLeaveRecord(){

        console.log(this.picklistVal);
        console.log(this.startDateValue);
        console.log(this.endDatevalue);
        console.log(this.ReasonValue);
        var enddate = new Date(this.endDatevalue);
        var startdate = new Date(this.startDateValue);
        var Difference_In_Time = enddate.getTime() - startdate.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        console.log(Difference_In_Days);
        let message ='You do not have enough leave balance .Please reduce some days';
        if(Difference_In_Days>this.varMyleaveBalance){
            console.error("You do not have enough leave");
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message,
                    variant: 'error',
                }),
            );
            this.picklistVal ='';
            this.startDateValue='';
            this.endDatevalue='' ;
            this.ReasonValue='';
        }else{
            let message ='Your leave request has been submitted sucessfully'
            ApxgetCreateleave({picklistVal: this.picklistVal, startDateValue: this.startDateValue,
                endDatevalue: this.endDatevalue, ReasonValue: this.ReasonValue
            
            }).then((result)=>{
                setTimeout(() =>{
                    this.fetchmyLeaveHistory();
                    this.fetchmyteamLeaveRequests();
                    this.fetchmyLeaveBalance();
                },200)
               const evt = new ShowToastEvent({
                title: "Sucess",
                message,
                variant: "Sucess",

               });
               this.picklistVal ='';
               this.startDateValue='';
               this.endDatevalue='' ;
               this.ReasonValue='';
                console.log(result);
    
                //give success message
            })
        }
       
       

    }
    
}