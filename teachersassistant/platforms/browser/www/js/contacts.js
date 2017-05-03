function viewMessages(user_id,key)
{
    $$('.viewmessage_id').val(user_id);
}


$$(document).on('pageInit',function(e){
    var page = e.detail.page;
    if (page.name === 'contacts') {
       $$('.hideonlogin').show();
       $$('.navbar').show();
        var mySearchbar = $$('.searchbar')[0].f7Searchbar;
        var userid = $$('.statusbar-overlay').data('userid');
        var contendata = "";
        var subjectid = $$('.subject-data').val();

        var query = firebase.database().ref("users").orderByKey();
          query.once("value")
            .then(function(snapshot) {
              snapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key;
                var childData = childSnapshot.val();                    

                   contendata += '<li data-id="'+key+'" onclick="viewMessages(\''+childData.fullname+'\',\''+key+'\')" class="contact-item">';
                     contendata += '<a href="#" class="item-link">';
                       contendata += '<div class="item-content">';
                         contendata += '<div class="item-media"><img src="http://amadavaothesisrecords.com/uploads_teachers/'+childData.image+'" width="44"></div>';
                         contendata += '<div class="item-inner">';
                           contendata += '<div class="item-title-row">';
                            contendata += ' <div class="item-title">'+childData.fullname+'</div>';
                          contendata += ' </div>';
                           contendata += '<div class="item-subtitle">'+childData.role+'</div>';
                        contendata += ' </div>';
                      contendata += '</div>';
                    contendata += ' </a>';
                   contendata += '</li>';
                    
            });

            $$('#contactlister').html(contendata);
          
         }); 

     }
});   