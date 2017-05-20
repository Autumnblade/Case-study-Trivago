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
            var hotel = data["HotelInfo"];
            var reviews = data["Reviews"];

            // Clears the area for the next search
            $("#content").empty();

            // Creates the hotel visually 
            createHotelPanel(hotel);

            // Creates the reviews visually
            $.each(reviews, function(i, val) {
                createReviewPanel(val);
            });
        });
    });
});

function createHotelPanel(hotel){
    var content = $('#content');

    var panel = $('<div class="panel panel-info"></div>');

    // Header
    var pHeading = $('<div class="panel-heading"></div>');

    var title = $('<h3 class="panel-title"></h3>').text(hotel['Name']);

    pHeading.append(title);
    
    // End Header / Begin Body
    var pBody = $('<div class="panel-body row"></div>');

    /// left(image) side
    var leftSection = $('<div class="col-md-3"></div>');
    var image = $('<img class="img-thumbnail" src=' + hotel['ImgURL'] + '>');
    var imageLink = $('<a href="http://www.tripadvisor.com' + hotel['HotelURL'] + '"></a>');
    imageLink.append(image);
        
    /// right(content) side
    var rightSection = $('<div class="col-md-9"></div>');
    var price = $('<h3></h3>').text(hotel['Price']);
    var rsText = hotel['Address'];

    leftSection.append(imageLink);
    rightSection.append(price);
    rightSection.append(rsText);

    // End Body 
    // Append the sections to the panel's body
    pBody.append(leftSection);
    pBody.append(rightSection);

    // Puts the panel together
    panel.append(pHeading);
    panel.append(pBody);

    // Finish with putting the panel in the content area
    content.append(panel);
}

function createReviewPanel(review) {
    var content = $('#content');

    var panel = $('<div class="panel panel-default"></div>');

    // Header
    var pHeading = $('<div class="panel-heading"></div>');

    var title = $('<h3 class="panel-title"></h3>').text(review['Author']);
    var overallRating = $('<p class="pull-right"></p>').text('Gives overal score: ' + review['Ratings']['Overall']);

    pHeading.append(title);
    pHeading.prepend(overallRating);
    
    // End header
    // Body
    var pBody = $('<div class="panel-body row"></div>');

    /// left(ratings) side
    var leftSection = $('<div class="col-md-3"></div>');
    var ratingList = ratings(review['Ratings']);

    /// right(content) side
    var rightSection = $('<div class="col-md-9"></div>');
    var contentText = review['Content'];

    leftSection.append(ratingList);
    rightSection.append(contentText);

    // End Body
    // Append the sections to the panel's body
    pBody.append(leftSection);
    pBody.append(rightSection);

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
        // Overall rating is already presented in the header of the panel.
        if (i != 'Overall') {
            var li = $('<li class="list-group-item"></li>');
            ul.append(li.text(i + " : " + val));
        }
    });

    // List of ratings are returned
    return ul;
}