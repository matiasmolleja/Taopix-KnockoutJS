(function () {

    function TpxBasketAPIViewModel() {
        var self = this;

        self.cartViewModel = cartViewModel;
        self.projectsViewModel = projectsViewModel;

        self.isSignedIn = ko.observable(0);


        self.signIn = function () {           
            tpxHighLevelSignInInitControl();
        };

        self.logout = function () {            
            tpxHighLevelLogoutControl();
        };

        self.register = function () {            
            tpxHighLevelRegisterInitControl();
        }

        self.myAccount = function () {            
            tpxHighLevelMyAccountInitControl();
        }

        self.localize = function (key) {
            var translated = tpxGetLocaleString(key); // tpxLocalize.localize(key);
            
            if (!translated) {
                console.error('unable to translate string: ' + key);
                translated = key;
            }            
            return translated;
        };
        

        self.renameProject = function(index, newProjectName, fromProjectList){
            var items = fromProjectList ? self.projectsViewModel.items : self.cartViewModel.items ; 
            
            // this is a hack. We want to update properties of an item in an observableArray without
            // having to convert each item into an observable itself. 
            // A workaround is removing the item and adding it again to trigger an update in the observable array.
            // extract
            var targetItem = items.splice(index -1,1)[0];
            
            // rename
            targetItem.projectname = newProjectName;
            
            // insert
            items.splice(index-1,0,targetItem);
        }
    };

    
    this.tpxBasketAPIViewModel = new TpxBasketAPIViewModel();

    ko.applyBindings(this.tpxBasketAPIViewModel);

})();