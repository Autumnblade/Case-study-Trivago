// Use Jquery document ready for browser compatibility 
$(document).ready( function() {
    console.log('Document ready!');
    
    var submitButton = document.getElementById('submitTopic');

    submitButton.addEventListener('click', function() {
        console.log('Submitting the topic..');
    });
});