

var howManyCheckedBoxes = function(name){
	var checkedBoxes = getCheckedBoxes(name);
	if(checkedBoxes){
		var quantity = checkedBoxes.length;
		return quantity;
	} else {
		return 0;
	}
	
}

var displayCheckboxNumber = function(){
	var numberArea = $('#selectedBookmarks');
	var quantity = howManyCheckedBoxes('article');
	if (quantity == 0){
		numberArea.text("No bookmark");
	} else if (quantity == 1){
		numberArea.text(quantity + " bookmark");
	} else {
		numberArea.text(quantity + " bookmarks");
	}
	// console.log(quantity)
}


var checkboxNumber = function(){
	allCheckboxes = $('input[type=checkbox]');
	// trigger change of number when click on a bookmark
	allCheckboxes.change(function(){
		displayCheckboxNumber()
	});
}








$(document).ready(function(){


// Add tags to bookmarks
// ---------------------

	$('#changeTags').bind('click', function(e){

		e.preventDefault();
		
		// Get checked articles' IDs
		var checkboxes = getCheckedBoxes("article");

		// Get tags to add
		var tagsInput = $('#inputTags').val();
		if(!(tagsInput.length>0)){
			tagsInput = null;
		}
		
		if ((checkboxes !== null) && (tagsInput !== null)){

			if(checkboxes.length == 1){
				addTagsToBookmarks(checkboxes, tagsInput, onSuccessCbk(checkboxes, tagsInput), onFailureCbk);
				// refreshBookmark(checkboxes);
			} else {
				// for (var i=0; i<checkboxes.length; i++){
				addTagsToBookmarks(checkboxes, tagsInput, onSuccessCbk(checkboxes, tagsInput), onFailureCbk);
				// }
			}
		}
	});

	var onSuccessCbk = function(ids, tags){
		console.log('SuccessCbk:' + tags + ' on ids ' + ids);
		
		// console.log(nb + ' articles were tagged: ' + tags);
		// document.location.reload();
	};
	var onFailureCbk = function(error){
		console.log('FailureCbk: ' + error);
		// console.log(data.error);
	};



// Refresh button
// --------------

	$('#refresh').bind('click', function(e){
		e.preventDefault();
		var checkboxes = getCheckedBoxes("article");
		if (checkboxes !== null){
			for (var i=0; i<checkboxes.length; i++){
				refreshBookmark(checkboxes[i]);
			}
			// allCheckboxes = $('input[type=checkbox]');
			// checkUncheckAll();
		}
	})



// Clear tags from bookmark(s) button
// ----------------------------------


	$('#clearTags').bind('click', function(e){
		e.preventDefault();
		// Get checked articles' IDs
		var checkboxes = getCheckedBoxes("article");
		if (checkboxes !== null){
			clearTagsFromBookmarks(checkboxes);
		}
	});

	

// Auto-load first page of bookmarks
// ---------------------------------

	// if (isFirst){
	// 	loadBookmarksPage(1);
	// }

	// deprecated (used to launch on every page)...




// Assign jquery.tagsinput to actual input
// ---------------------------------------

	var input = $('#inputTags');

	input.tagsInput({
		'width':'auto',
		'height':'5em'
	});


// Clear tags input button
// -----------------------

	$('#clearTagsInput').bind('click', function(e){
		input.importTags('');
		e.preventDefault();
	})



// Index : load number of total bookmarks
// --------------------------------------

	if (document.getElementById('totalBookmarksNumber')) {
	    getTotalBookmarksNumber();
	}











}); // end of document.ready