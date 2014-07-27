// ========================================
// 				Refresh bookmark(s)
// ========================================

function refreshBookmark(id){
	$.ajax({
		url: '/api/ajax/bookmarks/' + id,
		beforeSend: function(){
			$('#' + id).html("<li id='loading-" + id + "' class='info'>Updating...</li>");
		},
		complete: function(){
			$('#loading-' + id).remove();
			displayCheckboxNumber();
			checkUncheckAll();
			// allCheckboxes = $('input[type=checkbox]');
			checkboxNumber();
		},
		error: function(){
			console.log('error');
		},
		success: function(body){
			$('.loading').remove();
			$('#' + id).html(body);
		}
	})
}

function refreshBookmarks(ids){
	for (var i=0; i<ids.length; i++){
		console.log('refreshing ' + ids[i]);
		refreshBookmark(ids[i]);
	}
}







// ========================================
// 			Add tags to bookmark(s)
// ========================================


function addTagsToBookmarks(id, tags, onSuccess, onFailure) {

	var thisid = id;

    $.ajax({
    	url: "/api/ajax/bookmarks/" + id + "/tags/" + tags,
    	type: "POST",
    	contentType: "application/json; charset=utf-8",
    	dataType: "json",
    	error: function(xhr, status, error){
    		// error returned by server -> status code
    		// TODO : change this
    		alert('ERROR ');
    		console.log(xhr);
    	},
    	success: function(data){
    		console.log(data);
    		// console.log(JSON.parse(data));
    		// data = JSON.parse(data);
    		if (data.error){
    			error = JSON.parse(data.error);
    			failureAddTagsCbk(error.messages[0]);
    		} else {
    			successAddTagsCbk(JSON.parse(data.data));
    			// successAddTagsCbk(data.data);
    		}
    	},
    	complete: function(){
    		if (thisid.length > 1){
    			console.log('multiple Refresh');
    			var theseIds = thisid;
    			refreshBookmarks(theseIds);
    		} else {
    			console.log("single Refresh");
	    		refreshBookmark(thisid);
    		}
    	}
    });
   //  	.always(function(){
			// refreshBookmark(thisid);
   //  	})
   //  	.fail(function(jqXHR, textStatus, errorThrown){
   //  		failureAddTagsCbk(errorThrown)
   //  	})
   //  	.done(function(data){
   //  		successAddTagsCbk(data);
   //  	});
}


function successAddTagsCbk(tags){
	var tagTexts = "";
	for (var i=0; i<tags.length; i++){
		tagTexts = tagTexts + tags[i].text + ', ';
	}
	// alert('success! ' + tagTexts);
	successMessage(tagTexts);
	// alert('successCbk');
}
function failureAddTagsCbk(err){
	successMessage(err);
	// alert('error: ' + err);
}



function successMessage(text){
	// console.log(text);
	// $('#alertSidebar').html(text).addClass('success').show();
	// window.setTimeout(function(){
	// 	$('#alertSidebar').fadeOut().removeClass('success');
	// }, 5000);
}



// ========================================
// 			Delete tags from bookmark(s)
// ========================================

function clearTagsFromBookmark(id, number){
    $.ajax({
    	url: "/api/ajax/bookmarks/" + id + "/cleartags",
    	type: "POST",
    	complete: function(){
    		return refreshBookmark(id);
    	},
    	success: function(){
    		successMessage('Successfully cleared tags from <b>' + number + '</b> bookmarks.');
    	}
    })
}

function clearTagsFromBookmarks(ids){
	var number = ids.length;
	if(ids.length>1){
		for (var i=0; i<ids.length; i++){
			clearTagsFromBookmark(ids[i], number);
		}
	} else {
		clearTagsFromBookmark(ids, 1);
	}
}






// ========================================
// 			Load a page of bookmarks
// ========================================

function loadBookmarksPage(page){
	$.ajax({
		url: '/api/ajax/bookmarks/page/' + page,
		beforeSend: function(){
			$('#bookmarksList').append("<li id='loading-page' class='center info'>Loading bookmarks...</li>");
		},
		complete: function(){
			$('#loading-page').remove();
		},
		error: function(){
			console.log('error');
		},
		success: function(body) {
			$('#bookmarksList').append(body);
			
			// Passing util functions:
			checkUncheckAll();
			checkboxNumber();
			loadMoreButtonAction();

		}
	});
}








// =============================================
// 		Get the total number of Bookmarks
// =============================================


function getTotalBookmarksNumber(){
	$.ajax({
		url: '/api/ajax/bookmarks/',
		success: function(body) {
			var total = JSON.parse(body).meta.item_count_total;
			$('#totalBookmarksNumber').text('(' + total + ')');
		}
	})
}





















































// ========================================
// 					UTILS
// ========================================



// Check/Uncheck all bookmarks
// ---------------------------

function checkUncheckAll(){
	allCheckboxes = $('input[type=checkbox]');

	$('#checkAll').bind('click', function(e){
		e.preventDefault();
		allCheckboxes.prop('checked', true);
		displayCheckboxNumber();
	})

	$('#uncheckAll').bind('click', function(e){
		e.preventDefault();
		allCheckboxes.prop('checked', false);
		displayCheckboxNumber();
	})
}





// Get the IDs of checked checkboxes
// ---------------------------------

// Pass the checkbox name to the function
function getCheckedBoxes(chkboxName) {
  var checkboxes = document.getElementsByName(chkboxName);
  var checkboxesChecked = [];
  // loop over them all
  for (var i=0; i<checkboxes.length; i++) {
     // And stick the checked ones onto an array...
     if (checkboxes[i].checked) {
        checkboxesChecked.push(checkboxes[i].value);
     }
  }
  // Return the array if it is non-empty, or null
  return checkboxesChecked.length > 0 ? checkboxesChecked : null;
}




// Load more bookmarks
// -------------------

function loadMoreButtonAction(){
	var loadMoreButtons = $('.loadMoreButton');

	for (var i=0; i<loadMoreButtons.length; i++){
		var button = $(loadMoreButtons[i]);
		var page = button.attr('data-value');
		button.bind('click', function(e){
			e.preventDefault();
			console.log(this);
			loadBookmarksPage(page);
			button.hide();
		})
	}
}




// Is it first page of bookmarks?
// ------------------------------

// function isFirst(){
// 	var load = $('#loadBookmarks');
// 	if (load !== null){
// 		return true;
// 	} else {
// 		return false;
// 	}
// }

// deprecated : did not work anymore (change in markup)