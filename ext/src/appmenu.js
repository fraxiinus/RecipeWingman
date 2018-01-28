document.addEventListener('DOMContentLoaded', function() {
    var userbutton = document.getElementById("search_button");

    userbutton.onclick = function(){
        SearchWegmans(document.getElementById("search_input").value);
    }
});

function SearchWegmans(query){
    var result_area = document.createElement("div");
    result_area.setAttribute("style","max-height:100px; min-height:100px;");

    var loading = document.createElement("div");
    loading.setAttribute("class", "spinner");

    var loading_cube_1 = document.createElement("div");
    loading_cube_1.setAttribute("class", "cube1");

    var loading_cube_2 = document.createElement("div");
    loading_cube_2.setAttribute("class", "cube2");

    loading.appendChild(loading_cube_1);
    loading.appendChild(loading_cube_2);

    // add the spinner to the window
    result_area.appendChild(loading);

    document.body.appendChild(result_area);
}