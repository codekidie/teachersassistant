$$(document).on('pageInit',function(e){
    var page = e.detail.page;

 

    if (page.name === 'teachers') {
      $$('.hideonlogin').show();
      $$('.navbar').show();
      var profile_id = $$('.profile_id').val();
      myApp.closeModal();
      myApp.hidePreloader();
      var query = firebase.database().ref("users").orderByKey();
        query.once("value")
          .then(function(snapshot) {
            var content = '';
            snapshot.forEach(function(childSnapshot) {
              var key = childSnapshot.key;
              var childData = childSnapshot.val();
              if (childData.role == 'teacher') {
                content += '<li class="item-content" onclick="deactivate(\''+key+'\')"><div class="item-inner"><div class="item-title">'+childData.fullname+'</div></div></li>';
              }
          });
                $$('#teachersList').html(content);

        });
    }
    

})
