public class EmployeeTriggerHandler {
    public static void beforeInsert(List<Employee__c> triggernew){
        map<Id,Id> mapEmpIdsUserId = new map<id,id>();
        for(Employee__c objEmp : triggernew){
            if(objEmp.Date_of_Joining__c != null){
                Date dtJoiningDate = objEmp.Date_of_Joining__c;
       		Date dtEndYearDate = date.newInstance(dtJoiningDate.Year(),12,31);
        	Integer dy = dtJoiningDate.day();
        	Integer months;
        	months =dtJoiningDate.monthsBetween(dtEndYearDate); 
        	if(dy<15){
          	objEmp.Leave__c = (months*2)+2;  
        	}else{
            	objEmp.Leave__c = months*2;
        	}
       	mapEmpIdsUserId.put(objEmp.Id,objEmp.Employee_User_Lookup__c);
                
            }
            
    	}  
    }
    
    
    public static void afterInsert(List<Employee__c> triggernew){
         map<Id,Id> mapEmpIdsUserId = new map<id,id>();
        for(Employee__c objEmp : triggernew){
            mapEmpIdsUserId.put(objEmp.Id,objEmp.Employee_User_Lookup__c);
    	}  
        List<Employee__Share> lstempShare = new List<Employee__Share>();
        for(Employee__c objEmp : triggernew){
            Employee__Share objEmpShare  = new Employee__Share();
        	objEmpShare.AccessLevel ='edit';
        	objEmpShare.ParentId = objEmp.id; 
        	objEmpShare.UserOrGroupId  = mapEmpIdsUserId.get(objEmp.id);
        	lstempShare.add(objEmpShare);
    	}
    }

}