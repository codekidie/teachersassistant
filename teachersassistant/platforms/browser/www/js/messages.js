function viewMessages(fullname,key)
{
    $$('.viewmessager_fullname').val(fullname);
     var profile_id = $$('.profile_id').val(key);
  
        var content = '<div class="content-block">'+
                        '<div class="content-block">'+
                              '<div class="row"> '+
                                    '<div class="col-100" style="margin: 5px;"><a href="message.html" class="button button-big button-fill color-red">View Messages</a></div>'+ 
                                     '<div class="col-100" style="margin: 5px;"><a href="profile.html" class="button button-big button-fill color-green">View Profile</a></div> '+ 
                               '</div>'+
                          '</div>'+
                       '</div>';

         myApp.modal({
            title:  "Select Navigation",
            text: content,
            buttons: [
              {
                text: 'Close',
                onClick: function() {

                }
              },
            ]
          })                  

}


$$(document).on('pageInit',function(e){
    var page = e.detail.page;
    if (page.name === 'message') {
         var user_id = $$('.statusbar-overlay').data('userid');
        
         $$('.popover-inner').hide();
           var popupHTML = '<div class="popup">'+
                          '<div class="content-block" style="margin-top:200px !important;">'+
                            '<center><img src="./img/ripple.gif"><h1>Loading Messages.</h1></center>'+ '</div>'+
                        '</div>'
            myApp.popup(popupHTML);
            setTimeout(function () {
              $$('.popup ').hide();
              myApp.closeModal();
              myApp.hidePreloader();
              $$('.popup-overlay').hide();
               myApp.alert('Messages Loaded');
            }, 5000);



         var conversationStarted = false;

         var query = firebase.database().ref("users").orderByKey();
          query.once("value")
            .then(function(snapshot) {
              snapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key;
                var childData = childSnapshot.val();
                if (key == user_id) {
                  var current_user_fullname = childData.fullname;
                  var current_user_image = childData.image;
                    $$('.fullname').val(current_user_fullname);
                    $$('.image').val(current_user_image);
                }
            });
          });


            var startListening = function() {
               var myMessages = myApp.messages('.messages', {
                          autoLayout:true
                       });
              var conversationStarted = false;

              var myMessagebar = myApp.messagebar('.messagebar');

              firebase.database().ref("message").on('child_added', function(snapshot) {
                var msg = snapshot.val();
                var reciever_fullname    = $$('.viewmessager_fullname').val();
                var current_userfullname = $$('.fullname').val();
                var messageType = (['sent', 'received'])[Math.round(Math.random())];

                  if (msg.to == reciever_fullname && msg.fullname == current_userfullname || msg.to == current_userfullname && msg.fullname == reciever_fullname) {
                      

                        myMessages.addMessage({
                          // Message text
                          text: msg.message,
                          // Random message type
                          type: messageType,
                          // Avatar and name:
                          avatar: 'http://amadavaothesisrecords.com/uploads_teachers/'+msg.image,
                          name: msg.fullname,
                          // Day
                          day: !conversationStarted ? 'Today' : false,
                          time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
                        })

                        // Update conversation flag
                        conversationStarted = true;

                        $$('.not-empty-state').val('');
                  }

               }); // end firebase
            }

            // Begin listening for data
            startListening();




        $$('.messagebar .link').on('click', function () {
             var message = $$('.not-empty-state').val();



            var db = firebase.database();
            var ref = db.ref("message");
            var newMessage = ref.push();
            var fullname =  $$('.fullname').val();
            var image =  $$('.image').val();
            var contact =  $$('.contact').val();
            var messager_fullname =  $$('.viewmessager_fullname').val();

            newMessage.set({
              fullname: fullname,
              image: image,
              message: message,
              contact: contact,
              to:messager_fullname,
            });

        });
    }
});   