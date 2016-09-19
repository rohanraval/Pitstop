$(document).ready(function () {
    $("#output").hide();
    $('#modelDD').prop('disabled', true);

    getCarData();

    $("#toggleOutput").click(function () {
        if ($(this).val() == "Close Output") {
            $("#output").hide();
            $(this).val("Open Output");
        }
        else {
            $("#output").show();
            $(this).val("Close Output");
        }
    });
});

function getCarData() {
    $.ajax({
        url: '../data/cardetails.txt',
        type: "GET"

    }).done(function (responseText) {

        var carObjects = $.parseJSON(responseText);
        getTypeOptions(carObjects);

        $('#typeDD').change(function () {
            var selectedType = $('#typeDD option:selected').text();
            getModelOptions(selectedType, carObjects);
        });

        $("#button").click(function () {
            $("#output").show();
            $("#toggleOutput").val("Close Output");
            var selectedModel = $('#modelDD option:selected').text();
            display(selectedModel, carObjects);
        });

    }).fail(function (xhr) {
        if (xhr.status == 404) {
            alert("CANNOT FIND DATA FILE!");
        }
    });
}

function getTypeOptions(carObjects) {
    var uniqueTypes = [];
    $.each(carObjects, function(index, item) {
       if ($.inArray(item['Type'], uniqueTypes) == -1) {
          uniqueTypes.push(item['Type']);
       }
    });

    for(var i = 0; i < uniqueTypes.length; i++) {
        $('#typeDD').append($('<option>', {
        value: uniqueTypes[i],
        text: uniqueTypes[i]
        }));
    }
    /*for(var obj in carObjects) {
        var objType = carObjects[obj].Type;
        console.log(objType);
    }*/
}

function getModelOptions(selectedType, carObjects) {

    $('#modelDD option:gt(0)').remove();
    $('#modelDD').val('defaultModel').change();
    $('#modelDD').prop('disabled', false);

    var modelsOfSelectedType = [];

    for(var obj in carObjects) {
        var objType = carObjects[obj].Type;
        if(objType == selectedType) {
            modelsOfSelectedType.push(carObjects[obj].Model);
        }
    }

    for(var i = 0; i < modelsOfSelectedType.length; i++)
    {
        $('#modelDD').append($('<option>', {
        value: modelsOfSelectedType[i],
        text: modelsOfSelectedType[i]
        }));
    }
}

function display(selectedModel, carObjects) {
    var output = $("#output");

    var selectedObject;

    for(var obj in carObjects) {
            var objModel = carObjects[obj].Model;
            if(objModel == selectedModel) {
                selectedObject = carObjects[obj];
        }
    }

    $.each(selectedObject, function(key, value){
        console.log(key, value);
    });
}
