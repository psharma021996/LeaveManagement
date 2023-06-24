trigger EmployeeTrigger on Employee__c (before insert, after insert) {
    if(trigger.IsInsert && Trigger.isbefore){
        EmployeeTriggerHandler.beforeInsert(trigger.new); 
       
            
            }
    if(trigger.IsInsert && Trigger.isafter){
         EmployeeTriggerHandler.afterInsert(trigger.new);  
       
    }
}