(function () {

    function CartViewModel() {
        var self = this;

        self.isVisible = ko.observable(false);
        self.isLoadingProjectList = ko.observable(false);
        self.items = ko.observableArray([]);


        self.getCart = function () {
            if (self.isVisible() == true) {
                self.isVisible(false);
            } else {
                self.isVisible(true);
            }

            self.isLoadingProjectList(true);
            tpxHighLevelGetBasketContentsControl();
        };


        self.editProject = function (data) {
            tpxHighLevelEditProjectControl(data.projectref, 1, 0);
        };


        self.renameProject = function (data, event) {
            var elementIndex = ko.contextFor(event.target).$index();
            tpxHighLevelRenameProjectControl((elementIndex + 1), data.projectref, false, data.projectname);
        };

        self.duplicateProject = function (data) {
            var elementIndex = ko.contextFor(event.target).$index();
            tpxHighLevelDuplicateProjectControl(data.projectref, data.projectname);
        };

        self.removeFromBasket = function (data) {
            var elementIndex = ko.contextFor(event.target).$index();
            tpxHighLevelRemoveItemFromBasketControl((elementIndex + 1), data.projectref);
        }

        self.emptyBasket = function () {
            tpxHighLevelEmptyBasketControl();
        };

        self.checkout = function () {
            tpxHighLevelCheckoutControl();
        };

        self.setNewData = function (data, globalBasketCount) {
            self.isLoadingProjectList(false);

            // maybe we already have the items on the client and the data will be empty.
            if (data.items) {
                self.items(data.items);
                self.cartCount(data.items.length);
                if(typeof localStorage != 'undefined'){
                    localStorage.setItem('lastCartCount', data.items.length);
                }
            }
        }

        // A way to have a value on cart count badge without having to refresh from server on 
        // each page load.
        self.cartCount = ko.observable(0);
        self.cartBadge = ko.computed(function() {
            if(self.items().length > 0){
                return self.items().length;
            } else {
                return self.cartCount();
            }
        }, this);

        if(typeof localStorage != 'undefined'){
            var lastCartCountSaved = localStorage.getItem('lastCartCount');
            if(lastCartCountSaved != null) {
               self.cartCount(lastCartCountSaved);
            } 
        }
    };

    this.cartViewModel = new CartViewModel();

})();