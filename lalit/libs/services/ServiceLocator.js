/** Service Locator, will have all the server  
 * 
 */

var ServiceLocator = function(){	
    this.callToServer = function(url, successHandler, errorHandler, isSync, loadDataType){
		$.ajax(
            {
            	url:url,
                async:isSync,
                dataType:loadDataType,
                success:successHandler,
                error:errorHandler
            });
    }
}