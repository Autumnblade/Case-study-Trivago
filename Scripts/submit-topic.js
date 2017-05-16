// Use Jquery document ready for browser compatibility 
$(document).ready( function() {
    var form = $('#ajax-topic');

    $(form).on("submit", function (event) {
        // Prevents the browser from submitting the form
        event.preventDefault();

        // Serializes the form data to an array.
        var formData = $(this).serializeArray();

        // Declare essential variable
        var topic = null;

        // Iterates through with as purpose to initialize the essential variable
        $.each(formData, function (i, obj){
            if (obj.name == 'topic') {
                topic = obj.value;
            }
        });
        
        // Request for the review
        $.getJSON('../Reviews/reviews1.json', function (data) {
            var reviews = data["Reviews"];

            // Creates the reviews visually
            $.each(reviews, function(i, val) {
                createReviewPanel(val);
            });
        });
    });
});

function createReviewPanel(review) {
    var content = $('#content');

    var panel = $('<div class="panel panel-default"></div>');

    // Header
    var pHeading = $('<div class="panel-heading"></div>');

    var title = $('<h3 class="panel-title"></h3>').text(review['Author']);

    pHeading.append(title);
    
    // End header
    // Body
    var pBody = $('<div class="panel-body row"></div>');

    var pRatings = $('<div class="col-md-3"></div>');
    var pContent = $('<div class="col-md-9"></div>');
    
    var ratingList = ratings(review['Ratings']);
    pRatings.append(ratingList);

    var contentText = review['Content'];
    pContent.append(contentText);

    // End Body
    // Append the sections to the panel's body
    pBody.append(pRatings);
    pBody.append(pContent);

    // Puts the panel together
    panel.append(pHeading);
    panel.append(pBody);

    // Finish with putting the panel in the content area
    content.append(panel);
}

function ratings(ratings) {
    // Creates a list of ratings
    var ul = $('<ul class="list-group"></ul>');
    
    $.each(ratings, function (i, val) {
        var li = $('<li class="list-group-item"></li>');
        ul.append(li.text(i + " : " + val));
    });

    // List of ratings are returned
    return ul;
}