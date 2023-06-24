public class LM_LeaveManagementController {
    @auraEnabled
    public static List<Leave__c> getMyLeaveHistory(){
        
        List<Leave__c> lstLeave=[Select id, Name, Start_Date__c, End_Date__c,Leave_Type__c,Status__c, No_of_Days_Leave_Applied__c, Submitted_By__r.Leave__c 
                                 from Leave__c 
                                 ];
        
        System.debug('lstLeave :: '+lstLeave);
        return lstLeave; 
    }
    @auraEnabled
    public static Decimal getMyLeaveBalance(){
        Decimal myLeaveB; 
            for(Employee__c objEmployee : [Select id, Leave__c,Available_Leave__c from Employee__c
                         Where Employee_User_Lookup__c =: UserInfo.getUserId() LIMIT 1]){
                             myLeaveB = objEmployee.Available_Leave__c;
                
            }
        return myLeaveB; 
    }
    @auraEnabled
    public static List<teamLeaveReqWrapper> getTeamLeaveRequests(){ 
        List<teamLeaveReqWrapper> lstTeamLeaveReqWrapper = new List<teamLeaveReqWrapper>();
        id loggedInUserId = UserInfo.getUserId();
        Id loggedinUserRoleId = userInfo.getUserRoleId();
        set<Id> allSubRoleIds = getAllSubRoleIds(new Set<Id>{loggedinUserRoleId});
        System.debug(' loggedinUserRoleId'+loggedinUserRoleId);
        System.debug('all subRoleId'+allSubRoleIds);
        Map<Id,user> lstUsers = new Map<Id,User>([Select Id, Name from user where isActive =true AND UserRoleId IN :allSubRoleIds ]);
        for(Leave__c objLeave : [Select id, Name, Start_Date__c, End_Date__c,Leave_Type__c,Status__c, Submitted_By__r.Name, Comments__c,No_of_Days_Leave_Applied__c 
                                 from Leave__c 
                                 where Status__c ='Submitted for Approval' AND  Submitted_By__r.Employee_User_Lookup__c != :loggedInUserId  AND Submitted_By__r.Employee_User_Lookup__c IN:lstUsers.keyset() ]){
            teamLeaveReqWrapper objWrapper = new teamLeaveReqWrapper();
            objWrapper.Name = objLeave.Name;
            if(objLeave.Start_Date__c != null){
                string strStartDate = objLeave.Start_Date__c.format();
                objWrapper.StartDate = strStartDate;
            }
           if(objLeave.End_Date__c != null){
                string strEndDate = objLeave.End_Date__c.format();
                objWrapper.EndDate = strEndDate;
            }
             
             objWrapper.LeaveType = objLeave.Leave_Type__c;
             objWrapper.Status = objLeave.Status__c;
             objWrapper.Submitted_By = objLeave.Submitted_By__r.Name;
             objWrapper.Reason = objLeave.Comments__c;
             objWrapper.NoOfDaysLeaveApplied = String.valueOf(objLeave.No_of_Days_Leave_Applied__c);
             objWrapper.leaveId = objLeave.id;
            lstTeamLeaveReqWrapper.add(objWrapper);
        } 
        
        return lstTeamLeaveReqWrapper; 
    }
    public static Set<ID> getAllSubRoleIds(Set<ID> roleIds) {
        Set<ID> currentRoleIds = new Set<ID>();
        for(UserRole userRole :[select Id from UserRole where ParentRoleId IN :roleIds AND ParentRoleID != null])
            currentRoleIds.add(userRole.Id);
        if(currentRoleIds.size() > 0){
            currentRoleIds.addAll(getAllSubRoleIds(currentRoleIds));
        }
            
        return currentRoleIds;

    }
    
    @auraEnabled
    public static  void getCreateleave(String picklistVal, Date startDateValue, Date  endDatevalue, String ReasonValue){ 
        System.debug('picklistVal :: '+picklistVal);
        System.debug('startDateValue :: '+startDateValue);
        System.debug('endDatevalue :: '+endDatevalue);
        System.debug('ReasonValue :: '+ReasonValue);
        Id Empid =[Select id from Employee__c where Employee_User_Lookup__c =:UserInfo.getUserId() LIMIT 1].Id;
        System.debug('Empid :: '+Empid);
        Leave__c objLeave = new Leave__c();
        objLeave.Leave_Type__c =picklistVal;
        objLeave.Start_Date__c =startDateValue;
        objLeave.End_Date__c =endDatevalue;
        objLeave.Comments__c =ReasonValue;
        objLeave.Status__c ='Submitted for Approval';
        objLeave.Submitted_By__c=Empid;
        
        insert objLeave; 
            
     //create Leave record
    }
    
     @AuraEnabled(cacheable=true)
     public static List < customValueWrapper > pickListValueDynamically(sObject customObjInfo, string selectPicklistApi) {
         Schema.DescribeSObjectResult objDescribe = customObjInfo.getSObjectType().getDescribe();     
         map < String, Schema.SObjectField > customFieldMap = objDescribe.fields.getMap();      
         list < Schema.PicklistEntry > custPickValues = customFieldMap.get(selectPicklistApi).getDescribe().getPickListValues();
         list < customValueWrapper > customObjWrapper = new list < customValueWrapper > ();
         for (Schema.PicklistEntry myCustPick: custPickValues) {
             customValueWrapper selectOptionValueWrapper = new customValueWrapper();
             selectOptionValueWrapper.custFldlabel = myCustPick.getLabel();
             selectOptionValueWrapper.custFldvalue = myCustPick.getValue();
             customObjWrapper.add(selectOptionValueWrapper);
         }
        
        return customObjWrapper;
  
      }
    @auraEnabled
    public static  void  ApproveOrRejectLeave(List<String> setLeave, String strApproveReject){
        set<Id> setLeaveIds = new set<Id>();
        for(string strLeaveId :setLeave){
            setLeaveIds.add(strLeaveId);
        }
        List<Leave__c> lstLeaveToUpdate = new List<Leave__c>();
        for(Leave__c objLeave : [Select id, name, Status__c from Leave__c where Id IN :setLeaveIds ]){
            objLeave.Status__c = strApproveReject;
            lstLeaveToUpdate.add(objLeave);
        }
        update lstLeaveToUpdate;
        
        System.debug('setLeave :: '+setLeave);  
        //System.d('lstLeaveToUpdate :: '+lstLeaveToUpdate); 
        System.debug('strApproveReject :: '+strApproveReject);
    }
     // wrapper class 
        public with sharing class customValueWrapper {
          @auraEnabled public string custFldlabel {get;set;}
          @auraEnabled public string custFldvalue {get;set;}
        }
    public class teamLeaveReqWrapper{
        @auraEnabled
        public string Name;   
        @auraEnabled
        public string leaveId;  
        @auraEnabled
        public string NoOfDaysLeaveApplied; 
        @auraEnabled
        public string StartDate;
         @auraEnabled
        public string EndDate;
         @auraEnabled
        public string LeaveType;
         @auraEnabled
        public string Status;
        @auraEnabled
        public string Submitted_By;
         @auraEnabled
        public string Reason;
    }
}