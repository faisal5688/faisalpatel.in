
var CalculatorController = function()
{
}

CalculatorController.initialize=function(){
	/*
	@calculator click events function
	*/
	$("#navigatorCalcBtn").click(function(){
	
	if(!$(this).parent().hasClass("disabled"))
		{
			trace("calculator");
				if(!$(this).hasClass("active")){			
					$(this).addClass("active");
					
					//For showing the calculator popup
					FunctionLibrary.showCalculatorPopup("#calculatorContainer");
					
					//uncomment the course to make the calculator draggable
					/*FunctionLibrary.setDraggablePopup("#calculatorContainer");*/
				}
				else{
					FunctionLibrary.hideCalculatorPopup("#calculatorContainer");
					$(this).removeClass("active");			
				}
		}
	});
	$("#calculatorContainer").draggable({ containment : '#containment', handle: "header"}); 
	//FunctionLibrary.setDraggablePopup($("#calculatorContainer"));
}



CalculatorController.fKeyPad = document.Keypad; 
CalculatorController.accumulate = 0;
CalculatorController.flagNewNum = false;
CalculatorController.pendingOp = "";

CalculatorController.numPressed	=	function(Num) {
	
	CalculatorController.fKeyPad = document.Keypad; 	
	if (CalculatorController.flagNewNum) {
	
	CalculatorController.fKeyPad.ReadOut.value  = Num;
	CalculatorController.flagNewNum = false;
	   }
	else {
	if (CalculatorController.fKeyPad.ReadOut.value == "0")
	CalculatorController.fKeyPad.ReadOut.value = Num;
	else
	CalculatorController.fKeyPad.ReadOut.value += Num;
	   }
}

CalculatorController.operation =	function(Op) {
	CalculatorController.fKeyPad = document.Keypad; 
	var Readout = CalculatorController.fKeyPad.ReadOut.value;
	if (CalculatorController.flagNewNum && CalculatorController.pendingOp != "=");
	else
	{
		CalculatorController.flagNewNum = true;
		if ( '+' == CalculatorController.pendingOp )
		CalculatorController.accumulate += parseFloat(Readout);
		else if ( '-' == CalculatorController.pendingOp )
		CalculatorController.accumulate -= parseFloat(Readout);
		else if ( '/' == CalculatorController.pendingOp )
		CalculatorController.accumulate /= parseFloat(Readout);
		else if ( '*' == CalculatorController.pendingOp )
		CalculatorController.accumulate *= parseFloat(Readout);
		else
		CalculatorController.accumulate = parseFloat(Readout);
		CalculatorController.fKeyPad.ReadOut.value = CalculatorController.accumulate;
		CalculatorController.pendingOp = Op;
	}
}

CalculatorController.decimal =	function() {
	CalculatorController.fKeyPad = document.Keypad; 
	var curReadOut = CalculatorController.fKeyPad.ReadOut.value;
	if (CalculatorController.flagNewNum) {
	curReadOut = "0.";
	CalculatorController.flagNewNum = false;
	   }
	else
	{
	if (curReadOut.indexOf(".") == -1)
	curReadOut += ".";
	   }
	CalculatorController.fKeyPad.ReadOut.value = curReadOut;
}

CalculatorController.clearEntry	=	function() {
	CalculatorController.fKeyPad = document.Keypad; 
	CalculatorController.fKeyPad.ReadOut.value = "0";
	CalculatorController.flagNewNum = true;
}

CalculatorController.clear	=	function() {
	CalculatorController.accumulate = 0;
	CalculatorController.pendingOp = "";
	CalculatorController.clearEntry();
}

CalculatorController.neg =	function() {
	CalculatorController.fKeyPad = document.Keypad; 
	CalculatorController.fKeyPad.ReadOut.value = parseFloat(CalculatorController.fKeyPad.ReadOut.value) * -1;
}

CalculatorController.percent = function() {
	CalculatorController.fKeyPad = document.Keypad; 
	CalculatorController.fKeyPad.ReadOut.value = (parseFloat(CalculatorController.fKeyPad.ReadOut.value) / 100) * parseFloat(CalculatorController.accumulate);
}