// Constants
var _Element = {};

angular.module("NgSpFormTemplate", []).directive("ngSpft", function($compile) {
    
    _Element.SPFormTable = document.getElementsByClassName("ms-formtable");

    /**
        Unfortunately, there's no easy way of finding the <td> that contains the element we
        want to extract and move. We really need to go through each of the <td> elements present
        in the table and execute break-loop once we've found the one we're looking for.
        
        @Parameter: spInternalName : String
        @Output: element : DOM-HTML
    */

    function getSpFormElement(spInternalName) {
        var element;
        var cellCollection = _Element.SPFormTable[0].getElementsByTagName("td");
        for (var cellIndex = 0; cellIndex <= cellCollection.length; cellIndex++) {
            if (cellCollection[cellIndex]) {
                if (cellCollection[cellIndex].className == "ms-formbody" || cellCollection[cellIndex].className == "ms-formbodysurvey") {
                    var searchByInternalName = RegExp("FieldInternalName=\"" + spInternalName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + "\"", "gi");
                    if (searchByInternalName.test(cellCollection[cellIndex].innerHTML)) {
                        element = cellCollection[cellIndex];
                        element.removeAttribute("width"); // we don't want to use the SharePoint's pre-defined width
                        break; // we found it. stop looping
                    }
                }
            }
        }
        return element;
    }

    return {
        restrict: "A",
        link: function($scope, element, attrs) {
            angular.forEach(element[0].getElementsByClassName("ng-spft-cellholder"), function(elemCell) {

                var spInternalName = elemCell.attributes["data-spInternalName"].value;
                var spFormElement = getSpFormElement(spInternalName);
                
                var elemRow = angular.element(elemCell.parentNode);

               	//Compile and append the element
                $compile(spFormElement)($scope)
                elemRow.append(spFormElement);
                
                //Hide the temporary cell-placeholder
                elemCell.style.display = "none";
                
            });
        }
    };
});
