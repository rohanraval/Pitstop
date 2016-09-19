$(document).ready(function () {
    $('#modelDD').prop('disabled', true);
    getCarData();
});

function getCarData() {
    $.ajax({
        url: 'cardetails.txt',
        type: "GET"

    }).done(function (responseText) {

        //parse file data into array of JSON objects,
            //and then call function to get the unique types from those objects.
        var carObjects = $.parseJSON(responseText);
        getTypeOptions(carObjects);


        //when user selects a type, send the selected type to a function that gets
            //the models from the data based on the type.
        $('#typeDD').change(function () {
            var selectedType = $('#typeDD option:selected').text();
            getModelOptions(selectedType, carObjects);
        });

        //when the submit button is clicked, get the selected model, make sure it is valid,
            //and display the resulting data about the car. Scroll to the bottom of the page.
        $('#button').click(function () {
            var selectedModel = $('#modelDD option:selected').text();
            if($('#modelDD option:selected').text() != " select model ")
                display(selectedModel, carObjects);

            $('html, body').animate({ scrollTop: $(document).height()}, 'slow');
        });

    }).fail(function (xhr) {
        if (xhr.status == 404)
            alert("CANNOT FIND CAR DATA!");
    });
}

function getTypeOptions(carObjects) {
    var uniqueTypes = [];

    //loop through carObjects, check if each object's type is not already in the uniqueTypes array,
        //if it is not, then it is a unique type so add it to uniqueTypes array.
    $.each(carObjects, function(index, item) {
       if ($.inArray(item['Type'], uniqueTypes) == -1) {
          uniqueTypes.push(item['Type']);
       }
    });

    //for all strings in uniqueTypes, add them as an option in the typeDD
    for(var i = 0; i < uniqueTypes.length; i++) {
        $('#typeDD').append($('<option>', {
        value: uniqueTypes[i],
        text: uniqueTypes[i]
        }));
    }
}

function getModelOptions(selectedType, carObjects) {

    $('#modelDD option:gt(0)').remove();    //clear the existing options in the modelDD
    $('#modelDD').val('defaultModel').change(); //change the value of the modelDD back to default selection
    $('#modelDD').prop('disabled', false);  //enable selection from the modelDD

    var modelsOfSelectedType = [];

    //find all carObjects of the selected type and add their model name to an array modelsOfSelectedType
    for(var obj in carObjects) {
        var objType = carObjects[obj].Type;
        if(objType == selectedType) {
            modelsOfSelectedType.push(carObjects[obj].Model);
        }
    }

    //add all the model names of the selected car type as options in the modelDD
    for(var i = 0; i < modelsOfSelectedType.length; i++)
    {
        $('#modelDD').append($('<option>', {
        value: modelsOfSelectedType[i],
        text: modelsOfSelectedType[i]
        }));
    }
}

function display(selectedModel, carObjects) {
    $('#outputDiv').show();

    //find the selected car from the data
    var selectedObject;
    for(var obj in carObjects) {
            var objModel = carObjects[obj].Model;
            if(objModel == selectedModel) {
                selectedObject = carObjects[obj];
        }
    }

    $('#carTable').empty();     //clear the car table

    //loop through all the properties of the selected car, except the ImageSrc property,
        //and add each as a new row to the carTable
        //(the property key as a <th> and the property value as a <td>)
    $.each(selectedObject, function(key, value){
        if(key == 'ImageSrc') {
            return;
        }
        $('#carTable').append(
            '<tr>' +
                '<th>' + key + '</th>' +
                '<td>' + value + '</td>' +
            '</tr>');
    });

    //set the selected car's ImageSrc property key to be the source for the displayed carImage
    $('#carImage').attr('src', selectedObject['ImageSrc']);
}
