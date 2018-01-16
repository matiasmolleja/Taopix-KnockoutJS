// It is critical that this file is loaded after tpxHighLevelBasketAPI.js

var kServerURL = "";

// fixing an spanish translation issue. When this is fixed by Taopix, we can remove this line.
var kStr_LabelSignIn = "en Sign In<p>cs Přihlásit<p>da Log på<p>de Anmelden<p>es Iniciar Sesión<p>fi Kirjaudu<p>fr Connectez-vous<p>it Accedere<p>ja サインイン<p>ko 로그인<p>nl Aanmelden<p>no Logg inn<p>pl Zaloguj<p>pt Entre<p>ru Вход<p>sv Logga in<p>th เข้าสู่ระบบ<p>zh_cn 登录<p>zh_tw 登入";


// GET PROJECT LIST CUSTOMIZATION
// WARNING: RESPONSE WILL BE EMPTY WHEN THE PROJECTS ARE ALREADY DOWNLOADED-CACHED TO THE CLIENT
function tpxHighLevelGetProjectListView(pJsonResponseObject)
{	
	tpxBasketAPIViewModel.projectsViewModel.setNewData(pJsonResponseObject, gProjectListCount);
	return false;
}


// RENAME PROJECT CUSTOMIZATION
// As an exception we need to override the control function too. Explained why below.

// Added a new parameter pProjectName. 
// That is what is already done by Taopix for duplicateProjectControl and deleteProjectControl.
// Not sure why here it is different
// The parameter is to avoid having to extract the projectname from an element in the html. 
// It enhances decoupling the js-logic from the html-view 
function tpxHighLevelRenameProjectControl(pItemID, pProjectRef, pFromProjectList, pProjectName) {
	var paramArray = new Object();
	paramArray['projectref'] = pProjectRef;
	paramArray['basketitemidtoupdate'] = pItemID;

	var itemIDPrefix = '';

	if (pFromProjectList) {
		itemIDPrefix = 'projectlist'
	}

	// MODIFIED START.
	// The condition is only to be backwards compatible
	var projectName;
	if (pProjectName) {		
		projectName = pProjectName;		
	} else {		
		var projectNameElement = document.getElementById(itemIDPrefix + 'item-renameproject-' + pItemID);
		projectName = projectNameElement.getAttribute("data-projectname");
	}
	// MODIFIED END.


	var projectNameInput = {
		body: '<p>' + tpxGetLocaleString(kStr_LabelRenameProject) + ':</p><input class="basicModal__text" type="text" name="tpxprojectname" placeholder="' + tpxGetLocaleString(kStr_LabelProjectName) + '" value="' + projectName + '">',
		buttons: {
			cancel: {
				title: tpxGetLocaleString(kStr_ButtonCancel),
				fn: basicModal.close
			},
			action: {
				title: tpxGetLocaleString(kStr_ButtonContinue),
				fn: function (data) {

					if (data.tpxprojectname.length < 1) {
						return basicModal.error('tpxprojectname');
					}
					else {
						paramArray['newname'] = data.tpxprojectname;
						paramArray['fromprojectlist'] = pFromProjectList;
						tpxHighLevelProcessRequest('tpxHighLevelRenameProjectControl', false, paramArray, {});
					}

					basicModal.close();
				}
			}
		}
	}

	basicModal.show(projectNameInput);
}

function tpxHighLevelRenameProjectView(pJsonResponseObject, pFromProjectList)
{
	if (pJsonResponseObject.result == 0) {
		tpxBasketAPIViewModel.renameProject(pJsonResponseObject.basketitemidtoupdate, pJsonResponseObject.newprojectname, pFromProjectList);
	}
	else {
		var resultAlert = {
			body: '<p>' + pJsonResponseObject.resultmessage + '</p>',
			buttons: {
				action: {
					title: tpxGetLocaleString(kStr_ButtonOK),
					fn: basicModal.close
				}
			}
		}

		basicModal.show(resultAlert);
	}

	return false;
}

// DELETE PROJECT CUSTOMIZATION
// As an exception we need to override the control function too. Explained why below:
// Taopix example is getting project name from a dom element by id. This introduces a dependency from markup
// and is not needed because pProjectName is already a parameter available in the function.
function tpxHighLevelDeleteProjectControl(pItemID, pProjectRef, pProjectName, pCanUnlock, pForceKill) {
	var paramArray = new Object();
	paramArray['projectref'] = pProjectRef;
	paramArray['forcekill'] = pForceKill;
	paramArray['canunlock'] = pCanUnlock;
	paramArray['itemtoremoveid'] = pItemID;

	var deleteProjectPrompt = {
		body: '<p>' + tpxParamString(tpxGetLocaleString(kStr_MessageDeleteProjectConfirmation), pProjectName) + '</p>',
		buttons: {
			cancel: {
				title: tpxGetLocaleString(kStr_ButtonNo),
				fn: basicModal.close
			},
			action: {
				title: tpxGetLocaleString(kStr_ButtonYes),
				fn: function (data) {

					tpxHighLevelProcessRequest('tpxHighLevelDeleteProjectControl', false, paramArray, {});

					basicModal.close();
				}
			}
		}
	}

	basicModal.show(deleteProjectPrompt);

	return false;
}


