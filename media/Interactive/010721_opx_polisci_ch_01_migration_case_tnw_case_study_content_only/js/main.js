/*******************************************************/
$(document).ready(function () {

	var counter = 0;
	var pageLength = 0;
	var rightContentLength = 0
	var staticImagePath = "images/";
	var setting;
	var objAccessibility = null;
	var color1;
	var color2;
	var color3;
	var white="#ffffff";
	// var settingHoverBg;
	// var settingDefaultBg;

	$("#tempDiv").load("data/data.xml", function (response, status, xhr) {
		if (status != "error") {

			$("#tempSetting").load("data/setting.xml", function (response, status, xhr) {
				if (status != "error") {
					/*Hiding the loading image*/
					$("#loadingImg").hide();
					/*End*/
					displayStaticContent();
					//$('.container').focus();
					//alert('ok');
				}
			});
		}
	});

	/*Showing the loading image*/
	$("#loadingImg").show();

	function displayStaticContent() {

		// $('.next_btn').find('path').attr('fill','#00ff00');


		function isMacintosh() {
			return navigator.platform.indexOf('Mac') > -1
		}
		var isMac = isMacintosh();
		if (isMac) {
			$('.content').addClass('contentMac');
		}

		var xmlDoc = $.parseXML($("#tempDiv").html());
		var xml = $(xmlDoc);
		//console.log(xml.find("content"));
		pageLength = xml.find("content").length;
		objAccessibility = new Accessibility(pageLength); // call Accessibility funcion from accessibilityJs
		var settingDoc = $.parseXML($("#tempSetting").html());
		setting = $(settingDoc);

		var focusColor = setting.find("focuscolor").attr('color').split(",")[0];
		$('body').append('<style>input[type=button]:focus{ outline-color: ' + focusColor + ';} button:focus{outline-color: ' + focusColor + ';}</style>');


		// $('body').append('<style>input[type=button]:focus{outline: 1px solid ' + focusColor + '; border: 0px solid transparent;}</style>');

		// title style from from setting.xml
		var fontfamily = setting.find("headingtitle").attr('fontfamily');
		var color = setting.find("headingtitle").attr('color');
		// var backgroundcolor = setting.find("headingtitle").attr('backgroundcolor');

		// title style from from setting.xml
		var instNormFontFamily = setting.find("instructionnorm").attr('fontfamily');
		var instNormColor = setting.find("instructionnorm").attr('color');
		// var instNormBackgroundcolor = setting.find("instructionnorm").attr('backgroundcolor');

		var arrSettingStyleItem = setting.find("styleitem");


		console.log('fontfamily=', fontfamily);

		var title = xml.find("templatetitle").html();
		var instructionNorm = xml.find("instruction").find("instructionnorm").html();
		console.log("dgdfgdfgfd=", title, instructionNorm);

		$("#title").html(title).css({
			"font-family": fontfamily,
			"color": color,
			// "backgroundColor": backgroundcolor
		});
		$("#instructionnorm").html(instructionNorm).css({
			"font-family": instNormFontFamily,
			"color": instNormColor,
			// "backgroundColor": instNormBackgroundcolor
		});


		$(".settinToolsContainer").append('<div class="toolsCnt"></div>');
		$(".settinToolsContainer").append('<button title="close" class="close"></button>');

		arrSettingStyleItem.each(function (ind, el) {
			colors = String($(el).attr("colors")).split(',');
			if (ind == 0) {
				$(".settinToolsContainer .toolsCnt").append('<div class="toolContainer_' + ind + '"><button bg="' + $(el).attr("background") + '" fg="' + $(el).attr("foreground") + '" class="tool tool_' + ind + '">button</button><p l lang="en" class="toolTxt toolTxt_' + ind + '">' + $(el).attr("txt") + '</p></div>');
			} else {
				$(".settinToolsContainer .toolsCnt").append('<button role="settings tool" class="toolContainer toolContainer_' + ind + '" colors="' + $(el).attr("colors") + '"><svg class="tool tool_' + ind + '" id="colorscheme1" xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39"><g id="Group_717" data-name="Group 717" transform="translate(-1687 -62)"><circle id="Ellipse_200" data-name="Ellipse 200" cx="19.5" cy="19.5" r="19.5" transform="translate(1687 62)" fill="' + colors[0] + '" /><rect id="Rectangle_771" data-name="Rectangle 771" width="39" height="8" rx="1" transform="translate(1687 78)" fill="' + colors[2] + '" /></g></svg><span l lang="en" class="toolTxt toolTxt_' + ind + '">' + $(el).attr("txt") + '</span></button>');
			}

			

		});
		var firstColor=$(arrSettingStyleItem[1]).attr("colors");
		color1=firstColor.split(",")[0];
		color2=firstColor.split(",")[1];
		color3=firstColor.split(",")[2];
		console.log("color1",color1);

		$('.settinToolsContainer').css({
			backgroundColor: white
		});
		$('.setting').find("path").attr('fill', color1);
		$('.next_btn,.prev_btn,.reset_btn').find("circle").attr('fill', color1);
		$('.next_btn,.prev_btn,.reset_btn').find("path").attr('fill', white);

		// $('body').append('<style class="default">.submit_btn,.tryagain_btn,.reset_btn{ border-color: ' + color1 + '; color:'+color1+'; background-color:transparent;} button:focus{outline-color: ' + focusColor + ';} .submit_btn:hover,.tryagain_btn:hover,.reset_btn:hover{ border-color: ' + color1 + '; color:'+color1+'; background-color:'+defauldhoverBg+';}  .submit_btn:active,.tryagain_btn:active,.reset_btn:active{ border-color: ' + color1 + '; color:'+defauldhoverBg+'; background-color:'+color1+';} button:focus{outline-color: ' + focusColor + ';}</style>');


		$('.settinToolsContainer .toolContainer_0').find('.toolTxt').css({
			"font-family": $(arrSettingStyleItem[0]).attr('fontfamily'),
			"color": $(arrSettingStyleItem[0]).attr('color')
		});

		$('.settinToolsContainer .toolContainer').each(function (index, el) {
			if(index==0)
			{
				$(el).attr('aria-pressed','true');	
			}else{
				$(el).attr('aria-pressed','false');
			}
			var arr = $(arrSettingStyleItem[index]).attr('fontfamily');
			console.log("raj=", arr);
			$(el).find('.toolTxt').css({
				"font-family": $(arrSettingStyleItem[index + 1]).attr('fontfamily'),
				"color": $(arrSettingStyleItem[index + 1]).attr('tooltextcolor')
			});
		});


		displayDynContent(counter);

		$('.settinToolsContainer .toolContainer').off().on("click", changeBgFgOfTemplate);

		function changeBgFgOfTemplate() {
			//alert("ok");


			$('.settinToolsContainer .toolContainer').each(function (index, el) {
				$(el).attr('aria-pressed','false');
			});
			$(this).attr('aria-pressed','true');

			color1 = $(this).attr('colors').split(",")[0];
			color2 = $(this).attr('colors').split(",")[1];
			color3 = $(this).attr('colors').split(",")[2];
			//console.log("color1=",color1);
			// $('.content').css({backgroundColor:color1});

			$('body').find("style").remove();
			var ind=$(this).index()-1;
		var focusColor = setting.find("focuscolor").attr('color').split(',')[ind];
		// selectedItemColor = setting.find("focuscolor").attr('selecteditemcolor').split(',')[ind];

		$('body').append('<style>input[type=button]:focus{ outline-color: ' + focusColor + ';} button:focus{outline-color: ' + focusColor + ';}</style>');


			$('#title').css({
				color: color1
			});
			$('.next_btn,.prev_btn,.reset_btn').find("circle").attr('fill', color1);
			$('.setting').find("path").attr('fill', color1);

			$('#instructionnorm').css({
				color: color2
			});
			$('.leftContentTitle').css({
				color: color2
			});
			$('.leftSubContainer').css({
				color: color2
			});
			//$('.imagecitation').css({color:color2});

			$('.settinToolsContainer').css({
				backgroundColor: white
			});

			$(".settinToolsContainer .toolContainer").css({
				color: color1
			});

			$(".settinToolsContainer .toolTxt").css({
				color: color1
			});

			$('.setting').find("path").attr('fill', color1);
			// $('.next_btn,.prev_btn,.reset_btn').find("path").attr('fill',color2);



		}

	}


	function displayDynContent(counter) {
		var leftContentTitle = $('.leftContentTitle');
		var leftSubContainer = $('.leftSubContainer');
		var leftContainer = $('.leftContainer');
		var imgContainer = $('.imgContainer');
		var rightContainer = $('.rightContainer');




		// title style from from setting.xml
		var contentTitleFontFamily = setting.find("contenttitle").attr('fontfamily');
		var contentTitleColor = setting.find("contenttitle").attr('color');
		var contentTitleBackgroundcolor = setting.find("contenttitle").attr('backgroundcolor');
		var contentTitleFontsize = setting.find("contenttitle").attr('fontsize');

		// title style from from setting.xml
		var contentDataFontFamily = setting.find("contentdata").attr('fontfamily');
		var contentDataColor = setting.find("contentdata").attr('color');
		var contentDataBackgroundcolor = setting.find("contentdata").attr('backgroundcolor');
		var contentDataFontsize = setting.find("contentdata").attr('fontsize');

		//alert('ok');
		//console.log('ooooo');
		var xmlDoc = $.parseXML($("#tempDiv").html());
		var xml = $(xmlDoc);



		$('.counter').text(counter + 1);
		$('.total').text(pageLength);
		//console.log(pageLength);
		var xmlLeftContentTitle = xml.find("content").eq(counter).find("contenttitle").text();
		console.log('xmlLeftContentTitle=', xmlLeftContentTitle);

		var xmlLeftContentPara = xml.find("content").eq(counter).find("contentdata").find("para");
		rightContentLength = xml.find("content").eq(counter).find("rightcontent").length;
		var imgName = xml.find("content").eq(counter).find("picture").eq(0).attr("picname");
		var imgCitation = xml.find("content").eq(counter).find("imagecitation").eq(0).html();

		var imgAlt = xml.find("content").eq(counter).find("picture").eq(0).attr("alt");
		//console.log('imgClass=',imgClass);
		//console.log('rightContent=',rightContentLength);
		//console.log(xmlLeftContent);
		leftSubContainer.empty();
		if (rightContentLength == 0) {
			//alert('com');
			leftContentTitle.html('');
			leftContentTitle.html(xmlLeftContentTitle).css({
				"font-family": contentTitleFontFamily,
				"color": contentTitleColor,
				"backgroundColor": contentTitleBackgroundcolor
			});

			xmlLeftContentPara.each(function (ind, el) {
				leftSubContainer.append('<p l lang="en">' + $(el).html() + '</p>');
			});
			leftSubContainer.css({
				"font-family": contentDataFontFamily,
				"color": contentDataColor,
				"backgroundColor": contentDataBackgroundcolor
			});
			leftSubContainer.addClass('tableCell').parent(".leftContainer").addClass('fullHeight');
			leftContainer.addClass('fullContent');
			rightContainer.hide();
			leftContainer.children('h3').hide();
		} else {
			//alert('else com');
			// var arrPicClass=[];  // get all picture class from xml
			// xml.find("content").each(function(ind,el){
			// 		console.log(ind, el);
			// 		if($(el).find("picture").attr('picclass')!==undefined)
			// 		{
			// 			arrPicClass.push($(el).find("picture").attr('picclass'));
			// 		}
			// 	});
			// var allClass=arrPicClass.join(" ");
			leftContentTitle.html('');
			console.log("xmlLeftContentTitle=",xmlLeftContentTitle);
			leftContentTitle.html(xmlLeftContentTitle).css({
				"font-family": contentTitleFontFamily,
				"color": contentTitleColor,
				"backgroundColor": contentTitleBackgroundcolor
			});

			xmlLeftContentPara.each(function (ind, el) {
				leftSubContainer.append('<p>' + $(el).html() + '</p>');
			});
			leftSubContainer.css({
				"font-family": contentDataFontFamily,
				"color": contentDataColor,
				"backgroundColor": contentDataBackgroundcolor
			});
			leftSubContainer.removeClass('tableCell').parent(".leftContainer").removeClass('fullHeight');
			// imgContainer.removeClass(allClass);
			// imgContainer.addClass(imgClass);
			leftContainer.removeClass('fullContent');
			leftContainer.children('h3').show();
			rightContainer.show();

			$('.pic').attr("src", staticImagePath + imgName);
			$('.pic').attr("alt", imgAlt);
			$('.imagecitation').html(imgCitation);

		}
		// xml.find("content").each(function(ind,el){
		// 	console.log(ind, el);
		// 	console.log($(el).find("leftcontent").text());
		// 	// $('#leftContainer').append(leftDiv);
		// 	// $('#rightContainer').append(rightDiv);
		// });

		// $('.leftContentTitle').css({color:color2});
		// $('.leftSubContainer').css({color:color2});
		// $('.imagecitation').css({color:color2});

	}





	$('.prev_btn').off().on('click', prevListener);

	$('.prev_btn').off('mouseover').on('mouseover', prevhoverListener);
	$('.prev_btn').off('mouseleave').on('mouseleave', prevhoutListener);

	function prevhoverListener() {
		//$('.settinToolsContainer').addClass('showhide');
		$(this).find("path").attr('fill', color1);
		$(this).find("circle").attr('fill', color3);
	}

	function prevhoutListener() {
		console.log("color1",color1);
		//$('.settinToolsContainer').addClass('showhide');
		$(this).find("path").attr('fill', white);
		$(this).find("circle").attr('fill', color1);
	}

	function prevListener() {

		if (counter == pageLength - 1) {
			$('.reset_btn').hide();
			$('.next_btn').show();
		}

		if (counter > 0) {
			counter--
			objAccessibility.updateCounter(counter);
			displayDynContent(counter);
			if (counter == 0) {
				$('.prev_btn').hide();
				$(".next_btn").focus();
			}
		} else {
			counter = pageLength - 1;
			objAccessibility.updateCounter(counter);
			displayDynContent(counter);
			$(".next_btn").hide();
			$('.reset_btn').show();
			$('.prev_btn').show();
		}

		$('.counter').text(counter + 1);
		$('.total').text(pageLength);
		$('#title').focus();
	}

	$('.next_btn').off().on('click', nextListener);
	$('.next_btn').off('mouseover').on('mouseover', nexthoverListener);
	$('.next_btn').off('mouseleave').on('mouseleave', nexthoutListener);

	function nexthoverListener() {
		//$('.settinToolsContainer').addClass('showhide');
		$(this).find("path").attr('fill', color1);
		$(this).find("circle").attr('fill', color3);
	}

	function nexthoutListener() {
		console.log("color1",color1);
		//$('.settinToolsContainer').addClass('showhide');
		$(this).find("path").attr('fill', white);
		$(this).find("circle").attr('fill', color1);
	}


	function nextListener(e) {
		$('.prev_btn').show();

		if ($(e.currentTarget).hasClass('next_btn')) {
			if (counter < pageLength - 1) {

				counter++
				objAccessibility.updateCounter(counter);
				displayDynContent(counter);
				//$('#title').focus();
				if (counter == pageLength - 1) {
					$(".next_btn").hide();
					$('.reset_btn').show();
					$('.reset_btn').focus();

				}
				//console.log('objAccessibility=',objAccessibility);
				//objAccessibility.updateCounter(counter);
			}

		}

		// if($(this).hasClass('next')){
		// 	if(counter<pageLength)
		// 		{
		// 			counter++
		// 			console.log('counter=',counter);
		// 			displayDynContent(counter);
		// 			if(counter==pageLength-1){
		// 				$(".next_btn").hide();
		// 				$('.reset_btn').show();
		// 			}else if(counter==pageLength){
		// 				counter=0;
		// 				$(".next_btn").show();
		// 				$('.reset_btn').hide();
		// 				displayDynContent(counter);
		// 			}

		// 		}
		// }
		$('#title').focus();

		$('.counter').text(counter + 1);
		$('.total').text(pageLength);
	}


	// $('.setting').off().on('click', settingListener);

	// function settingListener() {
	// 	$(this).hide();
	// 	$('.settinToolsContainer').addClass('showhide');
	// 	$('.settinToolsContainer .close').off().on('click', closeSetting);

	// }

	
	$('.setting').off('click').on('click', settingListener);
	$('.setting').off('mouseover').on('mouseover', settinghoverListener);
	$('.setting').off('mouseleave').on('mouseleave', settinghoutListener);

	function settingListener() {
		$(this).hide();
		$('.settinToolsContainer').addClass('showhide');
		$('.settinToolsContainer .close').off().on('click', closeSetting);
	}


	function settinghoverListener() {
		//$('.settinToolsContainer').addClass('showhide');
		$('.setting').find("path").attr('fill', color3);
	}

	function settinghoutListener() {
		console.log("color1",color1);
		//$('.settinToolsContainer').addClass('showhide');
		$('.setting').find("path").attr('fill', color1);
	}


	function closeSetting() {
		$('.setting').show();
		$('.settinToolsContainer').removeClass('showhide');
	}


	$('.reset_btn').off().on('click', resetListener);

	$('.reset_btn').off('mouseover').on('mouseover', resethoverListener);
	$('.reset_btn').off('mouseleave').on('mouseleave', resethoutListener);

	function resethoverListener() {
		//$('.settinToolsContainer').addClass('showhide');
		$(this).find("path").attr('fill', color1);
		$(this).find("circle").attr('fill', color3);
	}

	function resethoutListener() {
		console.log("color1",color1);
		//$('.settinToolsContainer').addClass('showhide');
		$(this).find("path").attr('fill', white);
		$(this).find("circle").attr('fill', color1);
	}

	function resetListener() {
		counter = 0;
		objAccessibility.updateCounter(counter);
		displayDynContent(counter);
		$('.reset_btn').hide();
		$('.next_btn').show();
		$('.next_btn').focus();
		$('.prev_btn').hide();
		$('.counter').text(counter + 1);
		$('.total').text(pageLength);
		$('#title').focus();
	}


});