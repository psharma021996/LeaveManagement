({
	applyForLeaveMethod : function(component, event, helper) {
		component.set("v.bApplyForLeave","true");
        component.set("v.bLeaveHistory","false");
        component.set("v.bLeaveReq","false");
	},
    myleaveHistoryMethod : function(component, event, helper) {
        component.set("v.bApplyForLeave","false");
        component.set("v.bLeaveHistory","true");
        component.set("v.bLeaveReq","false");
        component.set('v.mycolumns', [
            { label: 'Leave Start Date', fieldName: 'Start_Date__c' },
            { label: 'Leave End Date', fieldName: 'End_Date__c' },
            { label: 'No. of Days', fieldName: 'No_of_Days_Leave_Applied__c' },
            { label: 'Leave Type', fieldName: 'Leave_Type__c' },
            { label: 'Status', fieldName: 'Status__c' }
            ]);
        var action = component.get("c.getMyLeaveHistory");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.myleaveHistoy", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
		
	},
    teamLeaveRequestMethod : function(component, event, helper) {
        component.set("v.bApplyForLeave","false");
        component.set("v.bLeaveHistory","false");
        component.set("v.bLeaveReq","true");
        component.set('v.TeamLeaveRequestColumns', [
            { label: 'Leave Start Date', fieldName: 'Start_Date__c' },
            { label: 'Leave End Date', fieldName: 'End_Date__c' },
            { label: 'No. of Days', fieldName: 'No_of_Days_Leave_Applied__c' },
            { label: 'Leave Type', fieldName: 'Leave_Type__c' },
            { label: 'Status', fieldName: 'Status__c' }
            ]);
		
	}
})