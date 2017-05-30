// Use Jquery document ready for browser compatibility 
$(document).ready( function() {
    var form = $('#ajax-topic');

    $(form).on("submit", function (event) {
        // Prevents the browser from submitting the form
        event.preventDefault();

        // Serializes the form data to an array.
        // This is needed to send it later on with AJAX.
        var formData = $(this).serializeArray();

        // Declare essential variables
        var topic = null;
        var reviewNumber = null;

        // Iterates through with as purpose to initialize the essential variables
        $.each(formData, function (i, obj){
            if (obj.name == 'topic') {
                topic = obj.value;
            } else if (obj.name == 'review') {
                reviewNumber = obj.value;
            }
        });

        // Puts the path directory together
        var jsonRequestDir = '../Reviews/reviews' + reviewNumber + '.json';
        
        // Request for the review
        $.getJSON(jsonRequestDir, function (reviewsData) {
            // Request for the semantics
            $.getJSON('../Reviews/semantics.json', function (semanticsData) {
                var hotel = reviewsData["HotelInfo"];
                var reviews = reviewsData["Reviews"];

                // Clears the area for the next search
                $("#content").empty();

                // Creates the hotel visually 
                createHotelPanel(hotel);

                // Creates a filter for the review's content
                var reviewFilter = createFilter(topic, semanticsData);

                // Creates the reviews visually
                $.each(reviews, function(i, val) {
                    createReviewPanel(val, reviewFilter);
                });
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

function createReviewPanel(review, contentFilter) {
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
    var contentText = createContent(review['Content'], contentFilter);

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

function createFilter(topic, semantics) {
    var filter = { blue: topic };
    var positive = [];
    var negative = [];

    // Appends positive words 
    $.each(semantics['positive'], function(propName, val){
        positive.push(val['phrase']);
    });
    
    // Appends negative words 
    $.each(semantics['negative'], function(propName, val){
        negative.push(val['phrase']);
    });
    
    filter.green = positive;
    filter.red = negative;

    return filter;
}

function highlightFilter(word, filter) {
    var wordHighlighted = null;
    
    if (filter.blue == word) 
        return '<span class="bg-info">' + word + '</span>';

    // Search for a positive word
    $.each(filter.green, function (i, val) {
        if (word == val) {
            // Match!
            wordHighlighted = '<span class="bg-success">' + word + '</span>';
            
            // Stop iterating
            return false;
        }
    });

    // Return when the word was already found
    if (wordHighlighted != null)
        return wordHighlighted;

    // Search for a negative word
    $.each(filter.red, function (i, val) {
        if (word == val) {
            // Match!
            wordHighlighted = '<span class="bg-danger">' + word + '</span>';
            
            // Stop iterating
            return false;
        }
    });

    // Return the highlighted word if it was found
    if (wordHighlighted != null)
        return wordHighlighted; 

    return word;
}

function createContent(content, filter) {
    // Splits every word and puts it in an array
    var words = content.split(" ");
    var newContent = "";

    // Highlights words where needed
    $.each(words, function(i, val){
        newContent += highlightFilter(words[i], filter) + ' ';
    });

    // Return the same content but with highlights where needed
    return newContent;
}