(function () {

    function ProjectsViewModel() {
        var self = this;

        self.isVisible = ko.observable(false);
        self.isLoadingProjectList = ko.observable(false);
        self.items = ko.observableArray([]);


        self.getProjects = function () {
            if (self.isVisible()) {
                self.isVisible(false);
            } else {
                self.isVisible(true);
            }

            self.isLoadingProjectList(true);
            tpxHighLevelGetProjectListControl();
        };


        self.editProject = function (data) {
            tpxHighLevelEditProjectControl(data.projectref, 1, 0);
        };


        self.renameProject = function (data) {
            var elementIndex = ko.contextFor(event.target).$index();
            tpxHighLevelRenameProjectControl((elementIndex + 1), data.projectref, true, data.projectname);
        };


        self.duplicateProject = function (data) {
            tpxHighLevelDuplicateProjectControl(data.projectref, data.projectname);
        };


        self.deleteProject = function (data) {
            var elementIndex = ko.contextFor(event.target).$index();
            tpxHighLevelDeleteProjectControl((elementIndex + 1), data.projectref, data.projectname, 1, 0);
        };
        

        self.setNewData = function (data, globalProjectListCount) {
            self.isLoadingProjectList(false);

            // maybe we already have the items on the client and the data will be empty.
            if (data.items) {
                self.items(data.items);
            }
        }
    };

    this.projectsViewModel = new ProjectsViewModel();
})();