function tpxHighLevelDeleteProjectView(pJsonResponseObject)
{
	
	if (pJsonResponseObject.result == 0)
	{		
		tpxBasketAPIViewModel.projectsViewModel.items.splice(pJsonResponseObject.itemtoremoveid - 1, 1);
	}
	else
	{		
		var resultAlert = {
			body: '<p>' + pJsonResponseObject.resultmessage + '</p>',
			buttons: {
				action: {
					title: tpxGetLocaleString(kStr_ButtonOK),
					fn: basicModal.close
				}
			}
		}
		
		basicModal.show(resultAlert);
	}
	
	return false;
}


// VIEWING BASKET LIST CUSTOMIZATION
function tpxHighLevelGetBasketContentsView(pJsonResponseObject)
{
	tpxBasketAPIViewModel.cartViewModel.setNewData(pJsonResponseObject, gBasketCount);	
	return false;
}



// REMOVE ITEM FROM BASKET CUSTOMIZATION
function tpxHighLevelRemoveItemFromBasketView(pJsonResponseObject)
{
	if (pJsonResponseObject.result == 32)
	{
		var removeProjectPrompt = {
			body: '<p>' + tpxParamString(tpxGetLocaleString(kStr_MessageProjectOpenInShoppingCart)) + '</p>',
			buttons: {
				cancel: {
					title: tpxGetLocaleString(kStr_ButtonCancel),
					fn: basicModal.close
				},
				action: {
					title: tpxGetLocaleString(kStr_ButtonContinue),
					fn: function(data) {
						
						tpxHighLevelRemoveItemFromBasketControl(pJsonResponseObject.itemtoremoveid, pJsonResponseObject.projectref, 1);
						
						basicModal.close();
					}
				}
			}
		}
	
		basicModal.show(removeProjectPrompt);
	}
	else if (pJsonResponseObject.result == 0)
	{
		tpxBasketAPIViewModel.cartViewModel.items.splice(pJsonResponseObject.itemtoremoveid - 1, 1);
	}
	else
	{		
		var resultAlert = {
			body: '<p>' + pJsonResponseObject.resultmessage + '</p>',
			buttons: {
				action: {
					title: tpxGetLocaleString(kStr_ButtonOK),
					fn: basicModal.close
				}
			}
		}
		
		basicModal.show(resultAlert);
	}
	
	return false;
}


// EMPTY BASKET CUSTOMIZATION
function tpxHighLevelEmptyBasketView(pJsonResponseObject)
{
	if (pJsonResponseObject.result == 32)
	{
		var removeProjectPrompt = {
			body: '<p>' + tpxParamString(tpxGetLocaleString(kStr_MessageProjectOpenInShoppingCart)) + '</p>',
			buttons: {
				cancel: {
					title: tpxGetLocaleString(kStr_ButtonCancel),
					fn: basicModal.close
				},
				action: {
					title: tpxGetLocaleString(kStr_ButtonContinue),
					fn: function(data) {
						tpxHighLevelProcessRequest('tpxHighLevelEmptyBasketControl', false, {forcekill: 1}, {});
						basicModal.close();
					}
				}
			}
		}
	
		basicModal.show(removeProjectPrompt);
	}
	
	if (pJsonResponseObject.result == 0)
	{
		tpxBasketAPIViewModel.cartViewModel.items.removeAll();
	}
	else
	{
		var resultAlert = {
			body: '<p>' + pJsonResponseObject.resultmessage + '</p>',
			buttons: {
				action: {
					title: tpxGetLocaleString(kStr_ButtonOK),
					fn: basicModal.close
				}
			}
		}
		
		basicModal.show(resultAlert);
	}
	
	return false;
}


// LOGGEDINSTATUSCALLBACK CUSTOMIZATION
function tpxHighLevelLoggedInStatusCallBack(pIsSignedIn)
{
    tpxBasketAPIViewModel.isSignedIn(pIsSignedIn);
}

// DISABLING TAOPIX INITIAL UI LOCALIZATION BECAUSE IT IS NOT NEEDED WITH KNOCKOUT
function tpxHighLevelBasketLocalise() { }
