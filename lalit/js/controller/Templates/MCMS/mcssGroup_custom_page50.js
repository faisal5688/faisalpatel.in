var mcssGroup = function(){
	var options = new Array();
	this.callBackFn;
	var attemptCount = 0;
	var nextCount = 1;
	var tabId = 1;
	var self = this;
	this.data = null;
	var optionStartIndex = [0, 10, 19];
	var visitedTab = [0,0,0,];
	this.initTemplate = function(data, callBackFn){
		this.callBackFn = callBackFn;
		this.data = choicesData = data;
		$('#mcssSubmitBtn').addClass("disabled").hide();
		$("#contentHolder").prepend("<div class='page_title'></div>");
		$('.page_title').html(DataManager.TOCData[currentPageLocationIndex].title);
		$(".tab").addClass('disabled');
		$("#tab_1").removeClass('disabled').addClass('enabledtab');
		$(".tab").on("click",function(){
			if(!$(this).hasClass('disabled') && !$(this).hasClass('selected')){
				$('#mcssSubmitBtn').show();
				$(".tab").removeClass('selected');
				$(this).addClass('selected');
				tabId = parseInt($(this).attr('id').split('_')[1]);
				var prevCount = nextCount;
				nextCount++;
				var optionslyr = '';
				optionslyr += '<table width="100%" border="0" cellspacing="0" cellpadding="0" id="itemTabls">'; 
				optionslyr += '<tr class="HeadTop">'; 
				optionslyr += '<td align="center" class="left_col" valign="top" width="33%"></td>'; 
				for(var j = 0; j < self.data.choices.length; j++) {
					optionslyr += '<td align="center" valign="top" width="7%">' + self.data.choices[j] + '</td>'; 
				};
				optionslyr += '<td align="center" class="left_col" valign="top" width="33%"></td>';
				for(var j = 0; j < self.data.choices.length; j++) {
					optionslyr += '<td align="center" valign="top" width="7%">' + self.data.choices[j] + '</td>'; 
				};
				optionslyr += '</tr>'; 
				var cnt=0;
				var len = tabId != 3 ? optionStartIndex[tabId]:self.data.options.length;
				options = [];
				for(var i = optionStartIndex[tabId-1]; i < len; i++) {
					options.push(self.data.options[i]);
					if(cnt % 2 == 0 ){
						optionslyr += '<tr id="mcssOption_'+i+'" class="mcssOption">'; 
					}					
					optionslyr += '<td align="left" class="text_cont" valign="top"><p>' + self.data.options[i].optText + '</p></td>';
					for(var j = 0; j < self.data.choices.length; j++) {
						optionslyr += '<td align="left" class="options_cont '+(cnt % 2 !=0 ? 'right_cont' : 'left_cont')+' optionidx_'+i+'" valign="top"><div class="optionCont"><div class="yesnoBullet"><input class="tableContRedio" optNo="' + j + '" value="' + (j+1) + '" class="ans_box results" type="radio" name="option_' + i + '" disabled/></div><div id="answer_' + i + '_' + j + '" class="mcssGroupanswer"></div></div></td>'; 
					};					
					if(cnt % 2 != 0 ){
						optionslyr += '</tr>';				
					} 
					cnt++;
				};
				optionslyr += '</table>'; 				
				$('#mcssContainer').find('.optionContainer').html(optionslyr);
				$('.instText.submitInst').show();
				self.addListeners();
		}			
		});
	};
	
	this.addListeners = function() { 
		$('input').css("cursor","pointer");
		$('#mcssContainer').find('input').removeAttr("disabled");
		$('#mcssContainer').find('input').off('click').on('click', onOptionSelected);
		$('#mcssSubmitBtn').off('click').on('click', onSubmitEvt);
	};
	
	var showAnswer = function() {
		for(var i = 0; i < options.length; i++){
			var optNo = parseInt(options[i].id)-1;
			var selOpt = parseInt($('input[name=option_' + optNo + ']:checked').attr("optNo"));
			if ($("input[name=option_" + (optNo) + "]:checked").val() == options[i].correctAns){
				$('.optionidx_' + optNo).find('#answer_' + optNo + '_' + selOpt).addClass('correct').show();
			} else {
				$('.optionidx_' + optNo).find('#answer_' + optNo + '_' + (options[i].correctAns-1)).addClass('correct').show();

				$('.optionidx_' + optNo).find('#answer_' + optNo + '_' + selOpt).addClass('incorrect').show();
			}
		};
	}
	
	var onOptionSelected = function() {
		var tempStr = $(this).attr("name");
		if (tempStr && tempStr.split("_").length > 1) {
			var optNo = parseInt(tempStr.split("_")[1]);
			var selOpt = parseInt($(this).attr("optNo"));
			$('.optionidx_' + optNo).find('.yesnoBullet').removeClass('bulletPointsSelected');
			$('.optionidx_' + optNo).find('input:radio:checked').parent().addClass('bulletPointsSelected');		
			if(options.length == $(".bulletPointsSelected").length){
				$('#mcssSubmitBtn').removeClass("disabled");
			}
		}
	};
	
	var checkCompletion = function(){
		if(visitedTab.indexOf(0) == -1)
			self.callBackFn();
	}
	
	var onSubmitEvt = function(){
		if(!$(this).hasClass('disabled')){
			showAnswer();
			$("#mcssContainer").find('input').css("cursor","default");
			$("#mcssContainer").find('input').off("click");
			$(this).addClass('disabled');
			visitedTab[tabId - 1] = 1;
			$("#tab_" + tabId).addClass('visited');
			$("#tab_" + (tabId+1)).removeClass('disabled').addClass('enabledtab');
			checkCompletion();
		}
	};
} 